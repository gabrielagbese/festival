import { test, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHmac } from "node:crypto";
import {
  db,
  seed,
  orderById,
  orderTickets,
  ticketTypes,
  rateLimit,
} from "../src/lib/ticketing/db";
import {
  createOrder,
  fulfillPayment,
  checkIn,
  type Payment,
} from "../src/lib/ticketing/orders";
import {
  qrToken,
  validOrderToken,
  orderToken,
  validWebhook,
  validSession,
  makeSession,
} from "../src/lib/ticketing/security";
import { eventSchema } from "../src/lib/ticketing/validation";

const directory = mkdtempSync(join(tmpdir(), "cavic-tests-"));
process.env.DATABASE_PATH = join(directory, "test.sqlite");
process.env.TICKET_SECRET = "unit-test-ticket-secret-that-is-not-a-live-key";
process.env.AUTH_SECRET = "unit-test-session-secret-that-is-not-a-live-key";
process.env.ADMIN_EMAIL = "admin@example.com";
beforeEach(async () => {
  await db().exec(
    "DELETE FROM tickets; DELETE FROM orders; DELETE FROM ticket_types; DELETE FROM events; DELETE FROM rate_limits;",
  );
  await seed();
  await db()
    .prepare("UPDATE events SET status='published',is_sample=0,starts_at=?")
    .run(new Date(Date.now() + 86400000).toISOString());
  await db()
    .prepare(
      "UPDATE ticket_types SET capacity=4,price=500000 WHERE id='cavic-general'",
    )
    .run();
});
after(async () => {
  db().close();
  rmSync(directory, { recursive: true, force: true });
});
const buyer = (quantity = 1) => ({
  eventId: "cavic-2026",
  ticketTypeId: "cavic-general",
  quantity,
  name: "Ada Buyer",
  email: "ada@example.com",
  consent: true as const,
  answers: { phone: "08000000000" },
});
const payment = (order: Awaited<ReturnType<typeof createOrder>>): Payment => ({
  reference: order.reference,
  status: "success",
  amount: order.amount,
  currency: "NGN",
  domain: "live",
  customer: { email: order.email },
});

test("server calculates amount; client-provided prices cannot override it", async () => {
  const order = await createOrder({ ...buyer(2), amount: 1 });
  assert.equal(order.amount, 1000000);
  assert.equal(order.status, "pending");
});
test("active inventory holds prevent overselling", async () => {
  await createOrder(buyer(3));
  await assert.rejects(
    async () => await createOrder(buyer(2)),
    /enough tickets/,
  );
  assert.equal((await ticketTypes("cavic-2026"))[0].available, 1);
});
test("expired unpaid holds release inventory", async () => {
  const order = await createOrder(buyer(4));
  await db().prepare("UPDATE orders SET expires_at=0 WHERE id=?").run(order.id);
  assert.equal((await ticketTypes("cavic-2026"))[0].available, 4);
  await assert.doesNotReject(async () => await createOrder(buyer(4)));
});
test("repeated payment confirmation fulfills an order once, with one ticket per quantity", async () => {
  const order = await createOrder(buyer(3));
  await fulfillPayment(payment(order));
  await fulfillPayment(payment(order));
  assert.equal((await orderById(order.id))?.status, "paid");
  assert.equal((await orderTickets(order.id)).length, 3);
  assert.equal((await ticketTypes("cavic-2026"))[0].sold, 3);
});
test("mismatched amounts, currencies, customer emails, and test-mode transactions issue no tickets", async () => {
  const order = await createOrder(buyer());
  for (const patch of [
    { amount: 1 },
    { currency: "USD" },
    { customer: { email: "other@example.com" } },
    { domain: "test" },
  ])
    await assert.rejects(
      async () => await fulfillPayment({ ...payment(order), ...patch }),
      /do not match/,
    );
  assert.equal((await orderTickets(order.id)).length, 0);
});
test("a pending payment never issues tickets", async () => {
  const order = await createOrder(buyer());
  await fulfillPayment({ ...payment(order), status: "pending" });
  assert.equal((await orderTickets(order.id)).length, 0);
});
test("late payment with exhausted inventory is flagged for review", async () => {
  const first = await createOrder(buyer(4));
  await db().prepare("UPDATE orders SET expires_at=0 WHERE id=?").run(first.id);
  const second = await createOrder(buyer(4));
  await fulfillPayment(payment(second));
  await fulfillPayment(payment(first));
  assert.equal((await orderById(first.id))?.status, "review");
  assert.equal((await orderTickets(first.id)).length, 0);
});
test("late successful payment can fulfill if inventory is still available", async () => {
  const order = await createOrder(buyer());
  await db().prepare("UPDATE orders SET expires_at=0 WHERE id=?").run(order.id);
  await fulfillPayment(payment(order));
  assert.equal((await orderTickets(order.id)).length, 1);
});
test("check-in rejects forged tickets, wrong events, and repeat admission", async () => {
  const order = await createOrder(buyer());
  await fulfillPayment(payment(order));
  const ticket = (await orderTickets(order.id))[0];
  const token = qrToken(ticket.id, ticket.event_id);
  await assert.rejects(
    async () => await checkIn(`${token}x`, ticket.event_id),
    /altered/,
  );
  await assert.rejects(
    async () => await checkIn(token, "another-event"),
    /different event/,
  );
  assert.equal((await checkIn(token, ticket.event_id)).name, "Ada Buyer");
  await assert.rejects(
    async () => await checkIn(token, ticket.event_id),
    /Already checked in/,
  );
});
test("reversed payments invalidate issued tickets and cannot be reissued by stale success events", async () => {
  const order = await createOrder(buyer());
  await fulfillPayment(payment(order));
  const ticket = (await orderTickets(order.id))[0];
  await fulfillPayment({ ...payment(order), status: "reversed" });
  await fulfillPayment(payment(order));
  assert.equal((await orderById(order.id))?.status, "reversed");
  await assert.rejects(
    async () =>
      await checkIn(qrToken(ticket.id, ticket.event_id), ticket.event_id),
    /not valid/,
  );
});
test("draft and sample events cannot accept orders", async () => {
  await db().exec("UPDATE events SET status='draft'");
  await assert.rejects(async () => await createOrder(buyer()), /not open/);
  await db().exec("UPDATE events SET status='published',is_sample=1");
  await assert.rejects(async () => await createOrder(buyer()), /not open/);
});
test("required form answers and dropdown options are checked on the server", async () => {
  await db()
    .prepare("UPDATE events SET fields=?")
    .run(
      JSON.stringify([
        {
          id: "diet",
          label: "Diet",
          type: "select",
          required: true,
          options: ["Regular", "Vegetarian"],
        },
      ]),
    );
  await assert.rejects(
    async () => await createOrder(buyer()),
    /Diet is required/,
  );
  await assert.rejects(
    async () => await createOrder({ ...buyer(), answers: { diet: "Invalid" } }),
    /Choose an option/,
  );
  await assert.doesNotReject(
    async () =>
      await createOrder({ ...buyer(), answers: { diet: "Vegetarian" } }),
  );
});
test("order access tokens are bound to an order, and sessions reject tampering", async () => {
  const token = orderToken("order-a");
  assert.equal(validOrderToken("order-a", token), true);
  assert.equal(validOrderToken("order-b", token), false);
  const session = makeSession();
  assert.equal(validSession(session), true);
  assert.equal(validSession(`${session}x`), false);
});
test("webhook signatures verify raw body and reject changes", async () => {
  process.env.PAYSTACK_SECRET_KEY = "sk_live_unit_test_fixture_only";
  const body = '{"event":"charge.success"}';
  const mac = createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(body)
    .digest("hex");
  assert.equal(validWebhook(body, mac), true);
  assert.equal(validWebhook(`${body} `, mac), false);
  assert.equal(validWebhook(body, null), false);
  delete process.env.PAYSTACK_SECRET_KEY;
});
test("rate limiting blocks repeated attempts", async () => {
  await rateLimit("login", 2, 60000);
  await rateLimit("login", 2, 60000);
  await assert.rejects(
    async () => await rateLimit("login", 2, 60000),
    /Too many attempts/,
  );
});
test("publishing sample content is rejected by the event schema", async () => {
  const result = eventSchema.safeParse({
    name: "Sample",
    slug: "sample",
    description: "A sample event description",
    venue: "Venue",
    city: "Lagos",
    starts_at: new Date().toISOString(),
    status: "published",
    is_sample: true,
    category: "Music",
    fields: [],
    tickets: [
      {
        name: "General",
        description: "",
        price: 10000,
        capacity: 10,
        active: true,
      },
    ],
  });
  assert.equal(result.success, false);
});

test("Cavic defaults to a real draft and a total capacity of 200", async () => {
  await db().exec(
    "DELETE FROM tickets; DELETE FROM orders; DELETE FROM ticket_types; DELETE FROM events;",
  );
  await seed();
  const { eventById } = await import("../src/lib/ticketing/db");
  const event = (await eventById("cavic-2026"))!;
  assert.equal(event.status, "draft");
  assert.equal(event.is_sample, 0);
  assert.equal(event.capacity, 200);
  assert.equal(event.city, "Abuja, Nigeria");
  assert.equal(event.starts_at, "2026-11-05T09:00:00.000Z");
  assert.equal(event.ends_at, "2026-11-07T18:30:00.000Z");
  assert.equal(event.venue, "No. 30 Agadez Crescent, Wuse 2");
  assert.equal(event.tickets[0].name, "Regular");
  assert.equal(event.tickets[0].price, 500000);
  await assert.rejects(() => createOrder(buyer()), /not open/);
});
test("different ticket types share the total event capacity", async () => {
  await db().prepare("UPDATE events SET capacity=3").run();
  await db()
    .prepare("INSERT INTO ticket_types VALUES (?,?,?,?,?,?,?)")
    .run("another-tier", "cavic-2026", "Another tier", "", 900000, 10, 1);
  await createOrder(buyer(2));
  await assert.rejects(
    () => createOrder({ ...buyer(2), ticketTypeId: "another-tier" }),
    /enough tickets/,
  );
  assert.equal(
    (await ticketTypes("cavic-2026")).find((t) => t.id === "another-tier")
      ?.available,
    1,
  );
});
test("drafts save incomplete details but publishing needs a venue, date and price", async () => {
  const { saveEvent } = await import("../src/lib/ticketing/admin");
  const { eventById } = await import("../src/lib/ticketing/db");
  const event = (await eventById("cavic-2026"))!;
  const draft = {
    ...event,
    status: "draft",
    is_sample: false,
    venue: "",
    starts_at: "",
    ends_at: "",
    tickets: event.tickets.map((t) => ({ ...t, price: 0, active: true })),
  };
  await saveEvent(draft);
  await assert.rejects(
    () => saveEvent({ ...draft, status: "published" }),
    /venue|date|prices/i,
  );
});
test("concurrent purchases cannot oversell", async () => {
  const results = await Promise.allSettled([
    createOrder(buyer(3)),
    createOrder(buyer(3)),
  ]);
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  const rejected = results.find(
    (r) => r.status === "rejected",
  ) as PromiseRejectedResult;
  assert.match(rejected.reason.message, /enough tickets/);
  assert.equal((await ticketTypes("cavic-2026"))[0].available, 1);
  await assert.doesNotReject(() => createOrder(buyer(1)));
});

test("multi-day events keep sales open until their end and preserve the range on tickets", async () => {
  const start = new Date(Date.now() - 86400000).toISOString();
  const end = new Date(Date.now() + 86400000).toISOString();
  await db().prepare("UPDATE events SET starts_at=?,ends_at=?").run(start, end);
  const order = await createOrder(buyer());
  assert.equal(JSON.parse(order.snapshot).startsAt, start);
  assert.equal(JSON.parse(order.snapshot).endsAt, end);
  await db()
    .prepare("UPDATE events SET ends_at=?")
    .run(new Date(Date.now() - 1000).toISOString());
  await assert.rejects(() => createOrder(buyer()), /not open/);
});

test("event end must follow its start and single-day events close at the start", async () => {
  const { saveEvent } = await import("../src/lib/ticketing/admin");
  const { eventById } = await import("../src/lib/ticketing/db");
  const event = (await eventById("cavic-2026"))!;
  await assert.rejects(
    () =>
      saveEvent({
        ...event,
        is_sample: false,
        ends_at: new Date(Date.parse(event.starts_at) - 1000).toISOString(),
        tickets: event.tickets.map((t) => ({ ...t, active: true })),
      }),
    /end date/,
  );
  await db()
    .prepare("UPDATE events SET starts_at=?,ends_at='' ")
    .run(new Date(Date.now() - 1000).toISOString());
  await assert.rejects(() => createOrder(buyer()), /not open/);
});
