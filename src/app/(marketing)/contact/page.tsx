"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    setStatus(res.ok ? "sent" : "error");
  }

  return (
    <section className="container-page grid gap-12 py-16 sm:py-20 lg:grid-cols-2">
      <div>
        <p className="eyebrow">Contact</p>
        <h1 className="h-display mt-4 text-4xl sm:text-5xl">Talk to a human</h1>
        <p className="mt-4 max-w-md text-lg text-ink-soft">
          Questions about plans, Enterprise, partnerships or press — we reply
          within one business day.
        </p>
        <div className="mt-8 space-y-4 text-sm">
          <p className="flex items-center gap-3">
            <Mail size={18} className="text-brand" aria-hidden /> support@clauselens.com
          </p>
          <p className="flex items-center gap-3">
            <MessageSquare size={18} className="text-brand" aria-hidden /> Pro & Business: priority support from your dashboard
          </p>
        </div>
      </div>

      <div className="card p-8">
        {status === "sent" ? (
          <div className="py-10 text-center">
            <p className="text-lg font-semibold">Message sent</p>
            <p className="mt-2 text-sm text-ink-soft">We&apos;ll get back to you within one business day.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <input id="name" name="name" required className="mt-1.5 w-full rounded-xl border border-ink/15 bg-surface px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input id="email" name="email" type="email" required className="mt-1.5 w-full rounded-xl border border-ink/15 bg-surface px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea id="message" name="message" rows={5} required className="mt-1.5 w-full rounded-xl border border-ink/15 bg-surface px-4 py-2.5 text-sm" />
            </div>
            <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full disabled:opacity-60">
              {status === "sending" ? "Sending…" : <>Send message <Send size={16} aria-hidden /></>}
            </button>
            {status === "error" && (
              <p className="text-sm text-risk-high">Something went wrong. Email us at support@clauselens.com instead.</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
