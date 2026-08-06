import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  title: "FAQ how ClauseLens works, privacy & plans",
  description:
    "Answers about contract analysis accuracy, data privacy, supported contract types, plans and billing.",
};

const groups = [
  {
    title: "Product",
    items: [
      {
        q: "Which contract types does ClauseLens support?",
        a: "Any English-language contract: client/services agreements, NDAs, statements of work, employment offers, leases, SaaS terms and more. Role-specific checklists exist for freelancers, agencies and startups, with more roles added regularly.",
      },
      {
        q: "How accurate is the analysis?",
        a: "ClauseLens uses a frontier AI model tuned with contract-specific playbooks. It reliably catches the high-impact patterns liability, payment, IP, termination and always quotes the exact contract language so you can verify every flag yourself. For high-risk contracts we explicitly recommend a human lawyer.",
      },
      {
        q: "Is this legal advice?",
        a: "No. ClauseLens gives plain-language information to help you understand what you're signing. It doesn't replace a qualified lawyer, and for genuinely high-stakes agreements we'll tell you to get one.",
      },
      {
        q: "How long does an analysis take?",
        a: "Typically 30-90 seconds, depending on contract length.",
      },
    ],
  },
  {
    title: "Privacy & security",
    items: [
      {
        q: "What happens to my contracts?",
        a: "Contracts are encrypted in transit and at rest and visible only to your account. You can share an individual analysis through a private link at any time, and delete any contract permanently from your dashboard.",
      },
      {
        q: "Are my contracts used to train AI models?",
        a: "No. Analysis requests are processed via API under terms that exclude training on your data.",
      },
    ],
  },
  {
    title: "Plans & billing",
    items: [
      {
        q: "What does the free plan include?",
        a: "One full analysis per month with risk score, summary and your top flagged clauses enough to check the contract that's on your desk right now.",
      },
      {
        q: "Can I change or cancel my plan?",
        a: "Anytime, from your billing settings. Upgrades apply immediately; cancellations run to the end of the paid period.",
      },
      {
        q: "Do you offer team or volume pricing?",
        a: "Business includes unlimited analyses on a single account today; team seats are coming soon. For multiple people, larger teams, SSO or a DPA, contact us for Enterprise pricing.",
      },
    ],
  },
];

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((g) =>
      g.items.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      }))
    ),
  };

  return (
    <section className="relative container-page max-w-3xl py-20 sm:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="eyebrow rise-in">FAQ</p>
      <h1
        className="h-display rise-in mt-4 text-4xl sm:text-5xl lg:text-6xl"
        style={{ "--rise-delay": "60ms" } as React.CSSProperties}
      >
        Questions, <span className="text-gradient">answered</span>
      </h1>

      {groups.map((g) => (
        <div key={g.title} className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">{g.title}</h2>
          <div className="mt-5 space-y-3">
            {g.items.map((i, idx) => (
              <Reveal key={i.q} delay={idx * 45}>
                <details className="card card-hover group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold marker:content-none">
                    {i.q}
                    <ChevronDown
                      size={18}
                      aria-hidden
                      className="shrink-0 text-ink-soft transition-transform duration-300 group-open:rotate-180 group-open:text-brand"
                    />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{i.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      ))}

      <p className="mt-12 text-sm text-ink-soft">
        Anything else?{" "}
        <Link href="/contact" className="link-underline font-semibold text-brand">Contact us</Link> we reply within one business day.
      </p>
    </section>
  );
}
