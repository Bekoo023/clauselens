"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/ui/AuthShell";

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email") }),
    });
    setStatus("sent");
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle={<>Remembered it? <Link href="/login" className="font-semibold text-brand hover:underline">Log in</Link></>}
    >
      {status === "sent" ? (
        <p className="text-sm text-ink-soft">
          If an account exists for that email, we&apos;ve sent a link to reset your password. It expires in 1 hour.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required className="input mt-1.5" />
          </div>
          <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full disabled:opacity-60">
            {status === "sending" ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
