import { cookies } from "next/headers";
import { ZodError } from "zod";
import { appUrl, validSession } from "./security";

export class HttpError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export async function requireAdmin() {
  if (!validSession((await cookies()).get("cavic_session")?.value))
    throw new HttpError("Please sign in.", 401);
}
export function sameOrigin(request: Request) {
  if (request.headers.get("origin") !== appUrl())
    throw new HttpError("Request origin not allowed.", 403);
}
export async function readJson(request: Request) {
  const text = await request.text();
  if (text.length > 50000) throw new HttpError("Request is too large.", 413);
  try {
    return JSON.parse(text);
  } catch {
    throw new HttpError("Invalid request body.");
  }
}
export function failure(error: unknown) {
  if (error instanceof ZodError)
    return Response.json(
      { error: error.issues[0]?.message || "Check the form fields." },
      { status: 400 },
    );
  if (error instanceof HttpError)
    return Response.json({ error: error.message }, { status: error.status });
  if (
    error instanceof Error &&
    !/SQLITE|LIBSQL|TURSO|DATABASE|constraint|AUTH_SECRET|TICKET_SECRET|APP_URL/i.test(
      error.message,
    )
  )
    return Response.json({ error: error.message }, { status: 400 });
  return Response.json(
    {
      error:
        "Something went wrong. Please check your configuration and try again.",
    },
    { status: 500 },
  );
}
