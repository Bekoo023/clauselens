import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Session } from "next-auth";

const authMock = vi.hoisted(() => vi.fn());
vi.mock("@/lib/auth", () => ({ auth: authMock }));

type ContractRow = { id: string; userId: string };
let contracts: ContractRow[];

vi.mock("@/lib/prisma", () => ({
  prisma: {
    contract: {
      deleteMany: async ({ where }: { where: { id: string; userId: string } }) => {
        const before = contracts.length;
        contracts = contracts.filter((c) => !(c.id === where.id && c.userId === where.userId));
        return { count: before - contracts.length };
      },
    },
  },
}));

const { DELETE } = await import("@/app/api/contracts/[id]/route");

function mockSession(userId: string | null) {
  const session = userId ? ({ user: { id: userId } } as Session) : null;
  authMock.mockResolvedValue(session);
}

beforeEach(() => {
  contracts = [{ id: "contract-1", userId: "owner-1" }];
});

describe("DELETE /api/contracts/[id]: authorization", () => {
  it("lets the owner delete their own contract", async () => {
    mockSession("owner-1");
    const res = await DELETE(new Request("http://localhost"), { params: Promise.resolve({ id: "contract-1" }) });
    expect(res.status).toBe(200);
    expect(contracts).toHaveLength(0);
  });

  it("refuses to delete another user's contract (404, not leaked as 403)", async () => {
    mockSession("attacker");
    const res = await DELETE(new Request("http://localhost"), { params: Promise.resolve({ id: "contract-1" }) });
    expect(res.status).toBe(404);
    expect(contracts).toHaveLength(1); // untouched
  });

  it("rejects unauthenticated requests", async () => {
    mockSession(null);
    const res = await DELETE(new Request("http://localhost"), { params: Promise.resolve({ id: "contract-1" }) });
    expect(res.status).toBe(401);
    expect(contracts).toHaveLength(1);
  });
});
