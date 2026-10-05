import { createHmac, timingSafeEqual, scryptSync } from "node:crypto";

function secret(name: string) {
  const value = process.env[name];
  if (!value || value.length < 32)
    throw new Error(`${name} must contain at least 32 characters.`);
  return value;
}
export function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
export function signature(value: string, key = "TICKET_SECRET") {
  return createHmac("sha256", secret(key)).update(value).digest("base64url");
}
export function orderToken(id: string) {
  return signature(`order:${id}`);
}
export function validOrderToken(id: string, token: string) {
  return safeEqual(orderToken(id), token);
}
export function qrToken(id: string, eventId: string) {
  const value = `${id}.${eventId}`;
  return `${value}.${signature(`ticket:${value}`)}`;
}
export function parseQrToken(value: string) {
  const [id, eventId, mac, extra] = value.split(".");
  if (
    !id ||
    !eventId ||
    !mac ||
    extra ||
    !safeEqual(signature(`ticket:${id}.${eventId}`), mac)
  )
    throw new Error("This ticket is invalid or has been altered.");
  return { id, eventId };
}
export function validWebhook(body: string, header: string | null) {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key?.startsWith("sk_live_") || !header) return false;
  return safeEqual(
    createHmac("sha512", key).update(body).digest("hex"),
    header,
  );
}
export function passwordMatches(input: string) {
  const stored = process.env.ADMIN_PASSWORD;
  if (!stored || stored.length < 12 || input.length > 256) return false;
  return timingSafeEqual(
    scryptSync(input, "cavic-admin-v1", 64),
    scryptSync(stored, "cavic-admin-v1", 64),
  );
}
export function makeSession() {
  const payload = Buffer.from(
    JSON.stringify({
      email: process.env.ADMIN_EMAIL,
      expires: Date.now() + 12 * 3600000,
    }),
  ).toString("base64url");
  return `${payload}.${signature(`session:${payload}`, "AUTH_SECRET")}`;
}
export function validSession(value?: string) {
  if (!value) return false;
  try {
    const [payload, mac, extra] = value.split(".");
    if (
      extra ||
      !payload ||
      !mac ||
      !safeEqual(signature(`session:${payload}`, "AUTH_SECRET"), mac)
    )
      return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.email === process.env.ADMIN_EMAIL && data.expires > Date.now();
  } catch {
    return false;
  }
}
export function appUrl() {
  const value = process.env.APP_URL;
  if (!value) throw new Error("APP_URL is not configured.");
  const url = new URL(value);
  if (
    process.env.NODE_ENV === "production" &&
    url.protocol !== "https:" &&
    !["localhost", "127.0.0.1"].includes(url.hostname)
  )
    throw new Error("APP_URL must use HTTPS.");
  return url.origin;
}
export function orderUrl(id: string) {
  return `${appUrl()}/orders/${id}?token=${orderToken(id)}`;
}
