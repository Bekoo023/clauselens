"use client";

import { useState } from "react";
import { MailWarning } from "lucide-react";

export function EmailVerificationBanner({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function resend() {
    setStatus("sending");
    await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => null);
    setStatus("sent");
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-risk-medium/30 bg-risk-medium/10 p-4 text-sm">
      <MailWarning size={18} className="shrink-0 text-risk-medium" aria-hidden />
      <p className="flex-1 font-medium text-ink">
        Verify your email to run contract analyses. Check your inbox for the confirmation link.
      </p>
      <button
        onClick={resend}
        disabled={status !== "idle"}
        className="btn border border-ink/15 px-3 py-1.5 text-xs hover:bg-ink/5 disabled:opacity-60"
      >
        {status === "idle" ? "Resend email" : status === "sending" ? "Sending..." : "Sent check your inbox"}
      </button>
    </div>
  );
}
