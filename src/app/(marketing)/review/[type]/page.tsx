import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { CONTRACT_TYPES, getContractType } from "@/lib/contract-types";
import { CTA } from "@/components/marketing/CTA";
import { site } from "@/lib/site";

// Programmatic SEO: one deep, genuinely useful page per contract type.
// Targets long-tail queries like "NDA red flags" and "freelance contract checklist".

export function generateStaticParams() {
  return CONTRACT_TYPES.map((t) => ({ type: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  const t = getContractType(type);
  if (!t) return { title: "Not found" };
  return {
    title: `${t.name} review: red flags, checklist & AI analysis`,
    description: `What to check before signing a ${t.longName.toLowerCase()}: ${t.redFlags.length} common red flags, a pre-signing checklist, and instant AI review.`,
    alternates: { canonical: `${site.url}/review/${t.slug}` },
  };
}

export default async function ContractTypeReviewPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const t = getContractType(type);
  if (!t) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const others = CONTRACT_TYPES.filter((o) => o.slug !== t.slug).slice(0, 4);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-3xl px-5 py-16">
        <p className="eyebrow">Contract review guide</p>
        <h1 className="h-display mt-3 text-4xl">{t.longName} review: what to check before you sign</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">{t.intro}</p>
        <p className="mt-2 text-sm text-ink-soft">Typical signers: {t.audience.toLowerCase()}.</p>

        <div className="card mt-8 border-brand/25 bg-brand/5 p-6">
          <p className="font-semibold">Reviewing a {t.name.toLowerCase()} right now?</p>
          <p className="mt-1 text-sm text-ink-soft">
            Upload it and get a risk score, flagged clauses, and negotiation tips in about a minute. First analysis free.
          </p>
          <Link href="/register" className="btn btn-primary mt-4">Analyze my {t.name.toLowerCase()} →</Link>
        </div>

        {/* Red flags */}
        <h2 className="h-display mt-14 text-2xl">The {t.redFlags.length} most common {t.name} red flags</h2>
        <div className="mt-6 space-y-4">
          {t.redFlags.map((r, i) => (
            <div key={r.title} className="card border-risk-high/20 p-6">
              <div className="flex items-center gap-2.5">
                <AlertTriangle size={18} className="shrink-0 text-risk-high" aria-hidden />
                <h3 className="font-semibold">{i + 1}. {r.title}</h3>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{r.detail}</p>
            </div>
          ))}
        </div>

        {/* Checklist */}
        <h2 className="h-display mt-14 text-2xl">Pre-signing checklist</h2>
        <ul className="mt-6 space-y-3">
          {t.checklist.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-risk-low" aria-hidden />
              {item}
            </li>
          ))}
        </ul>

        {/* FAQ */}
        <h2 className="h-display mt-14 text-2xl">Frequently asked questions</h2>
        <div className="mt-6 space-y-3">
          {t.faq.map((f) => (
            <details key={f.q} className="card group p-5">
              <summary className="cursor-pointer font-semibold marker:content-none">{f.q}</summary>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>

        {/* Interlinking */}
        <h2 className="mt-14 text-lg font-semibold">Review other contract types</h2>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {others.map((o) => (
            <Link key={o.slug} href={`/review/${o.slug}`} className="rounded-full border border-ink/15 px-4 py-2 text-sm hover:bg-ink/5">
              {o.name}
            </Link>
          ))}
          <Link href="/review" className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink-soft hover:bg-ink/5">
            All types →
          </Link>
        </div>

        <p className="mt-10 text-xs text-ink-soft">
          This guide is general information, not legal advice. Laws differ per jurisdiction — for high-stakes contracts, consult a qualified lawyer.
        </p>
      </div>

      <CTA />
    </>
  );
}
