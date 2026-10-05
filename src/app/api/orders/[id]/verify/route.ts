import { verifyPayment } from "@/lib/ticketing/paystack";
import { deliverTickets } from "@/lib/ticketing/email";
import { validOrderToken } from "@/lib/ticketing/security";
import { rateLimit } from "@/lib/ticketing/db";
import { failure, HttpError, readJson, sameOrigin } from "@/lib/ticketing/http";
export const runtime = "nodejs";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    sameOrigin(request);
    const { id } = await params;
    const data = await readJson(request);
    if (typeof data.token !== "string" || !validOrderToken(id, data.token))
      throw new HttpError("Order not found.", 404);
    await rateLimit(`verify:${id}`, 20, 60000);
    const order = await verifyPayment(id);
    await deliverTickets(id);
    return Response.json({ status: order.status });
  } catch (error) {
    return failure(error);
  }
}
