import { AlertTriangle, CheckCircle2, OctagonAlert } from "lucide-react";
import type { RiskLevel } from "@prisma/client";

const SEGMENTS = [
  { level: "LOW" as RiskLevel, color: "var(--color-risk-low)", icon: CheckCircle2, label: "Low" },
  { level: "MEDIUM" as RiskLevel, color: "var(--color-risk-medium)", icon: AlertTriangle, label: "Medium" },
  { level: "HIGH" as RiskLevel, color: "var(--color-risk-high)", icon: OctagonAlert, label: "High" },
];

// Part-to-whole across a fixed, ordered status scale: segments always wear
// the app's reserved risk colors (never generic categorical hues) and are
// always paired with an icon + label, never color alone.
export function RiskDistribution({ counts }: { counts: Record<RiskLevel, number> }) {
  const total = counts.LOW + counts.MEDIUM + counts.HIGH;

  return (
    <div>
      <div className="flex h-2 gap-[2px] overflow-hidden rounded-full bg-ink/8">
        {total === 0
          ? null
          : SEGMENTS.filter((s) => counts[s.level] > 0).map((s) => (
              <div
                key={s.level}
                className="meter-fill-w"
                style={{ width: `${(counts[s.level] / total) * 100}%`, background: s.color }}
              />
            ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {SEGMENTS.map((s, i) => (
          <span
            key={s.level}
            className="chip-in inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft"
            style={{ animationDelay: `${0.5 + i * 0.08}s` }}
          >
            <s.icon size={13} style={{ color: s.color }} aria-hidden />
            {s.label} <span className="font-semibold text-ink">{counts[s.level]}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
