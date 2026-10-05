import { atomic, db, eventById, events, randomUUID } from "./db";
import { eventSchema } from "./validation";
import { orderUrl } from "./security";
import { paymentsReady } from "./paystack";
import { emailReady } from "./email";
import { bookingOpen, type Order } from "./types";

export async function dashboardData() {
  const list = await events();
  const orders = (
    (await db()
      .prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 250")
      .all()) as unknown as Order[]
  ).map((o) => ({ ...o, url: orderUrl(o.id) }));
  const totals = (await db()
    .prepare(
      `SELECT COALESCE(SUM(CASE WHEN status='paid' THEN amount ELSE 0 END),0) AS revenue,
    COALESCE(SUM(CASE WHEN status='paid' THEN quantity ELSE 0 END),0) AS tickets,
    SUM(CASE WHEN status='review' THEN 1 ELSE 0 END) AS reviews FROM orders`,
    )
    .get()) as unknown as { revenue: number; tickets: number; reviews: number };
  const checkedIn = (
    (await db()
      .prepare(
        "SELECT COUNT(*) AS count FROM tickets WHERE checked_in_at IS NOT NULL AND voided=0",
      )
      .get()) as unknown as { count: number }
  ).count;
  return {
    events: list,
    orders,
    stats: { ...totals, reviews: totals.reviews || 0, checkedIn },
    setup: {
      payments: paymentsReady(),
      email: emailReady(),
      database: Boolean(
        process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL,
      )
        ? "Hosted database"
        : "Local development database",
    },
  };
}
export type DashboardData = Awaited<ReturnType<typeof dashboardData>>;
export async function saveEvent(input: unknown) {
  const event = eventSchema.parse(input);
  await events();
  return await atomic(async () => {
    const id = event.id || randomUUID();
    const existing = event.id ? await eventById(id) : undefined;
    if (event.id && !existing) throw new Error("Event not found.");
    if (
      await db()
        .prepare("SELECT id FROM events WHERE slug=? AND id!=?")
        .get(event.slug, id)
    )
      throw new Error("That event URL is already in use.");
    if (event.status === "published" && !bookingOpen(event))
      throw new Error("Choose an event that has not ended before publishing.");
    if (
      existing &&
      event.capacity <
        existing.tickets.reduce((sum, t) => sum + t.sold + t.reserved, 0)
    )
      throw new Error(
        "Event capacity cannot be lower than sold and reserved tickets.",
      );
    const ids = event.tickets.flatMap((t) => (t.id ? [t.id] : []));
    if (new Set(ids).size !== ids.length)
      throw new Error("Ticket types must be unique.");
    for (const ticket of event.tickets) {
      if (ticket.id) {
        const previous = existing?.tickets.find((t) => t.id === ticket.id);
        if (!previous)
          throw new Error("Ticket type does not belong to this event.");
        if (ticket.capacity < previous.sold + previous.reserved)
          throw new Error(
            `${ticket.name}: capacity cannot be lower than sold and reserved tickets.`,
          );
      }
    }
    await db()
      .prepare(
        `INSERT INTO events (id,slug,name,description,venue,city,starts_at,ends_at,status,is_sample,capacity,category,fields) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET
      slug=excluded.slug,name=excluded.name,description=excluded.description,venue=excluded.venue,city=excluded.city,
      starts_at=excluded.starts_at,ends_at=excluded.ends_at,status=excluded.status,is_sample=excluded.is_sample,capacity=excluded.capacity,category=excluded.category,fields=excluded.fields`,
      )
      .run(
        id,
        event.slug,
        event.name,
        event.description,
        event.venue,
        event.city,
        event.starts_at ? new Date(event.starts_at).toISOString() : "",
        event.ends_at ? new Date(event.ends_at).toISOString() : "",
        event.status,
        Number(event.is_sample),
        event.capacity,
        event.category,
        JSON.stringify(event.fields),
      );
    await db()
      .prepare("UPDATE ticket_types SET active=0 WHERE event_id=?")
      .run(id);
    for (const ticket of event.tickets)
      await db()
        .prepare(
          `INSERT INTO ticket_types VALUES (?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,description=excluded.description,price=excluded.price,capacity=excluded.capacity,active=excluded.active`,
        )
        .run(
          ticket.id || randomUUID(),
          id,
          ticket.name,
          ticket.description,
          ticket.price,
          ticket.capacity,
          Number(ticket.active),
        );
    return id;
  });
}
