import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ScanSearch } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { analysisSchema } from "@/lib/analyze";
import { ReportView } from "@/components/dashboard/ReportView";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { site } from "@/lib/site";

// Public, read-only contract report. This page is the growth loop:
// every shared report carries the ClauseLens badge and a CTA.

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const contract = await prisma.contract.findUnique({ where: { shareToken: token } });
  if (!contract) return { title: "Report not found" };
  return {
    title: `Contract risk report: ${contract.title} — ClauseLens`,
    description: `AI contract analysis with risk score ${contract.riskScore}/100. Flagged clauses, plain-language explanations, and negotiation tips.`,
    robots: { index: false }, // reports contain client contract details — keep them out of search
    openGraph: {
      title: `Contract risk report — risk score ${contract.riskScore}/100`,
      description: "AI-powered contract review by ClauseLens.",
    },
  };
}

export default async function SharedReportPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const contract = await prisma.contract.findUnique({ where: { shareToken: token } });
  if (!contract || !contract.analysis) notFound();

  const parsed = analysisSchema.safeParse(contract.analysis);
  if (!parsed.success) notFound();

  return (
    <div className="min-h-screen bg-paper">
      {/* Minimal header with badge */}
      <header className="border-b border-ink/10">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <ScanSearch size={20} className="text-brand" aria-hidden />
            ClauseLens
          </Link>
          <Link href="/register" className="btn btn-primary px-4 py-2 text-xs">
            Analyze your own contract
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10">
        <p className="eyebrow">Shared contract report</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="h-display text-2xl">{contract.title}</h1>
          {contract.riskLevel && <RiskBadge level={contract.riskLevel} score={contract.riskScore} />}
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          Generated {contract.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · Analyzed with ClauseLens
        </p>

        <ReportView analysis={parsed.data} />

        {/* Growth CTA */}
        <div className="card mt-12 border-brand/25 bg-gradient-to-br from-brand/5 to-brand-2/5 p-8 text-center">
          <h2 className="h-display text-xl">Reviewing a contract of your own?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
            Get a risk score, flagged clauses, and negotiation tips in about a minute. Your first analysis is free — no credit card needed.
          </p>
          <Link href="/register" className="btn btn-primary mt-5">Try ClauseLens free</Link>
        </div>

        <p className="mt-8 text-center text-xs text-ink-soft">
          <Link href="/" className="hover:text-ink">{site.url.replace("https://", "")}</Link> · This report is informational, not legal advice.
        </p>
      </main>
    </div>
  );
}
