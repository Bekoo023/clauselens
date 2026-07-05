"use client";

import { useState } from "react";
import { Loader2, Plus, ShieldCheck, Trash2 } from "lucide-react";

type Rule = { id: string; rule: string };

// Business-plan settings: manage the user's own "red lines". Every future
// analysis checks the contract against each rule here (see lib/analyze.ts).
export function PlaybookRules({ initialRules }: { initialRules: Rule[] }) {
  const [rules, setRules] = useState(initialRules);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function addRule(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/playbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rule: input.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not add rule.");
      setRules((r) => [...r, data.rule]);
      setInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add rule.");
    } finally {
      setBusy(false);
    }
  }

  async function removeRule(id: string) {
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/playbook/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setRules((r) => r.filter((rule) => rule.id !== id));
    } catch {
      setError("Could not remove rule.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <form onSubmit={addRule} className="flex flex-wrap gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={300}
          placeholder="e.g. Never accept net-90 payment terms"
          className="input min-w-0 flex-1"
          disabled={rules.length >= 20}
        />
        <button
          type="submit"
          disabled={busy || !input.trim() || rules.length >= 20}
          className="btn btn-primary disabled:opacity-60"
        >
          {busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Plus size={16} aria-hidden />} Add rule
        </button>
      </form>
      {rules.length >= 20 && <p className="mt-2 text-xs text-ink-soft">You&apos;ve reached the 20-rule limit.</p>}
      {error && <p role="alert" className="mt-2 text-sm text-risk-high">{error}</p>}

      {rules.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">
          No rules yet. Add your own red lines and every future analysis will be checked against them.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {rules.map((r) => (
            <li key={r.id} className="flex items-start gap-3 rounded-xl border border-ink/10 p-3">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand" aria-hidden />
              <p className="min-w-0 flex-1 text-sm">{r.rule}</p>
              <button
                onClick={() => removeRule(r.id)}
                disabled={deletingId === r.id}
                aria-label={`Remove rule: ${r.rule}`}
                className="shrink-0 text-ink-soft hover:text-risk-high disabled:opacity-60"
              >
                {deletingId === r.id ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Trash2 size={16} aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
