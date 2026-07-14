"use client";

import { useState } from "react";
import { PRICING } from "@/lib/plans";

export function UpgradeButtons() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [yearly, setYearly] = useState(true);

  async function upgrade(plan: "pro" | "business") {
    setLoading(plan);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval: yearly ? "yearly" : "monthly" }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Could not start checkout. Please try again.");
      setLoading(null);
    }
  }

  return (
    <div className="mt-4">
      <div className="inline-flex rounded-full border border-ink/15 p-1 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setYearly(false)}
          aria-pressed={!yearly}
          className={`rounded-full px-3 py-1 transition-colors ${!yearly ? "bg-ink-fixed text-white" : "text-ink-soft"}`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setYearly(true)}
          aria-pressed={yearly}
          className={`rounded-full px-3 py-1 transition-colors ${yearly ? "bg-ink-fixed text-white" : "text-ink-soft"}`}
        >
          Yearly <span className="text-risk-low">−17%</span>
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        <button onClick={() => upgrade("pro")} disabled={!!loading} className="btn btn-primary disabled:opacity-60">
          {loading === "pro" ? "Redirecting…" : `Upgrade to Pro €${yearly ? PRICING.pro.yearly : PRICING.pro.monthly}/mo`}
        </button>
        <button onClick={() => upgrade("business")} disabled={!!loading} className="btn border border-ink/15 hover:bg-ink/5 disabled:opacity-60">
          {loading === "business" ? "Redirecting…" : `Upgrade to Business €${yearly ? PRICING.business.yearly : PRICING.business.monthly}/mo`}
        </button>
      </div>
      {error && <p role="alert" className="mt-2 text-sm text-risk-high">{error}</p>}
    </div>
  );
}
