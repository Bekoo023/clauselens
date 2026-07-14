"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Loader2, Sparkles } from "lucide-react";
import { CONTRACT_TYPES, PERSPECTIVES } from "@/lib/contract-types";

// New analysis: paste text or upload a PDF/DOCX/TXT, add optional context,
// then redirect to the stored report at /dashboard/contracts/[id].
export default function NewAnalysisPage() {
  const router = useRouter();
  const [busy, setBusy] = useState<"idle" | "extracting" | "analyzing">("idle");
  const [error, setError] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setBusy("extracting");
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/extract", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not read the file.");
      setBusy("idle");
      return;
    }
    setBody(data.text);
    setFileName(file.name);
    setBusy("idle");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy("analyzing");
    setError(null);
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        body,
        contractType: form.get("contractType") || undefined,
        perspective: form.get("perspective") || undefined,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Analysis failed. Please try again.");
      setBusy("idle");
      return;
    }
    router.push(`/dashboard/contracts/${data.contractId}`);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="h-display text-2xl">New analysis</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Upload a contract or paste the text. Analysis takes about a minute.
      </p>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-5 p-7">
        <div>
          <label htmlFor="title" className="text-sm font-medium">Contract name</label>
          <input
            id="title"
            name="title"
            required
            placeholder="e.g. Acme Corp Services Agreement"
            className="input mt-1.5"
          />
        </div>

        {/* Context sharpens the analysis */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contractType" className="text-sm font-medium">Contract type <span className="font-normal text-ink-soft">(optional)</span></label>
            <select id="contractType" name="contractType" className="input mt-1.5">
              <option value="">Auto-detect</option>
              {CONTRACT_TYPES.map((t) => (
                <option key={t.slug} value={t.slug}>{t.longName}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="perspective" className="text-sm font-medium">Your side <span className="font-normal text-ink-soft">(optional)</span></label>
            <select id="perspective" name="perspective" className="input mt-1.5">
              <option value="">Not specified</option>
              {PERSPECTIVES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* File upload */}
        <div>
          <input
            ref={fileInput}
            type="file"
            accept=".pdf,.docx,.txt,.md"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={busy !== "idle"}
            className="btn w-full justify-center border border-dashed border-ink/25 py-4 hover:bg-ink/5 disabled:opacity-60"
          >
            {busy === "extracting" ? (
              <><Loader2 size={16} className="animate-spin" aria-hidden /> Reading file…</>
            ) : (
              <><FileUp size={16} aria-hidden /> {fileName ? `Replace ${fileName}` : "Upload PDF, DOCX, or TXT"}</>
            )}
          </button>
          {fileName && <p className="mt-2 text-xs text-risk-low">✓ Extracted text from {fileName} review below before analyzing.</p>}
        </div>

        <div>
          <label htmlFor="body" className="text-sm font-medium">Contract text</label>
          <textarea
            id="body"
            name="body"
            required
            minLength={100}
            rows={12}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="…or paste the full contract text here"
            className="input mt-1.5 py-3 font-mono text-xs leading-relaxed"
          />
          {body.length > 0 && <p className="mt-1 text-right text-xs text-ink-soft">{body.length.toLocaleString()} characters</p>}
        </div>

        {error && <p role="alert" className="text-sm text-risk-high">{error}</p>}
        <button type="submit" disabled={busy !== "idle"} className="btn btn-primary disabled:opacity-60">
          {busy === "analyzing" ? (
            <><Loader2 size={16} className="animate-spin" aria-hidden /> Analyzing about a minute…</>
          ) : (
            <><Sparkles size={16} aria-hidden /> Analyze contract</>
          )}
        </button>
      </form>
    </div>
  );
}
