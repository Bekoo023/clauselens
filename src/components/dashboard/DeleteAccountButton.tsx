"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not delete your account.");
      }
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete your account. Please try again.");
      setBusy(false);
    }
  }

  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)} className="btn mt-3 border border-risk-high/40 text-risk-high hover:bg-risk-high/10">
        Delete account
      </button>
    );
  }

  return (
    <div className="mt-3 space-y-3">
      <p className="text-sm font-medium text-risk-high">
        This permanently deletes your account, all contracts, and analyses. This cannot be undone.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleDelete}
          disabled={busy}
          className="btn border border-risk-high bg-risk-high/10 text-risk-high hover:bg-risk-high/20 disabled:opacity-60"
        >
          {busy ? <><Loader2 size={16} className="animate-spin" aria-hidden /> Deleting...</> : "Yes, permanently delete my account"}
        </button>
        <button onClick={() => setConfirming(false)} disabled={busy} className="btn border border-ink/15 hover:bg-ink/5 disabled:opacity-60">
          Cancel
        </button>
      </div>
      {error && <p role="alert" className="text-sm text-risk-high">{error}</p>}
    </div>
  );
}
