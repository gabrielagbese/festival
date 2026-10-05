import {
  atomic,
  db,
  eventById,
  orderByReference,
  orderTickets,
  randomUUID,
  ticketTypes,
  seed,
} from "./db";
import { checkoutSchema } from "./validation";
import { bookingOpen, type Order } from "./types";
import { parseQrToken } from "./security";

export async function createOrder(input: unknown) {
  const data = checkoutSchema.parse(input);
  await seed();
  return await atomic(async () => {
    const event = await eventById(data.eventId);
    if (
      !event ||
      event.status !== "published" ||
      event.is_sample ||
      !bookingOpen(event)
    )
      throw new Error("This event is not open for booking.");
    const ticket = event.tickets.find(
      (t) => t.id === data.ticketTypeId && t.active,
    );
    if (!ticket || ticket.price <= 0 || ticket.available < data.quantity)
      throw new Error(
        "There aren’t enough tickets available. Please choose a lower quantity.",
      );
    const answers: { label: string; value: string | boolean }[] = [];
    for (const field of event.fields) {
      const value = data.answers[field.id];
      if (
        field.required &&
        (value === undefined || value === "" || value === false)
      )
        throw new Error(`${field.label} is required.`);
      if (value !== undefined) {
        if ((field.type === "checkbox") !== (typeof value === "boolean"))
          throw new Error(`Invalid answer for ${field.label}.`);
        if (
          field.type === "select" &&
          value !== "" &&
          !field.options.includes(value as string)
        )
          throw new Error(`Choose an option for ${field.label}.`);
        answers.push({ label: field.label, value });
      }
    }
    const id = randomUUID();
    const reference = `cavic-${randomUUID()}`;
    const now = Date.now();
    const snapshot = {
      eventName: event.name,
      venue: event.venue,
      city: event.city,
      startsAt: event.starts_at,
      endsAt: event.ends_at,
      ticketName: ticket.name,
      unitPrice: ticket.price,
    };
    await db()
      .prepare(
        `INSERT INTO orders (id,reference,event_id,ticket_type_id,name,email,quantity,amount,currency,answers,snapshot,created_at,expires_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      )
      .run(
        id,
        reference,
        event.id,
        ticket.id,
        data.name,
        data.email,
        data.quantity,
        ticket.price * data.quantity,
        "NGN",
        JSON.stringify(answers),
        JSON.stringify(snapshot),
        now,
        now + 30 * 60000,
      );
    return (await db()
      .prepare("SELECT * FROM orders WHERE id=?")
      .get(id)) as unknown as Order;
  });
}
export type Payment = {
  reference: string;
  status: string;
  amount: number;
  currency: string;
  domain: string;
  customer: { email: string };
  paid_at?: string;
};
export async function fulfillPayment(payment: Payment) {
  return await atomic(async () => {
    const order = await orderByReference(payment.reference);
    if (!order) throw new Error("Order not found.");
    if (
      payment.domain !== "live" ||
      payment.amount !== order.amount ||
      payment.currency !== order.currency ||
      payment.customer.email.toLowerCase() !== order.email
    )
      throw new Error("Payment details do not match the order.");
    if (payment.status === "reversed") {
      await db()
        .prepare("UPDATE orders SET status='reversed' WHERE id=?")
        .run(order.id);
      await db()
        .prepare("UPDATE tickets SET voided=1 WHERE order_id=?")
        .run(order.id);
      return order.id;
    }
    if (payment.status !== "success") return order.id;
    if (
      order.status === "paid" ||
      order.status === "review" ||
      order.status === "reversed"
    )
      return order.id;
    const type = (await ticketTypes(order.event_id)).find(
      (t) => t.id === order.ticket_type_id,
    )!;
    const ownHold =
      order.status === "pending" && order.expires_at > Date.now()
        ? order.quantity
        : 0;
    if (type.available + ownHold < order.quantity) {
      await db()
        .prepare("UPDATE orders SET status='review',paid_at=? WHERE id=?")
        .run(Date.now(), order.id);
      return order.id;
    }
    await db()
      .prepare("UPDATE orders SET status='paid',paid_at=? WHERE id=?")
      .run(Date.now(), order.id);
    const insert = db().prepare(
      "INSERT INTO tickets (id,order_id,event_id,ordinal) VALUES (?,?,?,?)",
    );
    for (let i = 1; i <= order.quantity; i++)
      await insert.run(randomUUID(), order.id, order.event_id, i);
    return order.id;
  });
}
export async function checkIn(token: string, selectedEventId: string) {
  const parsed = parseQrToken(token);
  if (parsed.eventId !== selectedEventId)
    throw new Error("This ticket is for a different event.");
  return await atomic(async () => {
    const ticket = (await db()
      .prepare(
        `SELECT t.*,o.name,o.status,o.snapshot FROM tickets t JOIN orders o ON o.id=t.order_id WHERE t.id=? AND t.event_id=?`,
      )
      .get(parsed.id, parsed.eventId)) as unknown as
      | {
          name: string;
          status: string;
          snapshot: string;
          checked_in_at: number | null;
          voided: number;
        }
      | undefined;
    if (!ticket || ticket.voided || ticket.status !== "paid")
      throw new Error("This ticket is not valid for entry.");
    if (ticket.checked_in_at)
      throw new Error(
        `Already checked in at ${new Date(ticket.checked_in_at).toLocaleTimeString("en-NG", { timeZone: "Africa/Lagos" })}.`,
      );
    await db()
      .prepare(
        "UPDATE tickets SET checked_in_at=? WHERE id=? AND checked_in_at IS NULL",
      )
      .run(Date.now(), parsed.id);
    return {
      name: ticket.name,
      ticketName: JSON.parse(ticket.snapshot).ticketName,
    };
  });
}
export { orderTickets };
