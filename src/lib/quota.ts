import type { Plan } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS } from "@/lib/plans";

export type QuotaReservation =
  | { ok: true; used: number; limit: number }
  | { ok: false; reason: "LIMIT_REACHED"; limit: number };

/**
 * Atomically reserves one analysis slot for `userId`, rolling the monthly
 * counter over if a new calendar month has started since `usageResetAt`.
 *
 * `SELECT ... FOR UPDATE` takes a row lock on this user inside the
 * transaction, so a second concurrent request for the same user blocks
 * until the first commits — two simultaneous requests can never both claim
 * the last unit of a free user's quota.
 */
export async function reserveAnalysisSlot(userId: string): Promise<QuotaReservation> {
  return prisma.$transaction(async (tx) => {
    const rows = await tx.$queryRaw<{ plan: Plan; analysesThisMonth: number; usageResetAt: Date }[]>`
      SELECT "plan", "analysesThisMonth", "usageResetAt" FROM "User" WHERE "id" = ${userId} FOR UPDATE
    `;
    const row = rows[0];
    if (!row) throw new Error("User not found during quota reservation.");

    const now = new Date();
    const resetNeeded =
      row.usageResetAt.getUTCMonth() !== now.getUTCMonth() || row.usageResetAt.getUTCFullYear() !== now.getUTCFullYear();
    const used = resetNeeded ? 0 : row.analysesThisMonth;
    const limit = PLAN_LIMITS[row.plan].analysesPerMonth;

    if (Number.isFinite(limit) && used >= limit) {
      return { ok: false, reason: "LIMIT_REACHED", limit };
    }

    await tx.user.update({
      where: { id: userId },
      data: { analysesThisMonth: used + 1, usageResetAt: now },
    });
    return { ok: true, used: used + 1, limit };
  });
}

/**
 * Releases a previously reserved slot after the analysis failed before it
 * could be saved. The `gt: 0` guard means this can never push the counter
 * negative, even if called more than once.
 */
export async function releaseAnalysisSlot(userId: string): Promise<void> {
  await prisma.user.updateMany({
    where: { id: userId, analysesThisMonth: { gt: 0 } },
    data: { analysesThisMonth: { decrement: 1 } },
  });
}
