import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
const filename = ".env.local";
let text = existsSync(filename) ? readFileSync(filename, "utf8") : "";
const values = {
  APP_URL: "http://localhost:3000",
  DATABASE_PATH: "./data/cavic.sqlite",
  TURSO_DATABASE_URL: "",
  TURSO_AUTH_TOKEN: "",
  ADMIN_EMAIL: "submissions@cavicfestival.africa",
  ADMIN_PASSWORD: randomBytes(18).toString("base64url"),
  AUTH_SECRET: randomBytes(32).toString("hex"),
  TICKET_SECRET: randomBytes(32).toString("hex"),
  CRON_SECRET: randomBytes(32).toString("hex"),
  PAYSTACK_SECRET_KEY: "",
  RESEND_API_KEY: "",
  EMAIL_FROM: "",
};
for (const [key, value] of Object.entries(values))
  if (!new RegExp(`^${key}=`, "m").test(text)) text += `\n${key}=${value}`;
writeFileSync(filename, text + "\n", { mode: 0o600 });
console.log(
  "Local configuration is ready. Admin credentials are in .env.local; payments stay closed until a live Paystack key is configured.",
);
