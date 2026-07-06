"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AuthShell } from "@/components/ui/AuthShell";
import { PRICING } from "@/lib/plans";

const PLAN_LABELS = { pro: "Pro", business: "Business" } as const;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ plan: "pro" | "business"; interval: "monthly" | "yearly" } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");
    if (plan === "pro" || plan === "business") {
      const interval = params.get("interval") === "yearly" ? "yearly" : "monthly";
      setSelectedPlan({ plan, interval });
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
    };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Try again.");
      setLoading(false);
      return;
    }

    // Auto sign-in after successful registration
    await signIn("credentials", {
      email: body.email,
      password: body.password,
      redirect: false,
    });

    // If the user arrived from a pricing CTA, send them straight into checkout
    if (selectedPlan) {
      const checkoutRes = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPlan),
      });
      const checkoutData = await checkoutRes.json().catch(() => ({}));
      if (checkoutData.url) {
        window.location.href = checkoutData.url;
        return;
      }
    }

    router.push("/dashboard");
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle={<>Already have one? <Link href="/login" className="font-semibold text-brand hover:underline">Log in</Link></>}
    >
      {selectedPlan && (
        <p className="mb-6 rounded-lg border border-brand/25 bg-brand/5 px-4 py-3 text-sm">
          You selected <strong>{PLAN_LABELS[selectedPlan.plan]}</strong> — €{PRICING[selectedPlan.plan][selectedPlan.interval === "yearly" ? "yearly" : "monthly"]}/month
          {selectedPlan.interval === "yearly" ? ", billed yearly" : ""}. Create your account to continue to checkout.
        </p>
      )}
      <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="btn w-full border border-ink/15 hover:bg-ink/5">
        Continue with Google
      </button>
      <div className="my-6 flex items-center gap-3 text-xs text-ink-soft">
        <span className="h-px flex-1 bg-ink/10" /> or <span className="h-px flex-1 bg-ink/10" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <input id="name" name="name" autoComplete="name" required className="input mt-1.5" />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required className="input mt-1.5" />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className="input mt-1.5" />
          <p className="mt-1 text-xs text-ink-soft">At least 8 characters.</p>
        </div>
        {error && <p role="alert" className="text-sm text-risk-high">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-60">
          {loading ? "Creating account…" : selectedPlan ? "Create account and continue to checkout" : "Start analyzing free"}
        </button>
        <p className="text-xs text-ink-soft">
          By signing up you agree to our <Link href="/terms" className="underline">terms</Link> and <Link href="/privacy" className="underline">privacy policy</Link>.
        </p>
      </form>
    </AuthShell>
  );
}
