import { dashboardData, saveEvent } from "@/lib/ticketing/admin";
import { checkIn } from "@/lib/ticketing/orders";
import { deliverTickets } from "@/lib/ticketing/email";
import { verifyPayment } from "@/lib/ticketing/paystack";
import {
  failure,
  readJson,
  requireAdmin,
  sameOrigin,
  HttpError,
} from "@/lib/ticketing/http";
import { z } from "zod";
export const runtime = "nodejs";
export async function GET() {
  try {
    await requireAdmin();
    return Response.json(await dashboardData(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    await requireAdmin();
    const data = await readJson(request);
    if (data.action === "save_event")
      return Response.json({ id: await saveEvent(data.event) });
    if (data.action === "checkin") {
      const input = z
        .object({
          token: z.string().min(1).max(500),
          eventId: z.string().max(100),
        })
        .parse(data);
      return Response.json(await checkIn(input.token, input.eventId));
    }
    if (data.action === "verify_order" || data.action === "resend_email") {
      const id = z.string().uuid().parse(data.id);
      if (data.action === "verify_order") await verifyPayment(id);
      await deliverTickets(id);
      return Response.json({ ok: true });
    }
    throw new HttpError("Unknown action.");
  } catch (error) {
    return failure(error);
  }
}
