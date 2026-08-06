import Link from "next/link";
import { ScanSearch, ShieldCheck, Sparkles, Zap } from "lucide-react";

const highlights = [
  { icon: Zap, text: "Full analysis in about a minute" },
  { icon: ShieldCheck, text: "40+ risk patterns checked per contract" },
  { icon: Sparkles, text: "Concrete negotiation wording, not legalese" },
];

/** Split-screen shell shared by login & register. */
export function AuthShell({ title, subtitle, children }: {
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink-fixed p-10 text-white lg:flex">
        {/* Brighter than the page wash, since this panel is always dark. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(40rem 32rem at 0% 0%, rgb(91 91 214 / 0.55), transparent 65%), radial-gradient(32rem 26rem at 100% 100%, rgb(34 211 238 / 0.28), transparent 65%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(255 255 255) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
          aria-hidden
        />

        <Link href="/" className="group relative flex items-center gap-2.5 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-deep via-brand to-brand-bright shadow-[0_6px_18px_-8px_var(--color-brand)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
            <ScanSearch size={18} aria-hidden />
          </span>
          <span className="h-display text-lg text-white">ClauseLens</span>
        </Link>

        <div className="relative max-w-md">
          <p className="h-display text-3xl leading-snug text-white">
            Upload any contract and get a risk score, flagged clauses and
            negotiation tips{" "}
            <span className="bg-gradient-to-r from-brand-bright to-accent bg-clip-text text-transparent">
              in about a minute.
            </span>
          </p>
          <ul className="mt-8 space-y-3.5">
            {highlights.map((h, i) => (
              <li
                key={h.text}
                className="rise-in flex items-center gap-3 text-sm text-white/75"
                style={{ "--rise-delay": `${140 + i * 70}ms` } as React.CSSProperties}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-brand-bright">
                  <h.icon size={15} aria-hidden />
                </span>
                {h.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/40">Information, not legal advice.</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-5 py-14">
        <div className="w-full max-w-sm">
          <Link href="/" className="group mb-8 flex items-center gap-2.5 font-bold lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-deep via-brand to-brand-bright text-white shadow-[0_6px_18px_-8px_var(--color-brand)]">
              <ScanSearch size={18} aria-hidden />
            </span>
            <span className="h-display text-lg">ClauseLens</span>
          </Link>
          <h1 className="h-display rise-in text-3xl">{title}</h1>
          <p
            className="rise-in mt-2 text-sm text-ink-soft"
            style={{ "--rise-delay": "60ms" } as React.CSSProperties}
          >
            {subtitle}
          </p>
          <div className="rise-in mt-8" style={{ "--rise-delay": "120ms" } as React.CSSProperties}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
