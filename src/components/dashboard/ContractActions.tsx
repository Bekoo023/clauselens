"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, Link2, Link2Off, Loader2, Mail, Printer, Sparkles } from "lucide-react";

// Action bar on the contract detail page: share toggle, negotiation email, print/export.
export function ContractActions({
  contractId,
  initialShareToken,
  initialEmail,
  isPro,
}: {
  contractId: string;
  initialShareToken: string | null;
  initialEmail: string | null;
  isPro: boolean;
}) {
  const [shareUrl, setShareUrl] = useState<string | null>(
    initialShareToken ? `${typeof window !== "undefined" ? window.location.origin : ""}/share/${initialShareToken}` : null
  );
  const [shareBusy, setShareBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const [email, setEmail] = useState<string | null>(initialEmail);
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgradeNeeded, setUpgradeNeeded] = useState(false);

  async function toggleShare() {
    setShareBusy(true);
    setError(null);
    try {
      if (shareUrl) {
        const res = await fetch(`/api/contracts/${contractId}/share`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        setShareUrl(null);
      } else {
        const res = await fetch(`/api/contracts/${contractId}/share`, { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setShareUrl(`${window.location.origin}/share/${data.shareToken}`);
      }
    } catch {
      setError("Could not update the share link. Please try again.");
    } finally {
      setShareBusy(false);
    }
  }

  async function copyShare() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function generateEmail() {
    setEmailBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/contracts/${contractId}/negotiate`, { method: "POST" });
      const data = await res.json();
      if (res.status === 402) {
        setUpgradeNeeded(true);
        return;
      }
      if (!res.ok) throw new Error(data.error);
      setEmail(data.email);
    } catch {
      setError("Could not draft the email. Please try again.");
    } finally {
      setEmailBusy(false);
    }
  }

  async function copyEmail() {
    if (!email) return;
    await navigator.clipboard.writeText(email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  }

  return (
    <div className="print-hidden">
      {/* Action buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={toggleShare} disabled={shareBusy} className="btn border border-ink/15 hover:bg-ink/5 disabled:opacity-60">
          {shareBusy ? (
            <Loader2 size={16} className="animate-spin" aria-hidden />
          ) : shareUrl ? (
            <Link2Off size={16} aria-hidden />
          ) : (
            <Link2 size={16} aria-hidden />
          )}
          {shareUrl ? "Disable share link" : "Create share link"}
        </button>

        {!email && (
          <button onClick={generateEmail} disabled={emailBusy} className="btn btn-primary disabled:opacity-60">
            {emailBusy ? (
              <><Loader2 size={16} className="animate-spin" aria-hidden /> Drafting…</>
            ) : (
              <><Mail size={16} aria-hidden /> Draft negotiation email{!isPro && <Sparkles size={13} aria-hidden className="opacity-70" />}</>
            )}
          </button>
        )}

        <button onClick={() => window.print()} className="btn border border-ink/15 hover:bg-ink/5">
          <Printer size={16} aria-hidden /> Export PDF
        </button>
      </div>

      {error && <p role="alert" className="mt-3 text-sm text-risk-high">{error}</p>}

      {/* Share URL bar */}
      {shareUrl && (
        <div className="card mt-4 flex flex-wrap items-center gap-3 p-4">
          <p className="min-w-0 flex-1 truncate font-mono text-xs text-ink-soft">{shareUrl}</p>
          <button onClick={copyShare} className="btn border border-ink/15 px-3 py-1.5 text-xs hover:bg-ink/5">
            {copied ? <><Check size={14} aria-hidden /> Copied</> : <><Copy size={14} aria-hidden /> Copy link</>}
          </button>
        </div>
      )}

      {/* Upgrade prompt */}
      {upgradeNeeded && (
        <div className="card mt-4 border-brand/30 bg-brand/5 p-5">
          <p className="text-sm font-semibold">Negotiation emails are a Pro feature</p>
          <p className="mt-1 text-sm text-ink-soft">
            Get a ready-to-send email that requests concrete changes to the riskiest clauses — drafted from this exact analysis.
          </p>
          <Link href="/dashboard/settings" className="btn btn-primary mt-3">Upgrade to Pro</Link>
        </div>
      )}

      {/* Negotiation email */}
      {email && (
        <div className="card mt-6 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Mail size={18} className="text-brand" aria-hidden /> Negotiation email
            </h2>
            <button onClick={copyEmail} className="btn border border-ink/15 px-3 py-1.5 text-xs hover:bg-ink/5">
              {emailCopied ? <><Check size={14} aria-hidden /> Copied</> : <><Copy size={14} aria-hidden /> Copy email</>}
            </button>
          </div>
          <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-ink/5 p-5 font-sans text-sm leading-relaxed text-ink">{email}</pre>
          <p className="mt-3 text-xs text-ink-soft">Review and personalize before sending — you know the relationship best.</p>
        </div>
      )}
    </div>
  );
}
