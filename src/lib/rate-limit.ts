import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { hasRedisConfig } from "@/lib/env";

// Centralized rate limiting for serverless (Vercel) deployment, backed by
// Upstash Redis so limits are shared across all function instances.
//
// Fail-open policies let requests through (logging a warning) if Redis is
// temporarily unavailable, so an outage never takes down the whole app.
// Fail-closed policies (expensive AI routes) reject instead, since letting
// unlimited traffic through to a paid third-party API is the worse failure
// mode.

export type RateLimitPolicy =
  | "analyze"
  | "extract"
  | "negotiate"
  | "register"
  | "login"
  | "forgotPassword"
  | "resetPassword"
  | "contact"
  | "checkout"
  | "share"
  | "resendVerification"
  | "verifyEmail";

type Window = `${number} ${"ms" | "s" | "m" | "h" | "d"}`;

const POLICIES: Record<RateLimitPolicy, { requests: number; window: Window; failClosed: boolean }> = {
  analyze: { requests: 5, window: "1 m", failClosed: true },
  extract: { requests: 10, window: "1 m", failClosed: true },
  negotiate: { requests: 5, window: "1 m", failClosed: true },
  register: { requests: 5, window: "1 h", failClosed: false },
  login: { requests: 10, window: "1 m", failClosed: false },
  forgotPassword: { requests: 3, window: "1 h", failClosed: false },
  resetPassword: { requests: 10, window: "1 h", failClosed: false },
  contact: { requests: 5, window: "1 h", failClosed: false },
  checkout: { requests: 5, window: "10 m", failClosed: false },
  share: { requests: 30, window: "1 m", failClosed: false },
  resendVerification: { requests: 3, window: "1 h", failClosed: false },
  verifyEmail: { requests: 20, window: "1 h", failClosed: false },
};

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // epoch ms
};

let redisClient: Redis | null | undefined;
function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;
  redisClient = hasRedisConfig() ? Redis.fromEnv() : null;
  return redisClient;
}

const limiters = new Map<RateLimitPolicy, Ratelimit>();
function getLimiter(policy: RateLimitPolicy): Ratelimit | null {
  const existing = limiters.get(policy);
  if (existing) return existing;

  const redis = getRedis();
  if (!redis) return null;

  const cfg = POLICIES[policy];
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(cfg.requests, cfg.window),
    prefix: `clauselens:rl:${policy}`,
    analytics: false,
  });
  limiters.set(policy, limiter);
  return limiter;
}

let warnedNotConfigured = false;

/**
 * Checks whether `identifier` (a userId or IP-derived key) is within the
 * limit for `policy`. Never throws: on Redis failure it applies the
 * policy's fail-open/fail-closed default instead.
 *
 * Two distinct "no limiter" situations are handled differently:
 *  - Redis was never configured (no env vars set): this is a deployment
 *    state, not an outage of something that's supposed to be there. Failing
 *    closed here would mean the AI features are 100% unusable until Upstash
 *    is set up, which is a worse outcome than temporarily having no rate
 *    limiting. So this always fails open, with a one-time warning so it's
 *    impossible to miss in the logs.
 *  - Redis IS configured but a call throws (network blip, outage): this
 *    follows the policy's fail-open/fail-closed default, so a real Redis
 *    outage still fails closed for the costly AI routes as intended.
 */
export async function checkRateLimit(policy: RateLimitPolicy, identifier: string): Promise<RateLimitResult> {
  const cfg = POLICIES[policy];

  if (!hasRedisConfig()) {
    if (!warnedNotConfigured) {
      warnedNotConfigured = true;
      console.warn(
        "[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN are not set rate limiting is disabled (failing open) until Upstash is configured. See .env.example."
      );
    }
    return { success: true, limit: cfg.requests, remaining: cfg.requests, reset: Date.now() };
  }

  const limiter = getLimiter(policy);
  if (!limiter) {
    // Configured but the client couldn't be built: treat like a runtime failure.
    if (cfg.failClosed) {
      return { success: false, limit: cfg.requests, remaining: 0, reset: Date.now() + 60_000 };
    }
    return { success: true, limit: cfg.requests, remaining: cfg.requests, reset: Date.now() };
  }

  try {
    const result = await limiter.limit(identifier);
    return { success: result.success, limit: result.limit, remaining: result.remaining, reset: result.reset };
  } catch (err) {
    console.error(`[rate-limit] "${policy}" check failed, applying fail-${cfg.failClosed ? "closed" : "open"} default:`, err instanceof Error ? err.message : "unknown error");
    if (cfg.failClosed) {
      return { success: false, limit: cfg.requests, remaining: 0, reset: Date.now() + 60_000 };
    }
    return { success: true, limit: cfg.requests, remaining: cfg.requests, reset: Date.now() };
  }
}

type HeaderSource = { get(name: string): string | null };

/**
 * Extracts a best-effort client IP from request headers. Only trusts the
 * first hop of x-forwarded-for (the entry the edge/proxy itself appended),
 * since every earlier hop is client-supplied and trivially spoofable.
 * Accepts anything header-like: `req.headers` from a Route Handler, or the
 * `next/headers` `headers()` result inside a Server Component.
 */
export function getClientIp(headerSource: HeaderSource): string {
  const xff = headerSource.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = headerSource.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

/** Builds a 429 JSON response with a Retry-After header. */
export function rateLimitResponse(result: RateLimitResult, message = "Too many requests. Please try again later."): NextResponse {
  const retryAfterSeconds = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
  return NextResponse.json(
    { error: message, code: "RATE_LIMITED" },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
  );
}
