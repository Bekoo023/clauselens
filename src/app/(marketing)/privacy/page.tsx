import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How ClauseLens collects, uses and protects your data.",
};

export default function PrivacyPage() {
  return (
    <section className="container-page max-w-3xl py-16 sm:py-20">
      <h1 className="h-display text-4xl">Privacy policy</h1>
      <p className="mt-2 text-sm text-ink-soft">Last updated: July 2026 · Template — review with a lawyer before launch.</p>
      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink">
        <div>
          <h2 className="text-lg font-semibold">1. What we collect</h2>
          <p className="mt-2 text-ink-soft">Account data (name, email), billing data (processed by Stripe; we never store card numbers), contracts you upload for analysis, and usage data (pages visited, features used).</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">2. How we use it</h2>
          <p className="mt-2 text-ink-soft">To provide the service (analyzing your contracts), process payments, send transactional email, and improve the product. We do not sell personal data. Contract content is processed via our AI provider under terms that exclude model training on your data.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">3. Storage & security</h2>
          <p className="mt-2 text-ink-soft">Data is encrypted in transit (TLS) and at rest, hosted within the EU/EEA where possible. You can permanently delete any contract or your entire account from your dashboard at any time.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">4. Your rights (GDPR)</h2>
          <p className="mt-2 text-ink-soft">You have the right to access, correct, export and delete your data, and to object to processing. Email privacy@clauselens.com to exercise these rights; we respond within 30 days.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">5. Cookies</h2>
          <p className="mt-2 text-ink-soft">We use strictly necessary cookies for authentication and privacy-friendly analytics. No third-party advertising cookies.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">6. Contact</h2>
          <p className="mt-2 text-ink-soft">Data controller: ClauseLens. Questions: privacy@clauselens.com.</p>
        </div>
      </div>
    </section>
  );
}
