import { z } from "zod";

// Central, server-only environment validation. Import only from server code
// (route handlers, server components, lib/*): never from a "use client" file.
// Validation is lazy (first access) rather than at module load so that
// `next build`'s static page-data collection doesn't fail in environments
// that intentionally build without full secrets (e.g. CI, preview builds).
// Real request handling always goes through `getServerEnv()` and will throw
// a clear error before touching the database, Stripe, or Anthropic.

const isProd = process.env.NODE_ENV === "production";

const serverEnvSchema = z
  .object({
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
    AUTH_URL: z.string().url("AUTH_URL must be a valid URL").optional(),
    AUTH_GOOGLE_ID: z.string().optional(),
    AUTH_GOOGLE_SECRET: z.string().optional(),
    ANTHROPIC_API_KEY: z.string().min(1, "ANTHROPIC_API_KEY is required"),
    STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
    STRIPE_WEBHOOK_SECRET: z.string().min(1, "STRIPE_WEBHOOK_SECRET is required"),
    STRIPE_PRICE_PRO_MONTHLY: z.string().min(1, "STRIPE_PRICE_PRO_MONTHLY is required"),
    STRIPE_PRICE_PRO_YEARLY: z.string().min(1, "STRIPE_PRICE_PRO_YEARLY is required"),
    STRIPE_PRICE_BUSINESS_MONTHLY: z.string().min(1, "STRIPE_PRICE_BUSINESS_MONTHLY is required"),
    STRIPE_PRICE_BUSINESS_YEARLY: z.string().min(1, "STRIPE_PRICE_BUSINESS_YEARLY is required"),
    RESEND_API_KEY: z.string().optional(),
    EMAIL_FROM: z.string().optional(),
    NEXT_PUBLIC_APP_URL: z
      .string()
      .url("NEXT_PUBLIC_APP_URL must be a valid URL")
      .refine((url) => !isProd || !/localhost|127\.0\.0\.1/.test(url), {
        message: "NEXT_PUBLIC_APP_URL must not point to localhost in production",
      }),
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  })
  .passthrough();

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | null = null;

/** Validates and returns server-only environment variables. Throws with a clear, actionable message if anything required is missing or malformed. */
export function getServerEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Invalid or missing environment variables:\n${issues}`);
  }
  cached = parsed.data;
  return cached;
}

/** True when Upstash Redis is configured for centralized rate limiting. */
export function hasRedisConfig(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}
