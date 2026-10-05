import QRCode from "qrcode";
import { db, orderById, orderTickets } from "./db";
import { orderUrl, qrToken } from "./security";
import { eventDate } from "./types";

const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export function emailReady() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}
export async function deliverTickets(id: string) {
  const order = await orderById(id);
  if (!order || order.status !== "paid") return;
  if (!emailReady()) {
    await db()
      .prepare(
        "UPDATE orders SET email_status='unconfigured' WHERE id=? AND email_status!='sent'",
      )
      .run(id);
    return;
  }
  const claimed = await db()
    .prepare(
      `UPDATE orders SET email_status='sending',email_attempt_at=?
    WHERE id=? AND email_status!='sent' AND (email_status!='sending' OR email_attempt_at<?)`,
    )
    .run(Date.now(), id, Date.now() - 5 * 60000);
  if (!claimed.changes) return;
  try {
    const snapshot = JSON.parse(order.snapshot);
    const tickets = await orderTickets(id);
    const attachments = await Promise.all(
      tickets.map(async (ticket) => ({
        filename: `ticket-${ticket.ordinal}.png`,
        content: (
          await QRCode.toBuffer(qrToken(ticket.id, ticket.event_id), {
            width: 500,
            margin: 2,
          })
        ).toString("base64"),
      })),
    );
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `cavic-order-${id}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [order.email],
        subject: `Your tickets: ${snapshot.eventName}`,
        html: `<h1>You're on the list.</h1><p>Hi ${escape(order.name)}, your ${order.quantity} ticket(s) for <strong>${escape(snapshot.eventName)}</strong> are ready.</p><p>${escape(eventDate(snapshot.startsAt, snapshot.endsAt))}<br>${escape(snapshot.venue)}, ${escape(snapshot.city)}</p><p><a href="${escape(orderUrl(id))}">View and print your tickets</a></p><p>QR codes are attached. Each admits one person and can be used once.</p>`,
        attachments,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok)
      throw new Error(`Email provider returned ${response.status}.`);
    await db()
      .prepare(
        "UPDATE orders SET email_status='sent',email_error=NULL WHERE id=?",
      )
      .run(id);
  } catch (error) {
    await db()
      .prepare(
        "UPDATE orders SET email_status='failed',email_error=? WHERE id=?",
      )
      .run(error instanceof Error ? error.message : "Delivery failed.", id);
  }
}
