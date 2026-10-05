import { fulfillPayment, type Payment } from "./orders";
import { db, orderById } from "./db";
import { orderUrl } from "./security";
import { HttpError } from "./http";
import type { Order } from "./types";

export function paymentsReady() {
  return process.env.PAYSTACK_SECRET_KEY?.startsWith("sk_live_") === true;
}
async function paystack<T>(path: string, body?: object): Promise<T> {
  if (!paymentsReady())
    throw new HttpError(
      "Live payments are not configured yet. Please contact the organiser.",
      503,
    );
  const response = await fetch(`https://api.paystack.co/${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const payload = await response.json();
  if (!response.ok || !payload.status)
    throw new HttpError(
      "Paystack could not complete the request. Please try again.",
      502,
    );
  return payload.data as T;
}
export function initializePayment(order: Order) {
  return paystack<{ access_code: string; reference: string }>(
    "transaction/initialize",
    {
      reference: order.reference,
      amount: order.amount,
      email: order.email,
      currency: order.currency,
      callback_url: orderUrl(order.id),
      metadata: { order_id: order.id, event_id: order.event_id },
    },
  );
}
export async function verifyPayment(orderId: string) {
  const order = await orderById(orderId);
  if (!order) throw new HttpError("Order not found.", 404);
  await db()
    .prepare("UPDATE orders SET last_verified_at=? WHERE id=?")
    .run(Date.now(), order.id);
  const payment = await paystack<Payment>(
    `transaction/verify/${encodeURIComponent(order.reference)}`,
  );
  if (payment.reference !== order.reference)
    throw new HttpError("Payment reference mismatch.", 502);
  await fulfillPayment(payment);
  return (await orderById(orderId))!;
}
