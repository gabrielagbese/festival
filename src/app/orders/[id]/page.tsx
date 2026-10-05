import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { orderById, orderTickets } from "@/lib/ticketing/db";
import { validOrderToken, qrToken } from "@/lib/ticketing/security";
import { Brand } from "@/components/ticketing/brand";
import { OrderStatus, PrintButton } from "@/components/ticketing/order-status";
import { eventDate, money } from "@/lib/ticketing/types";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Your tickets — Cavic Festival",
  robots: { index: false, follow: false },
};
export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;
  if (!token || !validOrderToken(id, token)) notFound();
  const order = await orderById(id);
  if (!order) notFound();
  const snapshot = JSON.parse(order.snapshot);
  const tickets = await Promise.all(
    (await orderTickets(id)).map(async (ticket) => ({
      ...ticket,
      qr: await QRCode.toDataURL(qrToken(ticket.id, ticket.event_id), {
        width: 360,
        margin: 2,
      }),
    })),
  );
  return (
    <div className="cavic-ticketing order-page">
      <div className="order-top">
        <Brand />
        <a href="/2026#tickets">Back to festival →</a>
      </div>
      <span className="eyebrow">
        {order.status === "paid" ? "YOU’RE ON THE LIST" : "YOUR ORDER"}
      </span>
      <h1>
        {order.status === "paid"
          ? "See you there."
          : order.status === "review"
            ? "Payment received. We’re checking your booking."
            : order.status === "reversed"
              ? "This booking is no longer valid."
              : "Confirming your payment."}
      </h1>
      <p>
        {snapshot.eventName} · {order.quantity} ticket
        {order.quantity !== 1 ? "s" : ""} · {money(order.amount)}
      </p>
      {order.status === "review" && (
        <p className="notice">
          Your payment arrived after the inventory hold expired and there were
          not enough tickets left. Contact the organiser with reference{" "}
          {order.reference} to arrange resolution:
          submissions@cavicfestival.africa / +2349028346940.
        </p>
      )}
      {["pending", "failed"].includes(order.status) && (
        <OrderStatus id={id} token={token} />
      )}
      {order.status === "paid" && (
        <>
          <p className="muted">
            Your tickets are ready below. Keep this link private. Show each QR
            code at entry.
          </p>
          <div className="print-action">
            <PrintButton />
          </div>
          <div className="issued-tickets">
            {tickets.map((ticket) => (
              <article
                className={`issued-ticket ${ticket.voided ? "void" : ""}`}
                key={ticket.id}
              >
                <div>
                  <span className="eyebrow">
                    ADMIT ONE · {ticket.ordinal} OF {order.quantity}
                  </span>
                  <h2>{snapshot.eventName}</h2>
                  <p>{eventDate(snapshot.startsAt, snapshot.endsAt)} WAT</p>
                  <p>
                    {snapshot.venue}
                    <br />
                    {snapshot.city}
                  </p>
                  <strong>{order.name}</strong>
                  <p>{snapshot.ticketName}</p>
                  <span className="pill">
                    {ticket.voided
                      ? "Voided"
                      : ticket.checked_in_at
                        ? "Checked in"
                        : "Ready for entry"}
                  </span>
                </div>
                <div className="qr-wrap">
                  <img
                    src={ticket.qr}
                    alt={`QR code for ticket ${ticket.ordinal}`}
                    width={180}
                    height={180}
                  />
                  <a
                    download={`cavic-ticket-${ticket.ordinal}.png`}
                    href={ticket.qr}
                  >
                    Download QR
                  </a>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      <small className="order-reference">
        Order reference: {order.reference}
      </small>
    </div>
  );
}
