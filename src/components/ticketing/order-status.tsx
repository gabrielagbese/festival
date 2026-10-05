"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export function OrderStatus({ id, token }: { id: string; token: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function check() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/orders/${id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (["paid", "review", "reversed"].includes(data.status))
        router.refresh();
      else
        setError(
          "Payment has not been confirmed yet. Please wait a moment and check again.",
        );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not check payment.",
      );
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    void check();
  }, []); // Check independently of the browser's payment callback.
  return (
    <div>
      <button className="button" disabled={busy} onClick={check}>
        {busy ? "Checking payment…" : "Check payment status"}
      </button>
      {error && (
        <p role="status" className="notice">
          {error}
        </p>
      )}
    </div>
  );
}
export function PrintButton() {
  return (
    <button className="button secondary" onClick={() => window.print()}>
      Print / save as PDF
    </button>
  );
}
