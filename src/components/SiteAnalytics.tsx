"use client";
import { Analytics } from "@vercel/analytics/react";
export function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) =>
        /^\/(orders|dashboard|login)(\/|$)/.test(new URL(event.url).pathname)
          ? null
          : event
      }
    />
  );
}
