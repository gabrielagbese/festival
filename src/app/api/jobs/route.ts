import { db } from "@/lib/ticketing/db";
import { verifyPayment } from "@/lib/ticketing/paystack";
import { deliverTickets } from "@/lib/ticketing/email";
import { safeEqual } from "@/lib/ticketing/security";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (
    !secret ||
    !safeEqual(request.headers.get("authorization") || "", `Bearer ${secret}`)
  )
    return Response.json({ error: "Unauthorised." }, { status: 401 });
  const pending = (await db()
    .prepare(
      "SELECT id FROM orders WHERE status IN ('pending','paid','failed') AND created_at>? ORDER BY last_verified_at LIMIT 20",
    )
    .all(Date.now() - 7 * 86400000)) as unknown as { id: string }[];
  const deadline = Date.now() + 35000;
  let verified = 0;
  for (const order of pending) {
    if (Date.now() > deadline) break;
    try {
      await verifyPayment(order.id);
      verified++;
    } catch {
      /* Next scheduled run retries. */
    }
  }
  const email = (await db()
    .prepare(
      "SELECT id FROM orders WHERE status='paid' AND email_status!='sent' LIMIT 20",
    )
    .all()) as unknown as { id: string }[];
  let deliveryAttempts = 0;
  for (const order of email) {
    if (Date.now() > deadline) break;
    await deliverTickets(order.id);
    deliveryAttempts++;
  }
  return Response.json({ verified, deliveryAttempts });
}

export const GET = POST;
