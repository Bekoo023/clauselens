import { describe, it, expect, vi, beforeEach } from "vitest";

type FakeUser = { id: string; plan: "FREE" | "PRO" | "BUSINESS"; analysesThisMonth: number; usageResetAt: Date };

const users = new Map<string, FakeUser>();

// A single global lock around every fake transaction. This stands in for
// Postgres's row-level lock from `SELECT ... FOR UPDATE`: in production that
// lock is scoped to one user's row, but for this test a global lock proves
// the same property: reserveAnalysisSlot never lets two concurrent callers
// both read-then-write past the same last unit of quota, as long as the
// read-check-write all happens inside one serialized transaction (which is
// exactly what reserveAnalysisSlot does).
let queue: Promise<unknown> = Promise.resolve();
function serialized<T>(fn: () => Promise<T>): Promise<T> {
  const result = queue.then(fn, fn);
  queue = result.catch(() => undefined);
  return result;
}

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: (fn: (tx: unknown) => Promise<unknown>) => serialized(() => fn(fakeTx)),
    user: {
      updateMany: async ({ where, data }: { where: { id: string; analysesThisMonth?: { gt: number } }; data: { analysesThisMonth: { decrement: number } } }) => {
        const user = users.get(where.id);
        if (!user) return { count: 0 };
        if (where.analysesThisMonth && !(user.analysesThisMonth > where.analysesThisMonth.gt)) {
          return { count: 0 };
        }
        user.analysesThisMonth = Math.max(0, user.analysesThisMonth - data.analysesThisMonth.decrement);
        return { count: 1 };
      },
    },
  },
}));

const fakeTx = {
  $queryRaw: async (_strings: TemplateStringsArray, userId: string) => {
    const user = users.get(userId);
    return user ? [{ plan: user.plan, analysesThisMonth: user.analysesThisMonth, usageResetAt: user.usageResetAt }] : [];
  },
  user: {
    update: async ({ where, data }: { where: { id: string }; data: { analysesThisMonth: number; usageResetAt: Date } }) => {
      const user = users.get(where.id);
      if (!user) throw new Error("not found");
      user.analysesThisMonth = data.analysesThisMonth;
      user.usageResetAt = data.usageResetAt;
    },
  },
};

const { reserveAnalysisSlot, releaseAnalysisSlot } = await import("@/lib/quota");

function seedUser(id: string, plan: FakeUser["plan"], analysesThisMonth: number) {
  users.set(id, { id, plan, analysesThisMonth, usageResetAt: new Date() });
}

beforeEach(() => {
  users.clear();
});

describe("reserveAnalysisSlot", () => {
  it("two concurrent requests from a free user (1 remaining) only let one succeed", async () => {
    seedUser("free-user", "FREE", 0); // 0 used, limit 1

    const [a, b] = await Promise.all([reserveAnalysisSlot("free-user"), reserveAnalysisSlot("free-user")]);
    const results = [a, b];

    const succeeded = results.filter((r) => r.ok);
    const failed = results.filter((r) => !r.ok);
    expect(succeeded).toHaveLength(1);
    expect(failed).toHaveLength(1);
    expect(failed[0]).toMatchObject({ ok: false, reason: "LIMIT_REACHED" });
    expect(users.get("free-user")?.analysesThisMonth).toBe(1);
  });

  it("rejects a user with no remaining credit", async () => {
    seedUser("maxed-out", "FREE", 1); // limit is 1, already used 1

    const result = await reserveAnalysisSlot("maxed-out");
    expect(result).toMatchObject({ ok: false, reason: "LIMIT_REACHED" });
    expect(users.get("maxed-out")?.analysesThisMonth).toBe(1);
  });

  it("a successful reservation increments usage by exactly one", async () => {
    seedUser("pro-user", "PRO", 5);

    const result = await reserveAnalysisSlot("pro-user");
    expect(result.ok).toBe(true);
    expect(users.get("pro-user")?.analysesThisMonth).toBe(6);
  });

  it("Business (unlimited) users can always reserve a slot", async () => {
    seedUser("biz-user", "BUSINESS", 10_000);

    const result = await reserveAnalysisSlot("biz-user");
    expect(result.ok).toBe(true);
  });
});

describe("releaseAnalysisSlot", () => {
  it("decrements the counter after a failed analysis", async () => {
    seedUser("release-me", "PRO", 3);
    await releaseAnalysisSlot("release-me");
    expect(users.get("release-me")?.analysesThisMonth).toBe(2);
  });

  it("never pushes the counter below zero", async () => {
    seedUser("already-zero", "PRO", 0);
    await releaseAnalysisSlot("already-zero");
    expect(users.get("already-zero")?.analysesThisMonth).toBe(0);
  });
});
