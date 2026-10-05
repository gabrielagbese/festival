import { createOrder } from "@/lib/ticketing/orders";
import { initializePayment, paymentsReady } from "@/lib/ticketing/paystack";
import { db, rateLimit } from "@/lib/ticketing/db";
import { orderUrl } from "@/lib/ticketing/security";
import { checkoutSchema } from "@/lib/ticketing/validation";
import { failure, readJson, sameOrigin, HttpError } from "@/lib/ticketing/http";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    if (!paymentsReady())
      throw new HttpError("Live payments are not configured yet.", 503);
    const input = checkoutSchema.parse(await readJson(request));
    await rateLimit(`checkout:${input.email}`, 6, 3600000);
    await rateLimit("checkout-global", 120, 60000);
    const order = await createOrder(input);
    try {
      const payment = await initializePayment(order);
      return Response.json({
        accessCode: payment.access_code,
        orderUrl: orderUrl(order.id),
      });
    } catch (error) {
      await db()
        .prepare(
          "UPDATE orders SET status='failed' WHERE id=? AND status='pending'",
        )
        .run(order.id);
      throw error;
    }
  } catch (error) {
    return failure(error);
  }
}
