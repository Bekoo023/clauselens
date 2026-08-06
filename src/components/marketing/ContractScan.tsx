/**
 * ContractScan: the signature visual of ClauseLens.
 * A mock contract that gets "scanned": a light beam travels down while
 * risk chips animate in next to flagged clauses. Pure CSS, respects
 * prefers-reduced-motion (chips render statically, beam hidden).
 */
import { AlertTriangle, CheckCircle2, OctagonAlert } from "lucide-react";

const lines = [
  { text: "SERVICES AGREEMENT", style: "font-semibold text-ink" },
  { text: "This Agreement is entered into between Client and", style: "" },
  { text: "Contractor for the provision of design services...", style: "" },
  { text: "4.2 Payment shall be due within ninety (90) days", style: "bg-risk-medium/15 rounded px-1 -mx-1" },
  { text: "of receipt of a valid invoice.", style: "bg-risk-medium/15 rounded px-1 -mx-1" },
  { text: "6.1 Contractor shall be liable for any and all", style: "bg-risk-high/15 rounded px-1 -mx-1" },
  { text: "damages without limitation arising from...", style: "bg-risk-high/15 rounded px-1 -mx-1" },
  { text: "8.3 All work product, including pre-existing", style: "" },
  { text: "materials, shall be assigned to Client...", style: "" },
  { text: "11.1 Either party may terminate with 30 days", style: "bg-risk-low/15 rounded px-1 -mx-1" },
  { text: "written notice.", style: "bg-risk-low/15 rounded px-1 -mx-1" },
];

const chips = [
  {
    icon: AlertTriangle,
    label: "90-day payment terms",
    tone: "text-risk-medium border-risk-medium/30 bg-risk-medium/10",
    top: "26%",
    delay: "1.2s",
  },
  {
    icon: OctagonAlert,
    label: "Unlimited liability",
    tone: "text-risk-high border-risk-high/30 bg-risk-high/10",
    top: "45%",
    delay: "2.4s",
  },
  {
    icon: CheckCircle2,
    label: "Fair termination",
    tone: "text-risk-low border-risk-low/30 bg-risk-low/10",
    top: "78%",
    delay: "3.6s",
  },
];

export function ContractScan() {
  return (
    <div className="relative mx-auto w-full max-w-lg" aria-hidden>
      {/* The halo is a wide box-shadow, not a blurred sibling: same look, no
          filter layer. */}
      <div className="card card-gradient-border relative overflow-hidden p-6 shadow-[0_40px_90px_-50px_var(--color-brand)]">
        <div className="space-y-2.5 font-mono text-[11px] leading-relaxed text-ink-soft sm:text-xs">
          {lines.map((l, i) => (
            <p key={i} className={l.style}>{l.text}</p>
          ))}
        </div>
        {/* Scan beam */}
        <div className="scanline pointer-events-none absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-brand/20 to-transparent">
          <div className="absolute inset-x-2 top-1/2 h-px bg-gradient-to-r from-transparent via-brand to-transparent shadow-[0_0_12px_2px_var(--color-brand)]" />
        </div>
      </div>

      {/* Risk chips, floating next to the contract */}
      {chips.map((c, i) => (
        <div
          key={c.label}
          className={`chip-in absolute -right-3 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-lg sm:-right-10 ${c.tone}`}
          style={{ top: c.top, animationDelay: c.delay }}
        >
          {/* Nested so the loop does not overwrite the one-shot chip-in transform. */}
          <span className={`flex items-center gap-1.5 ${i % 2 ? "float-slower" : "float-slow"}`}>
            <c.icon size={14} aria-hidden />
            {c.label}
          </span>
        </div>
      ))}

      {/* Score badge */}
      <div
        className="chip-in absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-ink/10 bg-surface px-4 py-3 shadow-card-hover"
        style={{ animationDelay: "4.4s" }}
      >
        <div className="relative grid h-11 w-11 place-items-center rounded-full bg-risk-high/10 font-display text-sm font-bold text-risk-high">
          72
          <span className="absolute inset-0 rounded-full ring-2 ring-risk-high/30" />
        </div>
        <div>
          <p className="text-xs font-semibold text-ink">Risk score: high</p>
          <p className="text-[11px] text-ink-soft">2 clauses need negotiation</p>
        </div>
      </div>
    </div>
  );
}
