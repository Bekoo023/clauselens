// Runs once when the server starts (both `next dev` and `next start`), before
// any request is handled. Fails fast with a clear error if critical
// configuration is missing, instead of letting a request fail deep inside
// Stripe/Anthropic/DB code with a confusing stack trace.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { getServerEnv } = await import("@/lib/env");
  getServerEnv();
}
