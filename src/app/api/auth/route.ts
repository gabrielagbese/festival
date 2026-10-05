import { cookies } from "next/headers";
import { z } from "zod";
import { failure, readJson, sameOrigin, HttpError } from "@/lib/ticketing/http";
import { makeSession, passwordMatches } from "@/lib/ticketing/security";
import { rateLimit } from "@/lib/ticketing/db";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    await rateLimit("admin-login", 10, 15 * 60000);
    const data = z
      .object({
        email: z.string().email().max(200),
        password: z.string().max(256),
      })
      .parse(await readJson(request));
    if (
      data.email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase() ||
      !passwordMatches(data.password)
    )
      throw new HttpError("Email or password is incorrect.", 401);
    (await cookies()).set("cavic_session", makeSession(), {
      httpOnly: true,
      secure: new URL(process.env.APP_URL!).protocol === "https:",
      sameSite: "lax",
      path: "/",
      maxAge: 12 * 3600,
    });
    return Response.json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
export async function DELETE(request: Request) {
  try {
    sameOrigin(request);
    (await cookies()).delete("cavic_session");
    return Response.json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
