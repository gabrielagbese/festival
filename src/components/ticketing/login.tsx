"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
export function Login({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="login-form">
      <span className="eyebrow">ORGANISER ACCESS</span>
      <h1>
        Your events.
        <br />
        All in one place.
      </h1>
      <p className="muted">
        Manage Cavic events, tickets, registration forms and entry.
      </p>
      <label className="field">
        Email address
        <input name="email" type="email" autoComplete="username" required />
      </label>
      <label className="field">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      {error && (
        <p role="alert" className="notice error">
          {error}
        </p>
      )}
      <button className="button wide" disabled={busy || !configured}>
        {busy ? "Signing in…" : "Sign in"}
        <ArrowRight size={18} />
      </button>
      {!configured && (
        <p className="notice">
          Admin access has not been configured. The site owner needs to complete
          setup.
        </p>
      )}
      <small className="muted">
        Access is restricted to the event organiser.
      </small>
    </form>
  );
}
