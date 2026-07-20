"use client";

import { useEffect, useState } from "react";

export function PlanCheckoutRedirect({
  plan,
  interval,
}: {
  plan: "pro" | "business";
  interval: "monthly" | "yearly";
}) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval }),
      });
      const data = await res.json().catch(() => ({}));
      if (cancelled) return;
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError((data.error ?? "Could not start checkout.") + " You can upgrade from Settings instead.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [plan, interval]);

  if (!error) return null;
  return (
    <div className="mt-5 rounded-2xl border border-risk-high/25 bg-risk-high/10 p-4 text-sm text-risk-high">
      {error}
    </div>
  );
}
