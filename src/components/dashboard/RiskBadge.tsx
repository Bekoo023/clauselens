const styles = {
  LOW: "bg-risk-low/10 text-risk-low",
  MEDIUM: "bg-risk-medium/10 text-risk-medium",
  HIGH: "bg-risk-high/10 text-risk-high",
} as const;

const labels = { LOW: "Low risk", MEDIUM: "Medium risk", HIGH: "High risk" } as const;

export function RiskBadge({ level, score }: { level: keyof typeof styles; score?: number | null }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[level]}`}>
      {typeof score === "number" && <span className="font-mono">{score}</span>}
      {labels[level]}
    </span>
  );
}
