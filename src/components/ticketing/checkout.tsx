"use client";
import { useState } from "react";
import { ArrowUpRight, LockKeyhole, Minus, Plus, Ticket } from "lucide-react";
import type { Event } from "@/lib/ticketing/types";
import { bookingOpen, money } from "@/lib/ticketing/types";

export function Checkout({
  event,
  ready,
  deliveryReady,
}: {
  event: Event;
  ready: boolean;
  deliveryReady: boolean;
}) {
  const available = event.tickets.filter((t) => t.active);
  const [ticketId, setTicketId] = useState(available[0]?.id || "");
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pendingUrl, setPendingUrl] = useState("");
  const ticket = available.find((t) => t.id === ticketId);
  const canBuy =
    ready &&
    event.status === "published" &&
    !event.is_sample &&
    bookingOpen(event) &&
    (ticket?.available || 0) >= quantity &&
    (ticket?.price || 0) > 0;
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const Paystack = (await import("@paystack/inline-js")).default;
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          ticketTypeId: ticketId,
          quantity,
          name: form.get("name"),
          email: form.get("email"),
          consent: form.get("consent") === "on",
          answers: Object.fromEntries(
            event.fields.map((field) => [
              field.id,
              field.type === "checkbox"
                ? form.get(field.id) === "on"
                : form.get(field.id) || "",
            ]),
          ),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setPendingUrl(data.orderUrl);
      new Paystack().resumeTransaction(data.accessCode, {
        onSuccess: () => {
          window.location.assign(data.orderUrl);
        },
        onCancel: () => {
          setBusy(false);
          setError(
            "Checkout closed. If you paid, use the order link below to check your payment.",
          );
        },
        onError: () => {
          setBusy(false);
          setError(
            "Checkout could not open. Use your order link to check payment status.",
          );
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to open checkout.");
      setBusy(false);
    }
  }
  if (
    event.status !== "published" ||
    event.is_sample ||
    !event.starts_at ||
    available.every((t) => t.price <= 0)
  )
    return (
      <section
        className="booking-card tickets-soon"
        aria-label="Cavic ticket checkout"
      >
        <div className="booking-heading">
          <span className="eyebrow">YOUR FESTIVAL PASS</span>
          <Ticket size={24} />
        </div>
        <h2>
          Tickets
          <br />
          opening soon.
        </h2>
        <p className="muted">
          Be part of Cavic 2026. Ticket prices and the final schedule will be
          announced here.
        </p>
        <div className="soon-ticket">
          <span>
            {available[0]?.name || "Festival admission"}
            <small>Creativity. Technology. Culture.</small>
          </span>
          <span className="status pending">Coming soon</span>
        </div>
        <a
          className="button wide"
          href="mailto:submissions@cavicfestival.africa"
        >
          Contact the festival <ArrowUpRight size={18} />
        </a>
        <div className="payment-note">
          <LockKeyhole size={13} />
          Secure checkout with Paystack when sales open
        </div>
      </section>
    );
  return (
    <section className="booking-card" aria-label="Cavic ticket checkout">
      <div className="booking-heading">
        <span className="eyebrow">CAVIC FESTIVAL 2026</span>
        <Ticket size={22} />
      </div>
      <h2>Your festival pass.</h2>
      <p className="muted">Creativity, technology, culture. Be part of it.</p>
      <form onSubmit={submit}>
        <fieldset className="ticket-options">
          <legend className="sr-only">Choose a ticket</legend>
          {available.map((type) => (
            <label
              key={type.id}
              className={`ticket-option ${ticketId === type.id ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="ticket"
                value={type.id}
                checked={ticketId === type.id}
                onChange={() => {
                  setTicketId(type.id);
                  setQuantity(1);
                }}
                disabled={!type.available}
              />
              <span>
                <strong>{type.name}</strong>
                <small>{type.description}</small>
                <small>
                  {type.available ? `${type.available} available` : "Sold out"}
                </small>
              </span>
              <b>
                {type.price > 0 ? money(type.price) : "Price to be announced"}
              </b>
            </label>
          ))}
        </fieldset>
        {!ticket && (
          <p className="notice">Tickets are currently unavailable.</p>
        )}
        <div className="quantity-row">
          <span>Number of tickets</span>
          <div className="stepper">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => q - 1)}
            >
              <Minus size={15} />
            </button>
            <output aria-label="Ticket quantity">{quantity}</output>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity >= Math.min(10, ticket?.available || 0)}
              onClick={() => setQuantity((q) => q + 1)}
            >
              <Plus size={15} />
            </button>
          </div>
        </div>
        <div className="form-divider">BUYER DETAILS</div>
        <label className="field">
          Full name
          <input
            name="name"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            placeholder="Your name"
          />
        </label>
        <label className="field">
          Email address
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            placeholder="you@example.com"
          />
          <small>
            {deliveryReady
              ? "Your tickets will be sent here."
              : "Keep your confirmation link to access your tickets."}
          </small>
        </label>
        {event.fields.map((field) =>
          field.type === "checkbox" ? (
            <label className="check-field" key={field.id}>
              <input
                name={field.id}
                type="checkbox"
                required={field.required}
              />
              {field.label}
              {field.required ? " *" : ""}
            </label>
          ) : (
            <label className="field" key={field.id}>
              {field.label}
              {field.required ? " *" : ""}
              {field.type === "select" ? (
                <select name={field.id} required={field.required}>
                  <option value="">Choose an option</option>
                  {field.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  name={field.id}
                  required={field.required}
                  maxLength={1000}
                />
              )}
            </label>
          ),
        )}
        <label className="check-field">
          <input type="checkbox" name="consent" required />I agree to share
          these details with the organiser for ticket delivery and event entry.
        </label>
        <div className="total-row">
          <span>
            Total{" "}
            <small>
              {quantity} ticket{quantity !== 1 ? "s" : ""}
            </small>
          </span>
          <strong>{money((ticket?.price || 0) * quantity)}</strong>
        </div>
        {error && (
          <p role="alert" className="notice error">
            {error}
          </p>
        )}
        {pendingUrl && (
          <a className="text-link" href={pendingUrl}>
            Check your order status →
          </a>
        )}
        <button className="button wide" disabled={busy || !canBuy}>
          {busy ? "Opening checkout…" : "Get your tickets"}
          <ArrowUpRight size={18} />
        </button>
        {!canBuy && (
          <p className="setup-note">
            {event.status !== "published" || event.is_sample
              ? "Ticket sales will open once the date and prices are confirmed."
              : !ready
                ? "Payment setup is in progress. Sales will open shortly."
                : "Tickets are unavailable for this selection."}
          </p>
        )}
        <div className="payment-note">
          <LockKeyhole size={13} />
          Secure payment with Paystack
        </div>
      </form>
    </section>
  );
}
