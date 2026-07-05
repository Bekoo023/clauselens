"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

/** Search + risk filter, synced to URL query params (server component re-fetches). */
export function ContractSearch({ initialQuery, initialRisk }: { initialQuery: string; initialRisk: string }) {
  const router = useRouter();

  function apply(q: string, risk: string) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (risk) params.set("risk", risk);
    router.replace(`/dashboard${params.size ? `?${params}` : ""}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 basis-56">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
        <input
          type="search"
          aria-label="Search contracts"
          placeholder="Search contracts…"
          defaultValue={initialQuery}
          onChange={(e) => apply(e.target.value, initialRisk)}
          className="input pl-10"
        />
      </div>
      <select
        aria-label="Filter by risk"
        defaultValue={initialRisk}
        onChange={(e) => apply(initialQuery, e.target.value)}
        className="input w-auto"
      >
        <option value="">All risk levels</option>
        <option value="LOW">Low risk</option>
        <option value="MEDIUM">Medium risk</option>
        <option value="HIGH">High risk</option>
      </select>
    </div>
  );
}
