import { validWebhook } from "@/lib/ticketing/security";
import { orderByReference } from "@/lib/ticketing/db";
import { verifyPayment } from "@/lib/ticketing/paystack";
import { deliverTickets } from "@/lib/ticketing/email";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(request: Request) {
  const body = await request.text();
  if (
    body.length > 1000000 ||
    !validWebhook(body, request.headers.get("x-paystack-signature"))
  )
    return Response.json({ error: "Invalid signature." }, { status: 401 });
  try {
    const event = JSON.parse(body);
    if (
      event.event === "charge.success" ||
      event.event === "refund.processed"
    ) {
      const ref =
        event.event === "charge.success"
          ? event.data?.reference
          : event.data?.transaction?.reference;
      if (typeof ref === "string") {
        const order = await orderByReference(ref);
        if (order) {
          await verifyPayment(order.id);
          await deliverTickets(order.id);
        }
      }
    }
    return Response.json({ received: true });
  } catch {
    return Response.json(
      { error: "Could not process notification; retry required." },
      { status: 503 },
    );
  }
}
