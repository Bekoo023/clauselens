import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS } from "@/lib/plans";
import type { Plan } from "@prisma/client";
import { UpgradeButtons } from "@/components/dashboard/UpgradeButtons";
import { ManageBillingButton } from "@/components/dashboard/ManageBillingButton";
import { PlaybookRules } from "@/components/dashboard/PlaybookRules";
import { DeleteAccountButton } from "@/components/dashboard/DeleteAccountButton";

export default async function SettingsPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { id: session!.user.id } });
  if (!user) return null;

  const playbookRules =
    user.plan === "BUSINESS"
      ? await prisma.playbookRule.findMany({ where: { userId: user.id }, orderBy: { createdAt: "asc" } })
      : [];

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="h-display text-2xl">Settings</h1>

      <section className="card mt-6 p-7">
        <h2 className="font-semibold">Account</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">Name</dt>
            <dd className="font-medium">{user.name ?? "-"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">Email</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
        </dl>
      </section>

      <section className="card mt-4 p-7">
        <h2 className="font-semibold">Plan & billing</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Current plan: <span className="font-semibold text-ink">{PLAN_LIMITS[user.plan as Plan].label}</span>
          {user.planRenewsAt && (
            <> · renews {user.planRenewsAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</>
          )}
        </p>
        {user.plan === "FREE" ? <UpgradeButtons /> : <ManageBillingButton />}
      </section>

      <section className="card mt-4 p-7">
        <h2 className="flex items-center gap-2 font-semibold">
          <ShieldCheck size={18} className="text-brand" aria-hidden /> Playbook
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          Your own red lines. Every future analysis is checked against each rule you save here.
        </p>
        {user.plan === "BUSINESS" ? (
          <div className="mt-4">
            <PlaybookRules initialRules={playbookRules} />
          </div>
        ) : (
          <div className="card mt-4 border-brand/30 bg-brand/5 p-5">
            <p className="text-sm font-semibold">Custom playbooks are a Business feature</p>
            <p className="mt-1 text-sm text-ink-soft">
              Set rules like &quot;never accept net-90 payment terms&quot; and every contract gets checked against them automatically.
            </p>
            <Link href="/pricing" className="btn btn-primary mt-3">Upgrade to Business</Link>
          </div>
        )}
      </section>

      <section className="card mt-4 border-risk-high/20 p-7">
        <h2 className="font-semibold">Danger zone</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Deleting your account permanently removes all contracts and analyses. Need help instead? Contact{" "}
          <Link href="/contact" className="font-semibold text-brand hover:underline">support</Link>.
        </p>
        <DeleteAccountButton />
      </section>
    </div>
  );
}
