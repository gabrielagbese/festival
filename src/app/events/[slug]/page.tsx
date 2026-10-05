import { notFound, redirect } from "next/navigation";
import { events } from "@/lib/ticketing/db";
import { paymentsReady } from "@/lib/ticketing/paystack";
import { emailReady } from "@/lib/ticketing/email";
import { eventDate } from "@/lib/ticketing/types";
import { Checkout } from "@/components/ticketing/checkout";
import { cookies } from "next/headers";
import { validSession } from "@/lib/ticketing/security";
export const dynamic = "force-dynamic";
export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = (await events()).find((e) => e.slug === slug);
  if (!event) notFound();
  if (event.id === "cavic-2026") redirect("/2026#tickets");
  if (
    event.status !== "published" &&
    !validSession((await cookies()).get("cavic_session")?.value)
  )
    notFound();
  return (
    <div className="cavic-ticketing extra-event">
      <section>
        <span className="eyebrow">CAVIC / {event.category}</span>
        <h1>{event.name}</h1>
        <p>{event.description}</p>
        <p>
          {eventDate(event.starts_at, event.ends_at)} · {event.venue} ·{" "}
          {event.city}
        </p>
        {event.status !== "published" && (
          <p className="notice">Organiser preview · ticket sales are closed.</p>
        )}
      </section>
      <Checkout
        event={event}
        ready={paymentsReady()}
        deliveryReady={emailReady()}
      />
    </div>
  );
}
