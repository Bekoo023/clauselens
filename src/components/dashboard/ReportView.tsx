import { AlertTriangle, CheckCircle2, OctagonAlert, ShieldCheck } from "lucide-react";
import type { ContractAnalysis } from "@/lib/analyze";
import { RiskGauge } from "@/components/dashboard/RiskGauge";

const riskStyles = {
  low: { icon: CheckCircle2, border: "border-risk-low/30", text: "text-risk-low", chip: "bg-risk-low/10 text-risk-low" },
  medium: { icon: AlertTriangle, border: "border-risk-medium/30", text: "text-risk-medium", chip: "bg-risk-medium/10 text-risk-medium" },
  high: { icon: OctagonAlert, border: "border-risk-high/30", text: "text-risk-high", chip: "bg-risk-high/10 text-risk-high" },
} as const;

// Pure presentation of a contract analysis. Server-renderable, print-friendly.
export function ReportView({ analysis }: { analysis: ContractAnalysis }) {
  return (
    <div className="report-view">
      {/* Score header */}
      <div className="card chip-in mt-6 flex flex-wrap items-center gap-6 p-7">
        <RiskGauge score={analysis.riskScore} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Summary</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{analysis.summary}</p>
        </div>
      </div>

      {/* Flagged clauses */}
      <h2 className="mt-10 text-lg font-semibold">Flagged clauses ({analysis.clauses.length})</h2>
      <div className="mt-4 space-y-4">
        {analysis.clauses.map((c, i) => {
          const style = riskStyles[c.risk];
          return (
            <div
              key={c.title}
              className={`card chip-in border p-6 ${style.border}`}
              style={{ animationDelay: `${0.1 + Math.min(i, 5) * 0.06}s` }}
            >
              <div className="flex items-center gap-2">
                <style.icon size={18} className={style.text} aria-hidden />
                <h3 className="font-semibold text-ink">{c.title}</h3>
                <span className={`ml-auto rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.chip}`}>
                  {c.risk}
                </span>
              </div>
              <p className="mt-3 rounded-lg bg-ink/5 p-3 font-mono text-xs text-ink-soft">&quot;{c.excerpt}&quot;</p>
              <p className="mt-3 text-sm leading-relaxed text-ink">{c.explanation}</p>
              <p className="mt-3 text-sm">
                <span className="font-semibold text-brand">Negotiation tip: </span>
                <span className="text-ink-soft">{c.negotiationTip}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Missing clauses */}
      {analysis.missingClauses.length > 0 && (
        <>
          <h2 className="mt-10 text-lg font-semibold">Missing clauses ({analysis.missingClauses.length})</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {analysis.missingClauses.map((m) => (
              <div key={m.title} className="card p-5">
                <p className="font-semibold">{m.title}</p>
                <p className="mt-1.5 text-sm text-ink-soft">{m.whyItMatters}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Playbook checks (Business plan) */}
      {analysis.playbookChecks && analysis.playbookChecks.length > 0 && (
        <>
          <h2 className="mt-10 flex items-center gap-2 text-lg font-semibold">
            <ShieldCheck size={18} className="text-brand" aria-hidden /> Your playbook
          </h2>
          <div className="mt-4 space-y-3">
            {analysis.playbookChecks.map((p) => {
              const violated = p.status === "violated";
              const Icon = violated ? OctagonAlert : CheckCircle2;
              return (
                <div key={p.rule} className={`card border p-5 ${violated ? "border-risk-high/30" : "border-risk-low/30"}`}>
                  <div className="flex items-center gap-2">
                    <Icon size={16} className={violated ? "text-risk-high" : "text-risk-low"} aria-hidden />
                    <p className="font-semibold text-ink">{p.rule}</p>
                    <span
                      className={`ml-auto rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        violated ? "bg-risk-high/10 text-risk-high" : "bg-risk-low/10 text-risk-low"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-ink-soft">{p.note}</p>
                </div>
              );
            })}
          </div>
        </>
      )}

      <p className="mt-8 text-xs text-ink-soft">
        This analysis is informational, not legal advice. For high-risk contracts, consult a qualified lawyer.
      </p>
    </div>
  );
}
