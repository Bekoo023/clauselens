"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AuthShell } from "@/components/ui/AuthShell";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) setError("Invalid email or password.");
    else router.push("/dashboard");
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle={<>New here? <Link href="/register" className="font-semibold text-brand hover:underline">Create a free account</Link></>}
    >
      <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="btn w-full border border-ink/15 hover:bg-ink/5">
        Continue with Google
      </button>
      <div className="my-6 flex items-center gap-3 text-xs text-ink-soft">
        <span className="h-px flex-1 bg-ink/10" /> or <span className="h-px flex-1 bg-ink/10" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm" />
        </div>
        {error && <p role="alert" className="text-sm text-risk-high">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-60">
          {loading ? "Signing in…" : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}
