import Link from "next/link";
import { ArrowUpRight, CheckCircle2, FilePlus2, FileText, Gauge, ShieldAlert, TrendingUp, Zap } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS } from "@/lib/plans";
import { riskLevelFromScore } from "@/lib/analyze";
import { getContractType } from "@/lib/contract-types";
import type { Plan, Prisma, RiskLevel } from "@prisma/client";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { RiskDistribution } from "@/components/dashboard/RiskDistribution";
import { ContractSearch } from "@/components/dashboard/ContractSearch";
import { ActivityChart, type DayCount } from "@/components/dashboard/ActivityChart";
import { TypeBreakdown } from "@/components/dashboard/TypeBreakdown";

type ContractRow = {
  id: string;
  title: string;
  createdAt: Date;
  riskLevel: RiskLevel | null;
  riskScore: number | null;
  contractType: string | null;
};

const RISK_CHIP: Record<RiskLevel, string> = {
  LOW: "bg-risk-low/10 text-risk-low",
  MEDIUM: "bg-risk-medium/10 text-risk-medium",
  HIGH: "bg-risk-high/10 text-risk-high",
};

const RISK_BAR: Record<RiskLevel, string> = {
  LOW: "bg-risk-low",
  MEDIUM: "bg-risk-medium",
  HIGH: "bg-risk-high",
};

function relativeDate(date: Date) {
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; risk?: string; type?: string; sort?: string; upgraded?: string }>;
}) {
  const session = await auth();
  const { q, risk, type, sort, upgraded } = await searchParams;

  const orderBy: Prisma.ContractOrderByWithRelationInput =
    sort === "oldest" ? { createdAt: "asc" }
    : sort === "risk-desc" ? { riskScore: "desc" }
    : sort === "risk-asc" ? { riskScore: "asc" }
    : { createdAt: "desc" };

  const user = await prisma.user.findUnique({ where: { id: session!.user.id } });
  const contracts = await prisma.contract.findMany({
    where: {
      userId: session!.user.id,
      ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
      ...(risk === "LOW" || risk === "MEDIUM" || risk === "HIGH" ? { riskLevel: risk } : {}),
      ...(type ? { contractType: type } : {}),
    },
    orderBy,
    take: 50,
  });

  const limit = user ? PLAN_LIMITS[user.plan as Plan].analysesPerMonth : 1;
  const used = user?.analysesThisMonth ?? 0;
  const usagePct = Number.isFinite(limit) ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  const avgScore =
    contracts.length > 0
      ? Math.round(
          contracts.reduce((sum: number, c: ContractRow) => sum + (c.riskScore ?? 0), 0) /
            contracts.length
        )
      : null;
  const avgLevel = avgScore != null ? riskLevelFromScore(avgScore) : null;

  const weekAgo = Date.now() - 7 * 86_400_000;
  const analyzedThisWeek = contracts.filter((c: ContractRow) => c.createdAt.getTime() >= weekAgo).length;

  const highestRisk = contracts
    .filter((c: ContractRow) => c.riskLevel === "HIGH")
    .sort((a: ContractRow, b: ContractRow) => (b.riskScore ?? 0) - (a.riskScore ?? 0))[0];

  const activityData: DayCount[] = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return { date: d.toISOString().slice(0, 10), label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), count: 0 };
  });
  for (const c of contracts as ContractRow[]) {
    const key = c.createdAt.toISOString().slice(0, 10);
    const day = activityData.find((d) => d.date === key);
    if (day) day.count++;
  }

  const typeCounts = new Map<string, number>();
  for (const c of contracts as ContractRow[]) {
    const label = c.contractType ? (getContractType(c.contractType)?.name ?? c.contractType) : "Other / unspecified";
    typeCounts.set(label, (typeCounts.get(label) ?? 0) + 1);
  }
  const typeItems = [...typeCounts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1 className="h-display mt-1 text-2xl">Contracts</h1>
        </div>
        <Link href="/dashboard/new" className="btn btn-primary">
          <FilePlus2 size={16} aria-hidden /> New analysis
        </Link>
      </div>

      {upgraded === "1" && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-risk-low/30 bg-risk-low/10 p-4 text-sm font-medium text-risk-low">
          <CheckCircle2 size={18} className="shrink-0" aria-hidden />
          Payment successful, your plan has been upgraded.
        </div>
      )}

      {/* Plan & usage */}
      {user && (
        <div className="card mt-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold">{PLAN_LIMITS[user.plan as Plan].label} plan</p>
            <p className="text-xs text-ink-soft">
              {Number.isFinite(limit) ? `${used}/${limit} analyses used this month` : "Unlimited analyses"}
            </p>
          </div>
          {Number.isFinite(limit) && (
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-ink/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand to-brand-bright transition-[width] duration-500"
                style={{ width: `${usagePct}%` }}
              />
            </div>
          )}
          {Number.isFinite(limit) && usagePct >= 80 && (
            <p className="mt-2.5 text-xs text-risk-medium">
              You&apos;re close to your monthly limit <Link href="/dashboard/settings" className="font-semibold underline">upgrade for more</Link>.
            </p>
          )}
        </div>
      )}

      {/* Stat cards */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand/10 text-brand">
              <FileText size={16} aria-hidden />
            </span>
            <p className="text-xs font-medium text-ink-soft">Contracts analyzed</p>
          </div>
          <p className="h-display mt-2.5 text-3xl">{contracts.length}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2.5">
            <span className={`grid h-9 w-9 place-items-center rounded-xl ${avgLevel ? RISK_CHIP[avgLevel] : "bg-ink/5 text-ink-soft"}`}>
              <Gauge size={16} aria-hidden />
            </span>
            <p className="text-xs font-medium text-ink-soft">Average risk score</p>
          </div>
          <p className="h-display mt-2.5 text-3xl">{avgScore ?? "—"}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand/10 text-brand">
              <TrendingUp size={16} aria-hidden />
            </span>
            <p className="text-xs font-medium text-ink-soft">Analyzed this week</p>
          </div>
          <p className="h-display mt-2.5 text-3xl">{analyzedThisWeek}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand/10 text-brand">
              <Zap size={16} aria-hidden />
            </span>
            <p className="text-xs font-medium text-ink-soft">Analyses left this month</p>
          </div>
          <p className="h-display mt-2.5 text-3xl">
            {Number.isFinite(limit) ? Math.max(0, limit - used) : "∞"}
          </p>
        </div>
      </div>

      {/* Needs attention */}
      {highestRisk && (
        <Link
          href={`/dashboard/contracts/${highestRisk.id}`}
          className="card card-hover mt-4 flex items-center gap-4 border-risk-high/20 p-5"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-risk-high/10 text-risk-high">
            <ShieldAlert size={20} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-risk-high">Needs attention</p>
            <p className="truncate text-sm font-medium">
              &ldquo;{highestRisk.title}&rdquo; scored {highestRisk.riskScore}/100 your highest risk contract
            </p>
          </div>
          <ArrowUpRight size={18} className="shrink-0 text-ink-soft" aria-hidden />
        </Link>
      )}

      {/* Activity + breakdowns */}
      {contracts.length > 0 && (
        <>
          <div className="card mt-4 p-5">
            <p className="text-xs font-medium text-ink-soft">Analysis activity · last 14 days</p>
            <div className="mt-3">
              <ActivityChart data={activityData} />
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <p className="text-xs font-medium text-ink-soft">Risk distribution</p>
              <div className="mt-3">
                <RiskDistribution
                  counts={{
                    LOW: contracts.filter((c: ContractRow) => c.riskLevel === "LOW").length,
                    MEDIUM: contracts.filter((c: ContractRow) => c.riskLevel === "MEDIUM").length,
                    HIGH: contracts.filter((c: ContractRow) => c.riskLevel === "HIGH").length,
                  }}
                />
              </div>
            </div>
            <div className="card p-5">
              <p className="text-xs font-medium text-ink-soft">Contract types</p>
              <div className="mt-3">
                <TypeBreakdown items={typeItems} />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Search & filters */}
      <div className="mt-8">
        <ContractSearch initialQuery={q ?? ""} initialRisk={risk ?? ""} initialType={type ?? ""} initialSort={sort ?? "newest"} />
      </div>

      {/* Contract list */}
      {contracts.length === 0 ? (
        <div className="card mt-4 flex flex-col items-center gap-3 p-12 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand/10 text-brand">
            <FileText size={26} aria-hidden />
          </span>
          <p className="font-semibold">No contracts yet</p>
          <p className="max-w-sm text-sm text-ink-soft">
            Paste your first contract and get a risk score, flagged clauses and negotiation tips in about a minute.
          </p>
          <Link href="/dashboard/new" className="btn btn-primary mt-2">Analyze your first contract</Link>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {contracts.map((c: ContractRow) => (
            <li key={c.id}>
              <Link href={`/dashboard/contracts/${c.id}`} className="card card-hover flex items-center gap-4 p-5">
                <span
                  className={`h-10 w-1.5 shrink-0 rounded-full ${c.riskLevel ? RISK_BAR[c.riskLevel] : "bg-ink/10"}`}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{c.title}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-soft">
                    {c.contractType && (
                      <span className="rounded-full bg-ink/5 px-2 py-0.5 font-medium text-ink">
                        {getContractType(c.contractType)?.name ?? c.contractType}
                      </span>
                    )}
                    <span>{relativeDate(c.createdAt)}</span>
                  </p>
                </div>
                {c.riskLevel && <RiskBadge level={c.riskLevel} score={c.riskScore} />}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
