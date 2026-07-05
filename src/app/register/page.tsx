"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AuthShell } from "@/components/ui/AuthShell";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    router.push("/dashboard");
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle={<>Already have one? <Link href="/login" className="font-semibold text-brand hover:underline">Log in</Link></>}
    >
      <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="btn w-full border border-ink/15 hover:bg-ink/5">
        Continue with Google
      </button>
      <div className="my-6 flex items-center gap-3 text-xs text-ink-soft">
        <span className="h-px flex-1 bg-ink/10" /> or <span className="h-px flex-1 bg-ink/10" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <input id="name" name="name" autoComplete="name" required className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm" />
          <p className="mt-1 text-xs text-ink-soft">At least 8 characters.</p>
        </div>
        {error && <p role="alert" className="text-sm text-risk-high">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-60">
          {loading ? "Creating account…" : "Start analyzing free"}
        </button>
        <p className="text-xs text-ink-soft">
          By signing up you agree to our <Link href="/terms" className="underline">terms</Link> and <Link href="/privacy" className="underline">privacy policy</Link>.
        </p>
      </form>
    </AuthShell>
  );
}
