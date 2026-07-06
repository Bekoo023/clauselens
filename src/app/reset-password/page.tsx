"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/ui/AuthShell";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [params, setParams] = useState<{ token: string; email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const token = search.get("token");
    const email = search.get("email");
    setParams(token && email ? { token, email } : { token: "", email: "" });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!params?.token || !params?.email) return;
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...params, password: form.get("password") }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Try again.");
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  return (
    <AuthShell
      title="Set a new password"
      subtitle={<>Remembered it? <Link href="/login" className="font-semibold text-brand hover:underline">Log in</Link></>}
    >
      {done ? (
        <p className="text-sm text-ink-soft">Password updated. Redirecting to login…</p>
      ) : params && !params.token ? (
        <p className="text-sm text-risk-high">
          This reset link is invalid. Request a new one from the{" "}
          <Link href="/forgot-password" className="underline">forgot password</Link> page.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="text-sm font-medium">New password</label>
            <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className="input mt-1.5" />
            <p className="mt-1 text-xs text-ink-soft">At least 8 characters.</p>
          </div>
          {error && <p role="alert" className="text-sm text-risk-high">{error}</p>}
          <button type="submit" disabled={loading || !params} className="btn btn-primary w-full disabled:opacity-60">
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
