import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  FileSearch,
  Gauge,
  Handshake,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { ContractScan } from "@/components/marketing/ContractScan";
import { Reveal } from "@/components/marketing/Reveal";
import { WordReveal } from "@/components/marketing/WordReveal";
import { CountUp } from "@/components/marketing/CountUp";
import { SpotlightCard } from "@/components/marketing/SpotlightCard";
import { Marquee } from "@/components/marketing/Marquee";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: site.url },
};

const steps = [
  {
    title: "Paste or upload",
    text: "Drop in any contract: client agreement, NDA, SOW, lease. PDF, Word or plain text.",
  },
  {
    title: "AI reads every clause",
    text: "ClauseLens scans for liability traps, payment terms, IP transfers, auto-renewals and 40+ other risk patterns.",
  },
  {
    title: "Sign with confidence",
    text: "Get a risk score, plain-language explanations and concrete counter-proposals you can send back today.",
  },
];

const features = [
  {
    icon: Gauge,
    title: "Risk score 0-100",
    text: "One number that tells you instantly how much attention a contract needs before you sign it.",
  },
  {
    icon: FileSearch,
    title: "Clause-by-clause flags",
    text: "Every risky clause highlighted with a plain-language explanation of what it means for you.",
  },
  {
    icon: ListChecks,
    title: "Missing clause detection",
    text: "What a contract doesn't say is often the biggest risk. We check for kill fees, revision limits and more.",
  },
  {
    icon: Handshake,
    title: "Negotiation tips",
    text: "Concrete counter-proposals for every flag: what to ask for, and how to phrase it.",
  },
  {
    icon: ShieldCheck,
    title: "Your playbook",
    text: "Set your own rules, like 'never accept net-90', and every contract gets checked against them.",
  },
  {
    icon: Users,
    title: "Built for teams",
    text: "Share analyses with your team or your client, with a report link that speaks for itself.",
  },
];

const stats = [
  { to: 60, suffix: "s", label: "Average analysis time" },
  { to: 40, suffix: "+", label: "Risk patterns checked" },
  { to: 0, suffix: "", label: "Legalese in the report" },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden">
          {/* Static texture. Colour comes from the app backdrop. */}
          <div className="bg-dot-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem]" aria-hidden />

          <div className="container-page grid items-center gap-16 py-20 sm:py-28 lg:py-36 lg:grid-cols-2">
            <div>
              {/* No rise-in here: WordReveal animates the words themselves. */}
              <h1 className="h-display text-5xl leading-[1.03] sm:text-6xl lg:text-7xl">
                <WordReveal text={"Know what you're signing."} />{" "}
                <WordReveal text="In 60 seconds." className="text-gradient" start={280} />
              </h1>

              <p
                className="rise-in mt-7 max-w-xl text-xl leading-relaxed text-ink-soft"
                style={{ "--rise-delay": "120ms" } as React.CSSProperties}
              >
                Upload any contract and get a risk score, flagged clauses and
                concrete negotiation tips in plain language, not legalese.
                Built for freelancers, agencies and startups.
              </p>

              <div
                className="rise-in mt-10 flex flex-wrap items-center gap-3"
                style={{ "--rise-delay": "180ms" } as React.CSSProperties}
              >
                <Link href="/register" className="btn btn-primary group px-7 py-3.5 text-base">
                  Analyze a contract free
                  <ArrowRight size={18} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link href="/features" className="btn btn-glass px-7 py-3.5 text-base">
                  <Sparkles size={16} aria-hidden className="text-brand" />
                  See how it works
                </Link>
              </div>

              <p
                className="rise-in mt-6 text-sm text-ink-soft"
                style={{ "--rise-delay": "240ms" } as React.CSSProperties}
              >
                Free plan available · No credit card required
              </p>
            </div>

            <div className="rise-in float-slower" style={{ "--rise-delay": "200ms" } as React.CSSProperties}>
              <ContractScan />
            </div>
          </div>

          {/* Stats strip, so the fold does not drop straight into a text wall. */}
          <div className="container-page pb-20 sm:pb-28">
            <Reveal>
              <div className="card card-gradient-border grid gap-8 p-10 sm:grid-cols-3 sm:p-14">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="h-display text-gradient text-5xl sm:text-6xl">
                      <CountUp to={s.to} suffix={s.suffix} />
                    </p>
                    <p className="mt-3 text-base text-ink-soft">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Ticker of the contract types the analyzer covers. Doubles as
              internal linking to the /review guides. */}
          <div className="pb-20 sm:pb-28">
            <Reveal>
              <p className="container-page mb-5 text-center text-sm text-ink-soft">
                Trained on the contracts you actually sign
              </p>
              <Marquee />
            </Reveal>
          </div>
        </section>

        <hr className="divider-glow container-page" />

        {/* ---------- How it works ---------- */}
        <section className="relative py-28 sm:py-36">
          <div className="container-page">
            <Reveal>
              <p className="eyebrow text-center">How it works</p>
              <h2 className="h-display mx-auto mt-4 max-w-3xl text-center text-4xl sm:text-5xl">
                From &quot;what does this even mean?&quot; to signed. Safely!
              </h2>
            </Reveal>
            <div className="mt-16 grid gap-7 md:grid-cols-3">
              {steps.map((s, i) => (
                <Reveal key={s.title} delay={i * 70}>
                  <SpotlightCard className="card card-hover group relative h-full overflow-hidden p-9 sm:p-10">
                    {/* Ghosted step numeral, a focal point beyond the text. */}
                    <span
                      aria-hidden
                      className="h-display pointer-events-none absolute -right-2 -top-6 text-[7rem] leading-none text-ink/[0.04] transition-all duration-700 group-hover:-translate-y-1 group-hover:text-brand/10"
                    >
                      {i + 1}
                    </span>
                    <span className="font-mono text-sm font-medium text-brand">
                      step {i + 1}
                    </span>
                    <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
                    <p className="mt-3 leading-relaxed text-ink-soft">{s.text}</p>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Features grid ---------- */}
        <section className="container-page py-28 sm:py-36">
          <Reveal>
            <p className="eyebrow">What you get</p>
            <h2 className="h-display mt-4 max-w-3xl text-4xl sm:text-5xl">
              A structured second read, without the hourly rate
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 60}>
                <SpotlightCard className="card card-hover group h-full p-9 sm:p-10">
                  <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-bright text-white shadow-[0_8px_20px_-10px_var(--color-brand)] transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-[0_12px_28px_-8px_var(--color-brand)]">
                    <f.icon size={22} aria-hidden />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold">{f.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-soft">{f.text}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
