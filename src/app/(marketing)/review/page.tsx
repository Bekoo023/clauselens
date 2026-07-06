import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { CONTRACT_TYPES } from "@/lib/contract-types";
import { CTA } from "@/components/marketing/CTA";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contract review guides: red flags & checklists per contract type",
  description:
    "Free review guides for NDAs, freelance contracts, SaaS agreements, leases, and more. Common red flags, pre-signing checklists, and instant AI analysis.",
  alternates: { canonical: `${site.url}/review` },
};

export default function ReviewIndexPage() {
  return (
    <>
      <div className="mx-auto max-w-4xl px-5 py-16">
        <p className="eyebrow">Review guides</p>
        <h1 className="h-display mt-3 text-4xl">Know what to check, per contract type</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Every contract type hides risk in different places. Pick yours for the most common red flags, a pre-signing checklist, and answers to the questions everyone asks.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {CONTRACT_TYPES.map((t) => (
            <Link key={t.slug} href={`/review/${t.slug}`} className="card card-hover group p-6">
              <h2 className="flex items-center justify-between font-semibold">
                {t.longName}
                <ArrowRight size={16} className="text-ink-soft transition-transform group-hover:translate-x-0.5" aria-hidden />
              </h2>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">{t.intro}</p>
              <p className="mt-3 text-xs font-medium text-brand">{t.redFlags.length} red flags · checklist · FAQ</p>
            </Link>
          ))}
        </div>
      </div>
      <CTA />
    </>
  );
}
