import Link from "next/link";
import { FilePlus2, FileText } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS } from "@/lib/plans";
import type { Plan, RiskLevel } from "@prisma/client";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { RiskDistribution } from "@/components/dashboard/RiskDistribution";
import { ContractSearch } from "@/components/dashboard/ContractSearch";

type ContractRow = {
  id: string;
  title: string;
  createdAt: Date;
  riskLevel: RiskLevel | null;
  riskScore: number | null;
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; risk?: string }>;
}) {
  const session = await auth();
  const { q, risk } = await searchParams;

  const user = await prisma.user.findUnique({ where: { id: session!.user.id } });
  const contracts = await prisma.contract.findMany({
    where: {
      userId: session!.user.id,
      ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
      ...(risk === "LOW" || risk === "MEDIUM" || risk === "HIGH" ? { riskLevel: risk } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const limit = user ? PLAN_LIMITS[user.plan as Plan].analysesPerMonth : 1;
  const used = user?.analysesThisMonth ?? 0;
  const avgScore =
    contracts.length > 0
      ? Math.round(
          contracts.reduce((sum: number, c: ContractRow) => sum + (c.riskScore ?? 0), 0) /
            contracts.length
        )
      : null;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="h-display text-2xl">Contracts</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {user ? `${PLAN_LIMITS[user.plan as Plan].label} plan` : ""} ·{" "}
            {Number.isFinite(limit) ? `${used}/${limit} analyses used this month` : "Unlimited analyses"}
          </p>
        </div>
        <Link href="/dashboard/new" className="btn btn-primary">
          <FilePlus2 size={16} aria-hidden /> New analysis
        </Link>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-xs font-medium text-ink-soft">Contracts analyzed</p>
          <p className="h-display mt-1 text-3xl">{contracts.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-medium text-ink-soft">Average risk score</p>
          <p className="h-display mt-1 text-3xl">{avgScore ?? "—"}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-medium text-ink-soft">Analyses left this month</p>
          <p className="h-display mt-1 text-3xl">
            {Number.isFinite(limit) ? Math.max(0, limit - used) : "∞"}
          </p>
        </div>
      </div>

      {/* Risk distribution */}
      {contracts.length > 0 && (
        <div className="card mt-4 p-5">
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
      )}

      {/* Search & filters */}
      <div className="mt-8">
        <ContractSearch initialQuery={q ?? ""} initialRisk={risk ?? ""} />
      </div>

      {/* Contract list */}
      {contracts.length === 0 ? (
        <div className="card mt-4 flex flex-col items-center gap-3 p-12 text-center">
          <FileText size={32} className="text-ink-soft" aria-hidden />
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
              <Link href={`/dashboard/contracts/${c.id}`} className="card card-hover flex flex-wrap items-center justify-between gap-3 p-5">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{c.title}</p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    {c.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
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
