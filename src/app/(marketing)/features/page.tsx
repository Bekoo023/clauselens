import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileSearch, Gauge, Handshake, KeyRound, ListChecks, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";
import { CTA } from "@/components/marketing/CTA";

export const metadata: Metadata = {
  title: "Features AI contract analysis, risk scores & negotiation tips",
  description:
    "See how ClauseLens reviews contracts: clause-by-clause risk flags, missing clause detection, custom playbooks and shareable reports.",
};

const sections = [
  {
    icon: Gauge,
    title: "A risk score you can act on",
    text: "Every analysis starts with a single 0-100 score, built from the severity and number of flagged clauses. Green means lower detected risk, amber means review recommended, red means high-priority issues to address. You always know where to focus before you read a single clause.",
    detail: "Scores are calibrated per contract type: an NDA and a services agreement are judged by different standards.",
  },
  {
    icon: FileSearch,
    title: "Clause-by-clause detection",
    text: "ClauseLens reads the full contract and flags liability caps (or the lack of them), payment terms, IP transfers, indemnification, non-competes, auto-renewals, termination rights and jurisdiction clauses.",
    detail: "Each flag quotes the exact contract language and explains it in one plain-language paragraph.",
  },
  {
    icon: ListChecks,
    title: "Missing clause detection",
    text: "The most expensive problems are the clauses that aren't there: no kill fee, no revision limit, no late-payment interest. ClauseLens checks every contract against what a fair agreement should contain for your role.",
    detail: "Checklists exist for freelancers, agencies, startups and landlords/tenants.",
  },
  {
    icon: Handshake,
    title: "Negotiation tips that write themselves",
    text: "Every flagged clause comes with a concrete counter-proposal: what to ask for, why it's reasonable, and phrasing you can paste straight into your reply email.",
    detail: "Every tip is included in your exportable PDF report.",
  },
  {
    icon: ShieldCheck,
    title: "Your rules, enforced automatically",
    text: "Business plans include playbooks: your own red lines, like \"never accept more than net-30\" or \"liability must be capped at project fees\". Every future contract is checked against them.",
    detail: "Perfect for agencies that review dozens of SOWs per month.",
  },
  {
    icon: KeyRound,
    title: "Share links, with team seats and an API on the way",
    text: "Share any analysis with a client or teammate through a private link today. Team seats and a rate-limited API with per-analysis webhooks are in development for Business.",
    detail: "Coming soon to the Business plan.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="relative container-page py-20 sm:py-24">
        <p className="eyebrow rise-in">Features</p>
        <h1
          className="h-display rise-in mt-4 max-w-3xl text-4xl leading-[1.08] sm:text-5xl lg:text-6xl"
          style={{ "--rise-delay": "60ms" } as React.CSSProperties}
        >
          Everything a careful reader would catch.{" "}
          <span className="text-gradient">In one minute.</span>
        </h1>
        <p
          className="rise-in mt-6 max-w-xl text-lg text-ink-soft"
          style={{ "--rise-delay": "120ms" } as React.CSSProperties}
        >
          ClauseLens is built for people who sign contracts, not people who write them.
        </p>
      </section>

      <section className="container-page grid gap-6 pb-20 md:grid-cols-2">
        {sections.map((s, i) => (
          <Reveal key={s.title} variant={i % 2 ? "right" : "left"} delay={(i % 2) * 60}>
            <article className="card card-hover group h-full p-8">
              <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-bright text-white shadow-[0_8px_20px_-10px_var(--color-brand)] transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-[0_12px_28px_-8px_var(--color-brand)]">
                <s.icon size={22} aria-hidden />
              </span>
              <h2 className="mt-5 text-xl font-semibold">{s.title}</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{s.text}</p>
              <p className="mt-4 rounded-r-lg border-l-2 border-brand/40 bg-brand/[0.04] py-2 pl-3 text-sm text-ink-soft">
                {s.detail}
              </p>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="container-page pb-20">
        <Reveal variant="scale">
          <div className="card card-gradient-border relative flex flex-col items-center gap-5 overflow-hidden p-12 text-center">
            <h2 className="h-display relative text-2xl sm:text-3xl">Compare plans</h2>
            <Link href="/pricing" className="btn btn-primary group relative">
              See pricing
              <ArrowRight size={16} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>

      <CTA />
    </>
  );
}
