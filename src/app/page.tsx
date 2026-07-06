import Link from "next/link";
import {
  ArrowRight,
  FileSearch,
  Gauge,
  Handshake,
  ListChecks,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { ContractScan } from "@/components/marketing/ContractScan";
import { Reveal } from "@/components/marketing/Reveal";
import { CTA } from "@/components/marketing/CTA";

const steps = [
  {
    title: "Paste or upload",
    text: "Drop in any contract — client agreement, NDA, SOW, lease. PDF, Word or plain text.",
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
    title: "Risk score 0–100",
    text: "One number that tells you instantly whether to sign, negotiate or walk away.",
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
    text: "Set your own rules — \"never accept net-90\" — and every contract gets checked against them.",
  },
  {
    icon: Users,
    title: "Built for teams",
    text: "Share analyses with your team or your client, with a report link that speaks for itself.",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden">
          <div className="bg-dot-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem]" aria-hidden />
          <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-[56rem] -translate-x-1/2 rounded-full bg-brand/15 blur-3xl" aria-hidden />
          <div className="container-page grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-2">
            <div>
              <p className="eyebrow">AI contract review</p>
              <h1 className="h-display mt-4 text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
                Know what you&apos;re signing.{" "}
                <span className="bg-gradient-to-r from-brand to-brand-bright bg-clip-text text-transparent">
                  In 60 seconds.
                </span>
              </h1>
              <p className="mt-5 max-w-lg text-lg text-ink-soft">
                Upload any contract and get a risk score, flagged clauses and
                concrete negotiation tips — in plain language, not legalese.
                Built for freelancers, agencies and startups.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/register" className="btn btn-primary text-base">
                  Analyze a contract free <ArrowRight size={18} aria-hidden />
                </Link>
                <Link href="/features" className="btn btn-ghost text-base">
                  See how it works
                </Link>
              </div>
              <p className="mt-4 text-sm text-ink-soft">
                Free plan available · No credit card required
              </p>
            </div>
            <ContractScan />
          </div>
        </section>

        {/* ---------- How it works ---------- */}
        <section className="border-y border-ink/5 bg-surface py-20">
          <div className="container-page">
            <Reveal>
              <p className="eyebrow text-center">How it works</p>
              <h2 className="h-display mx-auto mt-3 max-w-2xl text-center text-3xl sm:text-4xl">
                From “what does this even mean?” to signed — safely
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((s, i) => (
                <Reveal key={s.title}>
                  <div className="card card-hover h-full p-7">
                    <span className="font-mono text-sm font-medium text-brand">
                      step {i + 1}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Features grid ---------- */}
        <section className="container-page py-20">
          <Reveal>
            <p className="eyebrow">What you get</p>
            <h2 className="h-display mt-3 max-w-2xl text-3xl sm:text-4xl">
              A contract lawyer&apos;s eye, without the hourly rate
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Reveal key={f.title}>
                <div className="card card-hover h-full p-7">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                    <f.icon size={20} aria-hidden />
                  </span>
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- Pricing teaser ---------- */}
        <section className="container-page py-20">
          <Reveal>
            <div className="card flex flex-col items-center gap-6 p-10 text-center sm:p-14">
              <p className="eyebrow">Pricing</p>
              <h2 className="h-display max-w-xl text-3xl sm:text-4xl">
                Less than 10 minutes of a lawyer&apos;s time. Every month.
              </h2>
              <p className="max-w-lg text-ink-soft">
                Start free with one analysis per month. Upgrade to Pro from
                €24/month when contracts become part of your routine.
              </p>
              <Link href="/pricing" className="btn btn-primary">
                See plans <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </Reveal>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
