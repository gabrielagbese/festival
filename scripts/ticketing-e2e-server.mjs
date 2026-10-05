import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
const directory = mkdtempSync(join(tmpdir(), "cavic-browser-"));
const child = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "dev", "--port", "3047"],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "development",
      APP_URL: "http://localhost:3047",
      DATABASE_PATH: join(directory, "tickets.sqlite"),
      TURSO_DATABASE_URL: "",
      TURSO_AUTH_TOKEN: "",
      DATABASE_URL: "",
      DATABASE_AUTH_TOKEN: "",
      ADMIN_EMAIL: "organiser@example.com",
      ADMIN_PASSWORD: "local-browser-fixture-only",
      AUTH_SECRET: "browser-session-fixture-secret-at-least-32-chars",
      TICKET_SECRET: "browser-ticket-fixture-secret-at-least-32-chars",
      CRON_SECRET: "browser-scheduler-fixture-only",
      PAYSTACK_SECRET_KEY: "",
      RESEND_API_KEY: "",
      EMAIL_FROM: "",
    },
  },
);
function stop() {
  child.kill("SIGTERM");
}
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
child.on("exit", (code) => {
  rmSync(directory, { recursive: true, force: true });
  process.exit(code || 0);
});
