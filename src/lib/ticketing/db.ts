import {
  createClient,
  type Client,
  type InValue,
  type Transaction,
} from "@libsql/client";
import { AsyncLocalStorage } from "node:async_hooks";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import type { Event, TicketType, Order, Ticket } from "./types";

let connection: Client | undefined;
let initialized: Promise<void> | undefined;
const context = new AsyncLocalStorage<Transaction>();
let writeQueue: Promise<void> = Promise.resolve();
function client() {
  if (connection) return connection;
  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  if (
    process.env.NODE_ENV === "production" &&
    (!url || url.startsWith("file:"))
  )
    throw new Error(
      "A hosted TURSO_DATABASE_URL is required for production ticketing.",
    );
  const localPath = resolve(
    /* turbopackIgnore: true */ process.env.DATABASE_PATH ||
      "./data/cavic.sqlite",
  );
  if (!url || url.startsWith("file:"))
    mkdirSync(dirname(url ? new URL(url).pathname : localPath), {
      recursive: true,
      mode: 0o700,
    });
  connection = createClient({
    url: url || `file:${localPath}`,
    authToken: process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN,
    intMode: "number",
  });
  return connection;
}
async function ready() {
  if (!initialized)
    initialized = client()
      .batch(
        SCHEMA.split(";")
          .map((s) => s.trim())
          .filter(Boolean),
        "write",
      )
      .then(async () => {
        const columns = await client().execute("PRAGMA table_info(events)");
        if (!columns.rows.some((row) => row.name === "ends_at")) {
          try {
            await client().execute(
              "ALTER TABLE events ADD COLUMN ends_at TEXT NOT NULL DEFAULT ''",
            );
          } catch (error) {
            const updated = await client().execute("PRAGMA table_info(events)");
            if (!updated.rows.some((row) => row.name === "ends_at"))
              throw error;
          }
        }
      })
      .catch((error) => {
        initialized = undefined;
        throw error;
      });
  await initialized;
}
const SCHEMA = `    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
      description TEXT NOT NULL, venue TEXT NOT NULL, city TEXT NOT NULL,
      starts_at TEXT NOT NULL, ends_at TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'draft',
      is_sample INTEGER NOT NULL DEFAULT 0, capacity INTEGER NOT NULL DEFAULT 200, category TEXT NOT NULL, fields TEXT NOT NULL DEFAULT '[]'
    );
    CREATE TABLE IF NOT EXISTS ticket_types (
      id TEXT PRIMARY KEY, event_id TEXT NOT NULL REFERENCES events(id), name TEXT NOT NULL,
      description TEXT NOT NULL, price INTEGER NOT NULL CHECK(price>=0), capacity INTEGER NOT NULL CHECK(capacity>0),
      active INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY, reference TEXT UNIQUE NOT NULL, event_id TEXT NOT NULL REFERENCES events(id),
      ticket_type_id TEXT NOT NULL REFERENCES ticket_types(id), name TEXT NOT NULL, email TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK(quantity>0), amount INTEGER NOT NULL CHECK(amount>0), currency TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending', answers TEXT NOT NULL, snapshot TEXT NOT NULL,
      created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL, paid_at INTEGER,
      email_status TEXT NOT NULL DEFAULT 'pending', email_error TEXT, email_attempt_at INTEGER, last_verified_at INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id), event_id TEXT NOT NULL REFERENCES events(id),
      ordinal INTEGER NOT NULL, checked_in_at INTEGER, voided INTEGER NOT NULL DEFAULT 0,
      UNIQUE(order_id, ordinal)
    );
    CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, until INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS orders_inventory ON orders(ticket_type_id,status,expires_at);
    CREATE INDEX IF NOT EXISTS tickets_event ON tickets(event_id);
`;
export function db() {
  return {
    prepare(sql: string) {
      const execute = async (args: InValue[]) => {
        await ready();
        return (context.getStore() || client()).execute({ sql, args });
      };
      return {
        async get(...args: InValue[]) {
          return (await execute(args)).rows[0];
        },
        async all(...args: InValue[]) {
          return (await execute(args)).rows;
        },
        async run(...args: InValue[]) {
          const result = await execute(args);
          return { changes: result.rowsAffected };
        },
      };
    },
    async exec(sql: string) {
      await ready();
      for (const statement of sql
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean))
        await (context.getStore() || client()).execute(statement);
    },
    close() {
      connection?.close();
      connection = undefined;
      initialized = undefined;
    },
  };
}
export async function atomic<T>(fn: () => Promise<T>): Promise<T> {
  if (context.getStore()) return fn();
  await ready();
  // Queue writes in this process; the database transaction also protects
  // inventory across independent Vercel instances.
  const previous = writeQueue;
  let release!: () => void;
  writeQueue = new Promise<void>((resolve) => {
    release = resolve;
  });
  await previous;
  let transaction: Transaction | undefined;
  try {
    transaction = await client().transaction("write");
    const result = await context.run(transaction, fn);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction?.rollback();
    throw error;
  } finally {
    try {
      transaction?.close();
    } finally {
      release();
    }
  }
}
export async function seed() {
  if (await db().prepare("SELECT id FROM events WHERE id='cavic-2026'").get())
    return;
  await atomic(async () => {
    if (await db().prepare("SELECT id FROM events WHERE id='cavic-2026'").get())
      return;
    await db()
      .prepare(
        "INSERT INTO events (id,slug,name,description,venue,city,starts_at,ends_at,status,is_sample,capacity,category,fields) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
      )
      .run(
        "cavic-2026",
        "cavicfestival2026",
        "Cavic Festival of Creativity & Technology",
        "Infinite Realms: Beyond Imagination. Join us in Abuja from 5–7 November 2026 for exhibitions, interactive art installations, performances, panel discussions, music and spoken words.",
        "No. 30 Agadez Crescent, Wuse 2",
        "Abuja, Nigeria",
        "2026-11-05T09:00:00.000Z",
        "2026-11-07T18:30:00.000Z",
        "draft",
        0,
        200,
        "Creativity & technology",
        JSON.stringify([
          {
            id: "phone",
            label: "Phone number",
            type: "text",
            required: false,
            options: [],
          },
        ]),
      );
    // Event details and prices match the existing public Cavic 2026 listing.
    await db()
      .prepare("INSERT INTO ticket_types VALUES (?,?,?,?,?,?,?)")
      .run(
        "cavic-general",
        "cavic-2026",
        "Regular",
        "Celebrate creativity, culture and community at Cavic Festival 2026.",
        500000,
        200,
        1,
      );
  });
}
export async function ticketTypes(eventId: string): Promise<TicketType[]> {
  const totals = await db()
    .prepare(
      `SELECT e.capacity, COALESCE(SUM(CASE WHEN o.status IN ('paid','review') OR (o.status='pending' AND o.expires_at>?) THEN o.quantity ELSE 0 END),0) AS allocated FROM events e LEFT JOIN orders o ON o.event_id=e.id WHERE e.id=? GROUP BY e.id`,
    )
    .get(Date.now(), eventId);
  const eventAvailable = Math.max(
    0,
    Number(totals?.capacity || 0) - Number(totals?.allocated || 0),
  );
  return (
    (await db()
      .prepare(
        `SELECT t.*,
    COALESCE((SELECT SUM(quantity) FROM orders o WHERE o.ticket_type_id=t.id AND o.status IN ('paid','review')),0) AS sold,
    COALESCE((SELECT SUM(quantity) FROM orders o WHERE o.ticket_type_id=t.id AND o.status='pending' AND o.expires_at>?),0) AS reserved
    FROM ticket_types t WHERE event_id=? ORDER BY rowid`,
      )
      .all(Date.now(), eventId)) as unknown as TicketType[]
  ).map((t) => ({
    ...t,
    available: Math.max(
      0,
      Math.min(eventAvailable, t.capacity - t.sold - t.reserved),
    ),
  }));
}
export async function events(): Promise<Event[]> {
  await seed();
  const rows = (await db()
    .prepare("SELECT * FROM events ORDER BY rowid DESC")
    .all()) as unknown as (Omit<Event, "fields" | "tickets"> & {
    fields: string;
  })[];
  return Promise.all(
    rows.map(async (e) => ({
      ...e,
      fields: JSON.parse(e.fields),
      tickets: await ticketTypes(e.id),
    })),
  );
}
export async function eventById(id: string): Promise<Event | undefined> {
  await seed();
  const row = (await db()
    .prepare("SELECT * FROM events WHERE id=?")
    .get(id)) as unknown as
    | (Omit<Event, "fields" | "tickets"> & { fields: string })
    | undefined;
  return row
    ? { ...row, fields: JSON.parse(row.fields), tickets: await ticketTypes(id) }
    : undefined;
}
export async function orderById(id: string) {
  return (await db()
    .prepare("SELECT * FROM orders WHERE id=?")
    .get(id)) as unknown as Order | undefined;
}
export async function orderByReference(ref: string) {
  return (await db()
    .prepare("SELECT * FROM orders WHERE reference=?")
    .get(ref)) as unknown as Order | undefined;
}
export async function orderTickets(id: string) {
  return (await db()
    .prepare("SELECT * FROM tickets WHERE order_id=? ORDER BY ordinal")
    .all(id)) as unknown as Ticket[];
}
export async function rateLimit(key: string, max: number, windowMs: number) {
  await atomic(async () => {
    const now = Date.now();
    await db().prepare("DELETE FROM rate_limits WHERE until<?").run(now);
    const row = await db()
      .prepare("SELECT count FROM rate_limits WHERE key=?")
      .get(key);
    if (row && Number(row.count) >= max)
      throw new Error("Too many attempts. Please try again later.");
    await db()
      .prepare(
        "INSERT INTO rate_limits VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET count=count+1",
      )
      .run(key, 1, now + windowMs);
  });
}
export { randomUUID };
