import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Session } from "next-auth";

const authMock = vi.hoisted(() => vi.fn());
vi.mock("@/lib/auth", () => ({ auth: authMock }));
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: async () => ({ success: true, limit: 30, remaining: 30, reset: Date.now() }),
  rateLimitResponse: () => new Response(null, { status: 429 }),
}));
vi.mock("@/lib/env", () => ({ getServerEnv: () => ({ NEXT_PUBLIC_APP_URL: "https://clauselens.org" }) }));

type ContractRow = { id: string; userId: string; analysis: unknown; shareToken: string | null };
let contracts: ContractRow[];

vi.mock("@/lib/prisma", () => ({
  prisma: {
    contract: {
      findFirst: async ({ where }: { where: { id: string; userId: string } }) =>
        contracts.find((c) => c.id === where.id && c.userId === where.userId) ?? null,
      findUnique: async ({ where }: { where: { shareToken: string } }) =>
        contracts.find((c) => c.shareToken === where.shareToken) ?? null,
      update: async ({ where, data }: { where: { id: string }; data: Partial<ContractRow> }) => {
        const c = contracts.find((c) => c.id === where.id);
        if (!c) throw new Error("not found");
        Object.assign(c, data);
        return c;
      },
    },
  },
}));

const { prisma } = await import("@/lib/prisma");
const { POST, DELETE } = await import("@/app/api/contracts/[id]/share/route");

function mockSession(userId: string) {
  authMock.mockResolvedValue({ user: { id: userId } } as Session);
}

beforeEach(() => {
  contracts = [{ id: "contract-1", userId: "owner-1", analysis: { riskScore: 10 }, shareToken: null }];
  mockSession("owner-1");
});

describe("share link lifecycle", () => {
  it("creates a share token that resolves to the contract", async () => {
    const res = await POST(new Request("http://localhost"), { params: Promise.resolve({ id: "contract-1" }) });
    expect(res.status).toBe(200);
    const { shareToken } = await res.json();
    expect(shareToken).toBeTruthy();

    const found = await prisma.contract.findUnique({ where: { shareToken } });
    expect(found?.id).toBe("contract-1");
  });

  it("revoking the link makes it unresolvable: a shared link no longer works after being revoked", async () => {
    const created = await POST(new Request("http://localhost"), { params: Promise.resolve({ id: "contract-1" }) });
    const { shareToken } = await created.json();

    const revoked = await DELETE(new Request("http://localhost"), { params: Promise.resolve({ id: "contract-1" }) });
    expect(revoked.status).toBe(200);

    const found = await prisma.contract.findUnique({ where: { shareToken } });
    expect(found).toBeNull();
  });

  it("refuses to create a share link for another user's contract", async () => {
    mockSession("attacker");
    const res = await POST(new Request("http://localhost"), { params: Promise.resolve({ id: "contract-1" }) });
    expect(res.status).toBe(404);
  });

  it("refuses to revoke another user's share link", async () => {
    contracts[0].shareToken = "existing-token";
    mockSession("attacker");
    const res = await DELETE(new Request("http://localhost"), { params: Promise.resolve({ id: "contract-1" }) });
    expect(res.status).toBe(404);
    expect(contracts[0].shareToken).toBe("existing-token"); // untouched
  });
});
