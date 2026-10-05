import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  use: { baseURL: "http://localhost:3047", ...devices["Desktop Chrome"] },
  webServer: {
    command: "node scripts/ticketing-e2e-server.mjs",
    url: "http://localhost:3047/2026",
    reuseExistingServer: false,
    timeout: 120000,
  },
});
