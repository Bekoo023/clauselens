"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { CTA } from "@/components/marketing/CTA";

const tiers = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    blurb: "For the occasional contract.",
    cta: { href: "/register", label: "Start free" },
    highlight: false,
    features: [
      "1 analysis per month",
      "Overall risk score",
      "Top-3 flagged clauses",
      "Plain-language summary",
    ],
  },
  {
    name: "Pro",
    monthly: 29,
    yearly: 24,
    blurb: "For freelancers who sign every month.",
    cta: { href: "/register?plan=pro", label: "Start Pro" },
    highlight: true,
    features: [
      "20 analyses per month",
      "Full clause-by-clause flags",
      "Missing clause detection",
      "Negotiation tips & memo export",
      "PDF export & share links",
      "Contract history",
      "Priority email support",
    ],
  },
  {
    name: "Business",
    monthly: 79,
    yearly: 66,
    blurb: "For agencies and startups reviewing at volume.",
    cta: { href: "/register?plan=business", label: "Start Business" },
    highlight: false,
    features: [
      "Unlimited analyses",
      "Everything in Pro",
      "5 team members",
      "Custom playbooks (your red lines)",
      "API access & webhooks",
      "Priority support (same-day)",
    ],
  },
];

const faqs = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Subscriptions are month-to-month (or yearly at a discount) and can be cancelled from your billing settings in one click. You keep access until the end of the paid period.",
  },
  {
    q: "What counts as one analysis?",
    a: "One contract processed end-to-end: risk score, clause flags, missing clauses and negotiation tips. Re-running an updated version of the same contract counts as a new analysis.",
  },
  {
    q: "Is this legal advice?",
    a: "No. ClauseLens provides plain-language information to help you understand contracts. For binding legal advice, we recommend consulting a qualified lawyer — and for high-risk contracts, we'll tell you exactly that.",
  },
  {
    q: "Do you offer refunds?",
    a: "If ClauseLens isn't for you, email us within 14 days of your first payment for a full refund. No forms, no friction.",
  },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(true);

  return (
    <>
      <section className="container-page py-16 text-center sm:py-20">
        <p className="eyebrow">Pricing</p>
        <h1 className="h-display mx-auto mt-4 max-w-2xl text-4xl sm:text-5xl">
          Cheaper than one bad clause
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
          Start free. Upgrade when contracts become part of your routine.
        </p>

        {/* Billing toggle */}
        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-ink/10 bg-surface p-1.5">
          <button
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${!yearly ? "bg-ink-fixed text-white" : "text-ink-soft"}`}
            onClick={() => setYearly(false)}
            aria-pressed={!yearly}
          >
            Monthly
          </button>
          <button
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${yearly ? "bg-ink-fixed text-white" : "text-ink-soft"}`}
            onClick={() => setYearly(true)}
            aria-pressed={yearly}
          >
            Yearly <span className="ml-1 text-risk-low">−17%</span>
          </button>
        </div>
      </section>

      <section className="container-page grid gap-6 pb-20 lg:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`card relative flex h-full flex-col p-8 ${t.highlight ? "border-brand/40 shadow-card-hover ring-1 ring-brand/30" : ""}`}
          >
            {t.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand to-brand-bright px-3 py-1 text-xs font-semibold text-white">
                <Sparkles size={12} className="mr-1 inline" aria-hidden />
                Most popular
              </span>
            )}
            <h2 className="text-lg font-semibold">{t.name}</h2>
            <p className="mt-1 text-sm text-ink-soft">{t.blurb}</p>
            <p className="mt-5">
              <span className="h-display text-4xl">
                €{yearly ? t.yearly : t.monthly}
              </span>
              <span className="text-sm text-ink-soft"> /month</span>
              {yearly && t.monthly > 0 && (
                <span className="ml-2 text-xs text-ink-soft">billed yearly</span>
              )}
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check size={16} className="mt-0.5 shrink-0 text-risk-low" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={t.cta.href}
              className={`btn mt-8 w-full ${t.highlight ? "btn-primary" : "border border-ink/15 hover:bg-ink/5"}`}
            >
              {t.cta.label}
            </Link>
          </div>
        ))}
      </section>

      <section className="border-t border-ink/5 bg-surface py-16">
        <div className="container-page max-w-3xl">
          <h2 className="h-display text-center text-2xl sm:text-3xl">Pricing questions</h2>
          <div className="mt-8 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="card group p-5">
                <summary className="cursor-pointer list-none font-semibold marker:content-none">
                  {f.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-ink-soft">
            Need SSO, a DPA or volume pricing?{" "}
            <Link href="/contact" className="font-semibold text-brand hover:underline">
              Talk to us about Enterprise
            </Link>
            .
          </p>
        </div>
      </section>

      <div className="pt-20">
        <CTA />
      </div>
    </>
  );
}
