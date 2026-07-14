"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/ui/AuthShell";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"checking" | "done" | "error" | "missing">("checking");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const token = search.get("token");
    const email = search.get("email");
    if (!token || !email) {
      setStatus("missing");
      return;
    }

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error ?? "Something went wrong.");
          setStatus("error");
          return;
        }
        setStatus("done");
      })
      .catch(() => {
        setError("Something went wrong. Try again.");
        setStatus("error");
      });
  }, []);

  return (
    <AuthShell
      title="Verify your email"
      subtitle={<>Wrong account? <Link href="/login" className="font-semibold text-brand hover:underline">Log in</Link></>}
    >
      {status === "checking" && <p className="text-sm text-ink-soft">Verifying your email…</p>}
      {status === "done" && (
        <div>
          <p className="text-sm text-ink-soft">Your email is verified. You can now run contract analyses.</p>
          <Link href="/dashboard" className="btn btn-primary mt-5 w-full">Go to dashboard</Link>
        </div>
      )}
      {status === "missing" && (
        <p className="text-sm text-risk-high">
          This verification link is incomplete. Request a new one from{" "}
          <Link href="/dashboard/settings" className="underline">Settings</Link>.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-risk-high">
          {error} You can request a new link from{" "}
          <Link href="/dashboard/settings" className="underline">Settings</Link>.
        </p>
      )}
    </AuthShell>
  );
}
