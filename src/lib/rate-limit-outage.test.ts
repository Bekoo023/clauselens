import { describe, it, expect, vi } from "vitest";

// Simulates Redis being configured but failing at request time (a real
// outage), as opposed to never being configured at all (see rate-limit.test.ts).
vi.mock("@/lib/env", () => ({
  hasRedisConfig: () => true,
  getServerEnv: () => ({}),
}));

vi.mock("@upstash/redis", () => ({
  Redis: { fromEnv: () => ({}) },
}));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class {
    static slidingWindow() {
      return {};
    }
    async limit() {
      throw new Error("simulated Redis outage");
    }
  },
}));

const { checkRateLimit } = await import("@/lib/rate-limit");

describe("checkRateLimit during a real Redis outage (configured but erroring)", () => {
  it("fails closed for the expensive analyze policy never let unlimited traffic hit the paid AI API", async () => {
    const result = await checkRateLimit("analyze", "user-1");
    expect(result.success).toBe(false);
  });

  it("fails closed for the extract policy", async () => {
    const result = await checkRateLimit("extract", "user-1");
    expect(result.success).toBe(false);
  });

  it("still fails open for a non-AI policy like registration an outage shouldn't block signups", async () => {
    const result = await checkRateLimit("register", "1.2.3.4");
    expect(result.success).toBe(true);
  });
});
