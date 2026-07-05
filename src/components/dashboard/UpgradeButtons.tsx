"use client";

import { useState } from "react";

export function UpgradeButtons() {
  const [loading, setLoading] = useState<string | null>(null);

  async function upgrade(plan: "pro" | "business") {
    setLoading(plan);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, interval: "monthly" }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(null);
  }

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <button onClick={() => upgrade("pro")} disabled={!!loading} className="btn btn-primary disabled:opacity-60">
        {loading === "pro" ? "Redirecting…" : "Upgrade to Pro — €29/mo"}
      </button>
      <button onClick={() => upgrade("business")} disabled={!!loading} className="btn border border-ink/15 hover:bg-ink/5 disabled:opacity-60">
        {loading === "business" ? "Redirecting…" : "Upgrade to Business — €79/mo"}
      </button>
    </div>
  );
}
