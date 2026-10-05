# Resend DNS setup for Cavic Festival

The free Resend service is connected to Vercel project `festival-xxpi`. Its sending domain is `mail.cavicfestival.africa` in `eu-west-1`. Domain verification is pending.

Add these records in Netim’s DNS zone for `cavicfestival.africa`. Hostnames below are relative to that zone; a DNS provider that asks for a full hostname needs the `.cavicfestival.africa` suffix. Use the default TTL (or 3600 seconds).

| Type | Host | Value | Priority |
| --- | --- | --- | --- |
| TXT | `resend._domainkey.mail` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDWi/Sy2ed4l9cIt8USwcBfHrU4HOr3r8MT8j2a9cliN19F4rGHSkbZ1kpJWDv0R11sfWfWlnRbXk6ewPogdFCd53tgmNt9S7IdtxOd0+9hK8fNPdUMj6LzALIYQRWb/TmWAXWwjx77x2R1eRVVJrXzA39YGIX/8ZtMoy2YF1KASQIDAQAB` | — |
| MX | `send.mail` | `feedback-smtp.eu-west-1.amazonses.com` | 10 |
| TXT | `send.mail` | `v=spf1 include:amazonses.com ~all` | — |

The MX record is for `send.mail.cavicfestival.africa`, the delivery feedback subdomain. Receiving mail through Resend is disabled.

After saving DNS, trigger verification for `mail.cavicfestival.africa` in Resend and confirm the domain status is `verified`. Then set Vercel’s server environment variable `EMAIL_FROM` to `Cavic Festival <tickets@mail.cavicfestival.africa>` and redeploy. The Resend API key is already privately installed in Production.

Successful paid tickets can then be retried from the organiser dashboard’s Orders section. The private confirmation page remains available while email is not configured.
