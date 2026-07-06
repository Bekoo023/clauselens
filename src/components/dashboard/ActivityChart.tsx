"use client";

import { useState } from "react";

export type DayCount = { date: string; label: string; count: number };

// Single-series bar chart (count per day) — one hue for magnitude, no legend
// needed since the card title above already names the series.
export function ActivityChart({ data }: { data: DayCount[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div>
      <div className="flex h-24 items-stretch gap-1">
        {data.map((d, i) => (
          <div key={d.date} className="relative flex flex-1 flex-col justify-end">
            {hover === i && (
              <div className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink-fixed px-2 py-1 text-[11px] font-medium text-white shadow-card">
                {d.count} · {d.label}
              </div>
            )}
            <div
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className={`w-full rounded-t-[3px] transition-colors ${d.count > 0 ? "bg-brand/60 hover:bg-brand" : "bg-ink/8"}`}
              style={{ height: `${d.count > 0 ? Math.max(8, (d.count / max) * 100) : 3}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-medium text-ink-soft">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}
