"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, OctagonAlert } from "lucide-react";
import { riskLevelFromScore } from "@/lib/analyze";

const STATUS = {
  LOW: { color: "var(--color-risk-low)", icon: CheckCircle2, label: "Low risk" },
  MEDIUM: { color: "var(--color-risk-medium)", icon: AlertTriangle, label: "Medium risk" },
  HIGH: { color: "var(--color-risk-high)", icon: OctagonAlert, label: "High risk" },
} as const;

// Semicircular meter: a single ratio (0-100) against the fixed 100 limit.
// Fill carries severity via the app's reserved risk-status colors; the
// track is a flat neutral so state reads from the fill alone. Status color
// is never shown without the paired icon + label (see STATUS above).
export function RiskGauge({ score, size = 176 }: { score: number; size?: number }) {
  const level = riskLevelFromScore(score);
  const { color, icon: Icon, label } = STATUS[level];
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const stroke = Math.round(size * 0.08);
  const radius = size / 2 - stroke;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const dash = (clamped / 100) * circumference;
  const arc = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;

  return (
    <div className="inline-flex flex-col items-center" role="img" aria-label={`Risk score ${score} out of 100, ${label.toLowerCase()}`}>
      <svg width={size} height={size / 2 + stroke} viewBox={`0 0 ${size} ${size / 2 + stroke}`} aria-hidden>
        <path d={arc} fill="none" stroke="var(--color-ink)" strokeOpacity={0.08} strokeWidth={stroke} strokeLinecap="round" />
        <path
          d={arc}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={drawn ? circumference - dash : circumference}
          className="risk-gauge-arc"
        />
      </svg>
      <div className="-mt-9 flex flex-col items-center">
        <p className="h-display text-4xl" style={{ color }}>{Math.round(clamped)}</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold" style={{ color }}>
          <Icon size={14} aria-hidden /> {label}
        </p>
      </div>
    </div>
  );
}
