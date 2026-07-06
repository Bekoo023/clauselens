"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { CONTRACT_TYPES } from "@/lib/contract-types";

type Filters = { q: string; risk: string; type: string; sort: string };

/** Search + risk/type filters + sort, synced to URL query params (server component re-fetches). */
export function ContractSearch({
  initialQuery,
  initialRisk,
  initialType,
  initialSort,
}: {
  initialQuery: string;
  initialRisk: string;
  initialType: string;
  initialSort: string;
}) {
  const router = useRouter();

  function apply(next: Partial<Filters>) {
    const merged: Filters = { q: initialQuery, risk: initialRisk, type: initialType, sort: initialSort, ...next };
    const params = new URLSearchParams();
    if (merged.q) params.set("q", merged.q);
    if (merged.risk) params.set("risk", merged.risk);
    if (merged.type) params.set("type", merged.type);
    if (merged.sort && merged.sort !== "newest") params.set("sort", merged.sort);
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
          onChange={(e) => apply({ q: e.target.value })}
          className="input pl-10"
        />
      </div>
      <select
        aria-label="Filter by risk"
        defaultValue={initialRisk}
        onChange={(e) => apply({ risk: e.target.value })}
        className="input w-auto"
      >
        <option value="">All risk levels</option>
        <option value="LOW">Low risk</option>
        <option value="MEDIUM">Medium risk</option>
        <option value="HIGH">High risk</option>
      </select>
      <select
        aria-label="Filter by contract type"
        defaultValue={initialType}
        onChange={(e) => apply({ type: e.target.value })}
        className="input w-auto"
      >
        <option value="">All types</option>
        {CONTRACT_TYPES.map((t) => (
          <option key={t.slug} value={t.slug}>{t.name}</option>
        ))}
      </select>
      <select
        aria-label="Sort by"
        defaultValue={initialSort}
        onChange={(e) => apply({ sort: e.target.value })}
        className="input w-auto"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="risk-desc">Highest risk first</option>
        <option value="risk-asc">Lowest risk first</option>
      </select>
    </div>
  );
}
