"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Sparkles } from "lucide-react";
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
      "Negotiation tips for every flag",
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
      "Custom playbooks (your red lines)",
      "Team seats (coming soon)",
      "API access & webhooks (coming soon)",
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
    a: "No. ClauseLens provides plain-language information to help you understand contracts. For binding legal advice, we recommend consulting a qualified lawyer and for high-risk contracts, we'll tell you exactly that.",
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
      <section className="relative container-page py-20 text-center sm:py-24">
        <p className="eyebrow rise-in">Pricing</p>
        <h1
          className="h-display rise-in mx-auto mt-4 max-w-2xl text-4xl sm:text-5xl lg:text-6xl"
          style={{ "--rise-delay": "60ms" } as React.CSSProperties}
        >
          Cheaper than <span className="text-gradient">one bad clause</span>
        </h1>
        <p
          className="rise-in mx-auto mt-6 max-w-xl text-lg text-ink-soft"
          style={{ "--rise-delay": "120ms" } as React.CSSProperties}
        >
          Start free. Upgrade when contracts become part of your routine.
        </p>

        {/* Billing toggle */}
        <div
          className="rise-in relative mt-10 inline-grid grid-cols-2 rounded-full border border-ink/10 bg-surface p-1.5 shadow-card"
          style={{ "--rise-delay": "180ms" } as React.CSSProperties}
        >
          <span
            className="absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-full bg-gradient-to-r from-brand-deep via-brand to-brand-bright shadow-[0_6px_18px_-8px_var(--color-brand)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: yearly ? "translateX(100%)" : "translateX(0)" }}
            aria-hidden
          />
          <button
            type="button"
            className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${!yearly ? "text-white" : "text-ink-soft"}`}
            onClick={() => setYearly(false)}
            aria-pressed={!yearly}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${yearly ? "text-white" : "text-ink-soft"}`}
            onClick={() => setYearly(true)}
            aria-pressed={yearly}
          >
            Yearly <span className="ml-1 text-risk-low">-17%</span>
          </button>
        </div>
      </section>

      <section className="container-page grid items-stretch gap-6 pb-20 lg:grid-cols-3">
        {tiers.map((t, i) => (
          <div
            key={t.name}
            // The popular tier lifts out of the row. On three cards, height
            // reads faster than colour.
            className={`card card-hover relative flex h-full flex-col overflow-hidden p-8 ${
              t.highlight ? "card-gradient-border shadow-glow lg:-my-3 lg:py-11" : ""
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {t.highlight && (
              <>
                <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 rounded-b-lg bg-gradient-to-r from-brand-deep via-brand to-brand-bright px-3 py-1 text-xs font-semibold text-white shadow-[0_6px_18px_-8px_var(--color-brand)]">
                  <Sparkles size={12} className="mr-1 inline" aria-hidden />
                  Most popular
                </span>
              </>
            )}
            <h2 className="relative text-lg font-semibold">{t.name}</h2>
            <p className="relative mt-1 text-sm text-ink-soft">{t.blurb}</p>
            <p className="relative mt-5">
              <span className={`h-display text-5xl ${t.highlight ? "text-gradient" : ""}`}>
                €{yearly ? t.yearly : t.monthly}
              </span>
              <span className="text-sm text-ink-soft"> /month</span>
              {yearly && t.monthly > 0 && (
                <span className="ml-2 text-xs text-ink-soft">billed yearly</span>
              )}
            </p>
            <ul className="relative mt-6 flex-1 space-y-3">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-risk-low/15 text-risk-low">
                    <Check size={11} strokeWidth={3} aria-hidden />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={t.cta.href.includes("plan=") ? `${t.cta.href}&interval=${yearly ? "yearly" : "monthly"}` : t.cta.href}
              className={`btn relative mt-8 w-full ${t.highlight ? "btn-primary" : "btn-glass"}`}
            >
              {t.cta.label}
            </Link>
          </div>
        ))}
      </section>

      <hr className="divider-glow container-page" />

      <section className="py-20">
        <div className="container-page max-w-3xl">
          <h2 className="h-display text-center text-2xl sm:text-3xl">Pricing questions</h2>
          <div className="mt-10 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="card card-hover group p-5 transition-all">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold marker:content-none">
                  {f.q}
                  <ChevronDown
                    size={18}
                    aria-hidden
                    className="shrink-0 text-ink-soft transition-transform duration-300 group-open:rotate-180 group-open:text-brand"
                  />
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
