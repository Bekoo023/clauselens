import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  hasRedisConfig: () => false,
  getServerEnv: () => ({}),
}));

const { checkRateLimit, rateLimitResponse, getClientIp } = await import("@/lib/rate-limit");

describe("checkRateLimit when Redis was never configured", () => {
  // Not configured is a deployment/setup state, not an outage: every policy
  // must fail OPEN here (including the AI routes), otherwise the app's core
  // feature is 100% unusable until someone sets up Upstash.
  it("fails open for the expensive analyze policy", async () => {
    const result = await checkRateLimit("analyze", "user-1");
    expect(result.success).toBe(true);
  });

  it("fails open for the extract policy", async () => {
    const result = await checkRateLimit("extract", "user-1");
    expect(result.success).toBe(true);
  });

  it("fails open for the negotiate policy", async () => {
    const result = await checkRateLimit("negotiate", "user-1");
    expect(result.success).toBe(true);
  });

  it("fails open for the registration policy", async () => {
    const result = await checkRateLimit("register", "1.2.3.4");
    expect(result.success).toBe(true);
  });

  it("fails open for the contact form policy", async () => {
    const result = await checkRateLimit("contact", "1.2.3.4");
    expect(result.success).toBe(true);
  });
});

describe("rateLimitResponse", () => {
  it("returns 429 with a Retry-After header", async () => {
    const res = rateLimitResponse({ success: false, limit: 5, remaining: 0, reset: Date.now() + 30_000 });
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBeTruthy();
    const body = await res.json();
    expect(body.code).toBe("RATE_LIMITED");
  });
});

describe("getClientIp", () => {
  it("uses only the first hop of x-forwarded-for", () => {
    const headers = new Headers({ "x-forwarded-for": "203.0.113.5, 70.41.3.18, 150.172.238.178" });
    expect(getClientIp(headers)).toBe("203.0.113.5");
  });

  it("falls back to x-real-ip", () => {
    const headers = new Headers({ "x-real-ip": "203.0.113.9" });
    expect(getClientIp(headers)).toBe("203.0.113.9");
  });

  it("falls back to 'unknown' when nothing is present", () => {
    expect(getClientIp(new Headers())).toBe("unknown");
  });
});
