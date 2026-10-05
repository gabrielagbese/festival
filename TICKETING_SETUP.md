# Cavic ticketing setup

The festival's `/2026#tickets` section now uses the site's own checkout. `/dashboard` manages events, ticket types, registration forms, orders, CSV exports, email retries and online QR check-in. `/login` is the organiser sign-in page. The Tix Africa script and iframe have been removed.

## Production status — 5 October 2026

The portal is deployed on **https://www.cavicfestival.africa**, in Vercel project `festival-xxpi`. The production Turso database is connected in `iad1` on the free Starter plan. Cavic 2026 is published with the confirmed details below, Regular admission at ₦5,000 and total capacity 200. Production has no seeded purchases or tickets.

The Live Paystack secret is stored as a sensitive server environment variable. Production smoke checks passed for the checkout, published event, hosted database, organiser login, secure cookie, dashboard access control and unsigned webhook rejection. The private organiser credentials are saved in the ignored local file `data/organiser-access.txt`; keep it private.

The Live webhook URL **https://www.cavicfestival.africa/api/paystack/webhook** is saved in Paystack's Live API configuration. The account shows `Pre-Approved` and also a separate “Payments are currently disabled for this business” warning. Paystack's current [activation-status documentation](https://support.paystack.com/en/articles/6543554) says Pre-approved businesses normally can accept real payments; that status alone is not a blocker. The separate disabled warning remains unresolved, and an actual charge has not been verified. A controlled real purchase is needed to establish end-to-end payment readiness.

The free Resend service `cavic-ticket-delivery` is installed and connected to Production. Its API key is privately installed in Vercel, and the sender domain `mail.cavicfestival.africa` is created in `eu-west-1`. Remaining email setup: add the three records in [RESEND_DNS.md](RESEND_DNS.md) at Netim, verify the domain in Resend, then set `EMAIL_FROM` and redeploy. Resend delivery is not yet configured. A first purchase can access and print its QR tickets through the private on-screen confirmation link while email is unavailable; retain that link. Resolve the disabled warning and verify a real successful purchase and ticket before opening general sales.

## Event details

The seed uses the site's Cavic name, Abuja location, “Infinite Realms: Beyond Imagination” theme, and November 2026 programme. Total event capacity is **200**, shared across all ticket types. The existing public ticket listing confirms **5–7 November 2026**, **No. 30 Agadez Crescent, Wuse 2, Abuja**, and **Regular admission at ₦5,000**. Its 09:00–18:30 UTC schedule is stored with explicit UTC timestamps and displayed as 10:00–19:30 WAT. New databases seed these confirmed details as a draft; publish from the dashboard when the production connection is ready. The dashboard accepts incomplete drafts but blocks publishing without an exact date, venue and a priced active ticket type, or after the event has ended. An optional end date keeps ticket sales open throughout a multi-day event; without it, sales close at the start. Prices are entered in naira and stored as kobo.

## Local development

Use Node 22 or newer, run `npm ci`, then `npm run setup:ticketing` and `npm run dev`. The setup command adds missing variables to `.env.local`, generates private credentials and preserves existing values. Read `ADMIN_EMAIL` and `ADMIN_PASSWORD` in that file to sign in; never commit this file. Local development uses `data/cavic.sqlite`. No demo purchases are seeded and no Paystack test-mode key is accepted.

This Mac's original `node_modules` directory is owned by root, and macOS rejects both updates and moving it. Production installation and deployment succeed independently. To restore normal local installation, run `sudo chown -R "$(id -un)":staff node_modules` from this project in your terminal, then `npm ci`. Enter your Mac password yourself if requested. Until that repair, the localhost:3001 preview runs from an isolated dependency installation with the same local database.

## Vercel and persistent storage

Create a hosted Turso/libSQL database and obtain its connection URL and authentication token. Add these server environment variables in **Vercel → project → Settings → Environment Variables**, choosing Production and the appropriate Preview configuration:

| Variable              | Value                                                        |
| --------------------- | ------------------------------------------------------------ |
| `APP_URL`             | Your canonical HTTPS website origin, without a trailing path |
| `TURSO_DATABASE_URL`  | Hosted database URL, for example `libsql://…turso.io`        |
| `TURSO_AUTH_TOKEN`    | Database token                                               |
| `ADMIN_EMAIL`         | Organiser sign-in email                                      |
| `ADMIN_PASSWORD`      | A strong password of at least 12 characters                  |
| `AUTH_SECRET`         | Random secret of at least 32 characters                      |
| `TICKET_SECRET`       | A separate random secret of at least 32 characters           |
| `CRON_SECRET`         | Random secret for the scheduled reconciliation endpoint      |
| `PAYSTACK_SECRET_KEY` | Live secret key, beginning `sk_live_`                        |
| `RESEND_API_KEY`      | Resend key for delivery                                      |
| `EMAIL_FROM`          | Cavic sender on a domain verified in Resend                  |

Generate secrets locally with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` and keep each generated value private. Keep `TICKET_SECRET` stable: changing it invalidates existing ticket QR codes and private order links. Production refuses local-file storage so a Vercel deployment cannot accidentally accept money into an ephemeral database. Schema creation and the Cavic draft seed are idempotent. Production and Preview should use separate databases and credentials; configure `APP_URL` for the domain used to access each environment. Redeploy after adding environment variables.

This app uses a single organiser account. The session cookie is HttpOnly, lasts 12 hours, and uses HTTPS in production. Registration forms collect one response per order; name and email are always required. Purchased ticket details are preserved in the order even if an event is later edited.

## Paystack dashboard

1. Sign in to https://dashboard.paystack.com/ and activate your business if Live Mode is unavailable.
2. Open **Settings → API Keys & Webhooks → API Configuration – Live Mode**.
3. Reveal and copy the **Live Secret Key** into Vercel's `PAYSTACK_SECRET_KEY`. Do not paste it into chat or use a `NEXT_PUBLIC_` environment variable. This integration initializes transactions on the server, so the public key is not needed.
4. In the same Live configuration, set **Webhook URL** to `https://YOUR-DOMAIN/api/paystack/webhook` and save it. Use your actual deployed domain and a publicly reachable endpoint.
5. The application supplies a private per-order callback URL when it initializes a transaction. You do not need to set a global callback; `/2026` can be a general fallback.
6. Redeploy, sign in to `/dashboard`, check Setup, enter the confirmed event details and prices, and publish Cavic 2026.

Payment opens in the Paystack modal over the festival page. Some payment methods or bank authentication may require an external banking page. Tickets are issued only after server verification of the live transaction, reference, amount, currency and buyer email. Amounts always come from the database. Signed webhooks also re-verify with Paystack; browser success messages cannot issue tickets.

Official references: [Paystack keys and webhooks](https://support.paystack.com/en/articles/2123458), [InlineJS](https://paystack.com/docs/developer-tools/inlinejs/), [Turso TypeScript SDK](https://docs.turso.tech/sdk/ts/reference), [Vercel environment variables](https://vercel.com/docs/environment-variables).

## Delivery and reconciliation

Use a verified Resend sending domain for `EMAIL_FROM`; the existing contact form's `RESEND_API_KEY` can also serve ticket delivery. If email is unconfigured, buyers can still view, print and download tickets using their private confirmation link, and the dashboard indicates missing delivery setup. Configure email before opening normal sales.

`vercel.json` schedules `/api/jobs` once daily at 04:00 UTC (05:00 WAT). Vercel sends `CRON_SECRET` as a Bearer token. The endpoint also supports authenticated POST requests for a more frequent external scheduler. It retries recent payment verification and unsent ticket email within a bounded execution window; successful payments normally fulfill immediately through the browser verification endpoint or webhook. More frequent reconciliation is recommended for active sales; choose a Vercel plan or external scheduler that supports the desired frequency. Monitor paid orders with failed or unconfigured email in the dashboard and use Retry email. Delivery is idempotent for normal retries; providers may limit their idempotency retention.

Inventory is held for 30 minutes. Successful late payments that cannot be allocated are marked `review`, with no QR tickets issued; organise a refund or resolution in Paystack and with the buyer. QR codes are signed and tied to one event. Online check-in is atomic and rejects repeated, altered, voided and wrong-event tickets. Full transaction reversals invalidate tickets when verified. Partial refunds, refund initiation, offline multi-device check-in and per-attendee names are outside this MVP.

## Verification

- `npm run test:ticketing`: inventory, concurrency, amount matching, live-only fulfillment, replay protection, registration validation, QR admission, drafts and shared event capacity.
- `npm run typecheck:ticketing`: strict TypeScript checks for the integrated ticketing files and tests.
- `npm run test:ticketing:browser`: isolated local browser/API tests; never calls a live payment gateway or writes production storage.
- `npm run build`: production build. The existing project suppresses global TypeScript build errors; unrelated older pages and the splash cursor currently have existing typing errors. Ticketing has its own strict check instead of expanding this task into a site-wide typing cleanup.

Hosted production database connectivity and organiser authentication have been verified. A real live payment, Paystack webhook delivery and Resend delivery still require the remaining account configuration and an actual purchase. Local automated tests do not substitute for that live validation.
