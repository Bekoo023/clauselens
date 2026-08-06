"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AuthShell } from "@/components/ui/AuthShell";
import { GoogleSignInButton } from "@/components/ui/GoogleSignInButton";

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
      <GoogleSignInButton callbackUrl="/dashboard" />
      <div className="my-6 flex items-center gap-3 text-xs text-ink-soft">
        <span className="h-px flex-1 bg-ink/10" /> or <span className="h-px flex-1 bg-ink/10" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required className="input mt-1.5" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Link href="/forgot-password" className="text-xs font-medium text-brand hover:underline">Forgot password?</Link>
          </div>
          <input id="password" name="password" type="password" autoComplete="current-password" required className="input mt-1.5" />
        </div>
        {error && <p role="alert" className="text-sm text-risk-high">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-60">
          {loading ? "Signing in..." : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}
