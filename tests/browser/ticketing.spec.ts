import { test, expect } from "@playwright/test";
async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill("organiser@example.com");
  await page.getByLabel("Password").fill("local-browser-fixture-only");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/dashboard/);
}
test("festival replaces Tix and works on desktop and mobile", async ({
  page,
}) => {
  const vendors: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("tix.africa")) vendors.push(r.url());
  });
  await page.goto("/2026#tickets");
  await expect(
    page.getByRole("heading", { name: "Tickets opening soon." }),
  ).toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(0);
  expect(vendors).toEqual([]);
  await expect(
    page.getByRole("heading", { name: "Get Your Cavic 2026 Tickets" }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/cavic-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => document.documentElement.classList.remove("dark"));
  await page.screenshot({
    path: "test-results/cavic-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test("private APIs reject unauthorised access and unsigned webhooks", async ({
  request,
}) => {
  expect((await request.get("/api/admin")).status()).toBe(401);
  expect((await request.get("/api/admin/export")).status()).toBe(401);
  expect(
    (
      await request.post("/api/paystack/webhook", {
        data: { event: "charge.success" },
      })
    ).status(),
  ).toBe(401);
  expect((await request.get("/api/jobs")).status()).toBe(401);
  expect(
    (
      await request.post("/api/checkout", {
        headers: { Origin: "http://localhost:3047" },
        data: {},
      })
    ).status(),
  ).toBe(503);
});
test("organiser manages the Cavic draft and registration form", async ({
  page,
}) => {
  await signIn(page);
  await expect(
    page.getByRole("heading", { name: "Festival overview." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Registration forms", exact: true })
    .click();
  await page.getByRole("button", { name: "Manage form" }).click();
  await page.getByRole("button", { name: "Add field" }).click();
  await page.getByLabel("Field label").last().fill("Creative discipline");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Your changes are saved",
  );
  await page.reload();
  await page
    .getByRole("button", { name: "Registration forms", exact: true })
    .click();
  await expect(page.getByText("Creative discipline")).toBeVisible();
  const response = await page.request.get("/api/admin");
  const data = await response.json();
  expect(data.events[0].capacity).toBe(200);
  expect(data.events[0].status).toBe("draft");
  expect(data.events[0].tickets[0].price).toBe(500000);
  await page
    .getByRole("button", { name: "Events & tickets", exact: true })
    .click();
  await page.getByRole("button", { name: "Manage", exact: true }).click();
  await page.getByLabel("Venue", { exact: true }).fill("");
  await page.getByLabel("Visibility").selectOption("published");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(
    page.locator(".cavic-ticketing").getByRole("alert"),
  ).toContainText("Set a venue, exact date");
  await page
    .getByLabel("Venue", { exact: true })
    .fill("No. 30 Agadez Crescent, Wuse 2");
  await page.getByLabel("Visibility").selectOption("draft");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Your changes are saved",
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "test-results/cavic-dashboard.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page).toHaveURL(/login/);
});
test("private order links reject missing and forged tokens", async ({
  request,
}) => {
  expect(
    (
      await request.get("/orders/00000000-0000-4000-8000-000000000000")
    ).status(),
  ).toBe(404);
  expect(
    (
      await request.get(
        "/orders/00000000-0000-4000-8000-000000000000?token=forged",
      )
    ).status(),
  ).toBe(404);
});

test("published checkout reflects saved prices, quantity and registration fields", async ({
  page,
}) => {
  await signIn(page);
  const data = await (await page.request.get("/api/admin")).json();
  const event = data.events.find((e: { id: string }) => e.id === "cavic-2026");
  const saved = await page.request.post("/api/admin", {
    headers: { Origin: "http://localhost:3047" },
    data: {
      action: "save_event",
      event: {
        ...event,
        status: "published",
        is_sample: false,
        venue: "Isolated browser fixture venue",
        starts_at: new Date(Date.now() + 86400000).toISOString(),
        tickets: event.tickets.map((t: object) => ({
          ...t,
          active: true,
          price: 50000,
        })),
      },
    },
  });
  expect(saved.ok()).toBe(true);
  await page.goto("/2026#tickets");
  await expect(
    page.getByRole("heading", { name: "Your festival pass." }),
  ).toBeVisible();
  await expect(page.getByLabel("Creative discipline")).toBeVisible();
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await expect(page.getByLabel("Ticket quantity")).toHaveText("2");
  await expect(page.locator(".total-row strong")).toHaveText("₦1,000");
  await expect(
    page.getByRole("button", { name: "Get your tickets", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByText("Payment setup is in progress. Sales will open shortly."),
  ).toBeVisible();
  await page.evaluate(() =>
    window.scrollTo(0, document.getElementById("tickets")!.offsetTop - 100),
  );
  await page.screenshot({
    path: "test-results/cavic-checkout.png",
    animations: "disabled",
  });
});
