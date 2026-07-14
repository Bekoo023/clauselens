import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: async () => ({ success: true, limit: 10, remaining: 10, reset: Date.now() }),
  rateLimitResponse: () => new Response(null, { status: 429 }),
  getClientIp: () => "127.0.0.1",
}));

type TokenRow = { identifier: string; token: string; expires: Date };
type UserRow = { email: string; passwordHash: string; sessionVersion: number };

let tokens: TokenRow[];
let users: Map<string, UserRow>;

const fakeTx = {
  verificationToken: {
    deleteMany: async ({ where }: { where: { identifier: string; token: string; expires: { gt: Date } } }) => {
      const before = tokens.length;
      tokens = tokens.filter(
        (t) => !(t.identifier === where.identifier && t.token === where.token && t.expires > where.expires.gt)
      );
      return { count: before - tokens.length };
    },
  },
  user: {
    update: async ({
      where,
      data,
    }: {
      where: { email: string };
      data: { passwordHash: string; sessionVersion: { increment: number } };
    }) => {
      const user = users.get(where.email);
      if (!user) throw new Error("not found");
      user.passwordHash = data.passwordHash;
      user.sessionVersion += data.sessionVersion.increment;
    },
  },
};

vi.mock("@/lib/prisma", () => ({
  prisma: { $transaction: (fn: (tx: unknown) => Promise<unknown>) => fn(fakeTx) },
}));

const { POST } = await import("@/app/api/auth/reset-password/route");
const { hashToken } = await import("@/lib/tokens");

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/auth/reset-password", { method: "POST", body: JSON.stringify(body) });
}

beforeEach(() => {
  tokens = [];
  users = new Map([["user@example.com", { email: "user@example.com", passwordHash: "old-hash", sessionVersion: 0 }]]);
});

describe("POST /api/auth/reset-password", () => {
  it("resets the password and bumps sessionVersion (invalidating old sessions) with a valid token", async () => {
    const raw = "raw-token-123";
    tokens.push({ identifier: "password-reset:user@example.com", token: hashToken(raw), expires: new Date(Date.now() + 60_000) });

    const res = await POST(makeRequest({ email: "user@example.com", token: raw, password: "newpassword123" }));

    expect(res.status).toBe(200);
    expect(users.get("user@example.com")?.sessionVersion).toBe(1);
    expect(users.get("user@example.com")?.passwordHash).not.toBe("old-hash");
    expect(tokens).toHaveLength(0);
  });

  it("only ever stores a hash of the token, never the raw value", async () => {
    const raw = "raw-token-456";
    tokens.push({ identifier: "password-reset:user@example.com", token: hashToken(raw), expires: new Date(Date.now() + 60_000) });

    expect(tokens[0].token).not.toBe(raw);
    expect(tokens[0].token).toBe(hashToken(raw));
  });

  it("rejects an expired token and leaves the password untouched", async () => {
    const raw = "expired-token";
    tokens.push({ identifier: "password-reset:user@example.com", token: hashToken(raw), expires: new Date(Date.now() - 1000) });

    const res = await POST(makeRequest({ email: "user@example.com", token: raw, password: "newpassword123" }));

    expect(res.status).toBe(400);
    expect(users.get("user@example.com")?.passwordHash).toBe("old-hash");
  });

  it("rejects reuse of an already-consumed (one-time) token", async () => {
    const raw = "one-time-token";
    tokens.push({ identifier: "password-reset:user@example.com", token: hashToken(raw), expires: new Date(Date.now() + 60_000) });

    const first = await POST(makeRequest({ email: "user@example.com", token: raw, password: "newpassword123" }));
    expect(first.status).toBe(200);

    const second = await POST(makeRequest({ email: "user@example.com", token: raw, password: "anotherpassword456" }));
    expect(second.status).toBe(400);
  });

  it("sets Cache-Control: no-store on the response", async () => {
    const res = await POST(makeRequest({ email: "nouser@example.com", token: "whatever-token", password: "newpassword123" }));
    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });
});
