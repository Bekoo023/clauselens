import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — how ClauseLens works, privacy & plans",
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
        a: "ClauseLens uses a frontier AI model tuned with contract-specific playbooks. It reliably catches the high-impact patterns — liability, payment, IP, termination — and always quotes the exact contract language so you can verify every flag yourself. For high-risk contracts we explicitly recommend a human lawyer.",
      },
      {
        q: "Is this legal advice?",
        a: "No. ClauseLens gives plain-language information to help you understand what you're signing. It doesn't replace a qualified lawyer, and for genuinely high-stakes agreements we'll tell you to get one.",
      },
      {
        q: "How long does an analysis take?",
        a: "Typically 30–90 seconds, depending on contract length.",
      },
    ],
  },
  {
    title: "Privacy & security",
    items: [
      {
        q: "What happens to my contracts?",
        a: "Contracts are encrypted in transit and at rest, visible only to your account (and teammates you invite). You can delete any contract permanently at any time from your dashboard.",
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
        a: "One full analysis per month with risk score, summary and your top flagged clauses — enough to check the contract that's on your desk right now.",
      },
      {
        q: "Can I change or cancel my plan?",
        a: "Anytime, from your billing settings. Upgrades apply immediately; cancellations run to the end of the paid period.",
      },
      {
        q: "Do you offer team or volume pricing?",
        a: "Business includes 5 seats and unlimited analyses. For larger teams, SSO or a DPA, contact us for Enterprise pricing.",
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
    <section className="container-page max-w-3xl py-16 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="eyebrow">FAQ</p>
      <h1 className="h-display mt-4 text-4xl sm:text-5xl">Questions, answered</h1>

      {groups.map((g) => (
        <div key={g.title} className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">{g.title}</h2>
          <div className="mt-4 space-y-3">
            {g.items.map((i) => (
              <details key={i.q} className="card p-5">
                <summary className="cursor-pointer list-none font-semibold marker:content-none">{i.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{i.a}</p>
              </details>
            ))}
          </div>
        </div>
      ))}

      <p className="mt-12 text-sm text-ink-soft">
        Anything else?{" "}
        <Link href="/contact" className="font-semibold text-brand hover:underline">Contact us</Link> — we reply within one business day.
      </p>
    </section>
  );
}
