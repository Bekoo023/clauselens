import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileWarning } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analysisSchema } from "@/lib/analyze";
import { getContractType } from "@/lib/contract-types";
import { ReportView } from "@/components/dashboard/ReportView";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { ContractActions } from "@/components/dashboard/ContractActions";

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;

  const [contract, user] = await Promise.all([
    prisma.contract.findFirst({ where: { id, userId: session!.user.id } }),
    prisma.user.findUnique({ where: { id: session!.user.id } }),
  ]);
  if (!contract) notFound();

  const parsed = contract.analysis ? analysisSchema.safeParse(contract.analysis) : null;
  const typeInfo = contract.contractType ? getContractType(contract.contractType) : null;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard" className="print-hidden inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft size={15} aria-hidden /> All contracts
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="h-display truncate text-2xl">{contract.title}</h1>
          <p className="mt-1 text-xs text-ink-soft">
            Analyzed {contract.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            {typeInfo ? ` · ${typeInfo.longName}` : ""}
          </p>
        </div>
        {contract.riskLevel && <RiskBadge level={contract.riskLevel} score={contract.riskScore} />}
      </div>

      {parsed?.success ? (
        <>
          <ContractActions
            contractId={contract.id}
            initialShareToken={contract.shareToken}
            initialEmail={contract.negotiationEmail}
            isPro={user?.plan !== "FREE"}
          />
          <ReportView analysis={parsed.data} />
        </>
      ) : (
        <div className="card mt-6 flex flex-col items-center gap-3 p-12 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-risk-medium/10 text-risk-medium">
            <FileWarning size={26} aria-hidden />
          </span>
          <p className="text-sm text-ink-soft">No analysis is stored for this contract.</p>
          <Link href="/dashboard/new" className="btn btn-primary mt-2">Run a new analysis</Link>
        </div>
      )}
    </div>
  );
}
