"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function open() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch {
      setError("Could not open the billing portal. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={open} disabled={loading} className="btn mt-4 border border-ink/15 hover:bg-ink/5 disabled:opacity-60">
        {loading ? (
          <><Loader2 size={16} className="animate-spin" aria-hidden /> Opening…</>
        ) : (
          "Manage or cancel subscription"
        )}
      </button>
      {error && <p role="alert" className="mt-2 text-sm text-risk-high">{error}</p>}
    </div>
  );
}
