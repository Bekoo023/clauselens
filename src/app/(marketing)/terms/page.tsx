import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms that govern your use of ClauseLens.",
};

export default function TermsPage() {
  return (
    <section className="container-page max-w-3xl py-16 sm:py-20">
      <h1 className="h-display text-4xl">Terms of service</h1>
      <p className="mt-2 text-sm text-ink-soft">Last updated: July 2026.</p>
      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink">
        <div>
          <h2 className="text-lg font-semibold">1. The service</h2>
          <p className="mt-2 text-ink-soft">
            {/* TODO: replace with the registered legal entity name, address and (if applicable) KvK/VAT number */}
            ClauseLens provides AI-powered contract analysis: risk scores, flagged clauses and negotiation
            suggestions, for informational purposes.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">2. Not legal advice</h2>
          <p className="mt-2 text-ink-soft">ClauseLens is not a law firm and does not provide legal advice. Analyses are informational and may contain errors or omissions. Always verify flagged clauses against the original contract and consult a qualified lawyer for binding advice, especially for high-value or high-risk agreements.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">3. Accounts & acceptable use</h2>
          <p className="mt-2 text-ink-soft">You are responsible for your account credentials and for having the right to upload the contracts you analyze. You may not misuse the service, attempt to circumvent usage limits, or resell analyses without a Business/Enterprise agreement.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">4. Subscriptions & billing</h2>
          <p className="mt-2 text-ink-soft">Paid plans renew automatically (monthly or yearly) until cancelled. Cancellation takes effect at the end of the current billing period. First-time subscribers can request a full refund within 14 days.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">5. Intellectual property</h2>
          <p className="mt-2 text-ink-soft">You retain all rights to contracts you upload. We retain all rights to the ClauseLens software, brand and analysis format.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">6. Liability</h2>
          <p className="mt-2 text-ink-soft">To the maximum extent permitted by law, ClauseLens&apos;s total liability is limited to the fees you paid in the 12 months preceding the claim. We are not liable for decisions made based on analyses.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">7. Termination</h2>
          <p className="mt-2 text-ink-soft">You may stop using the service and delete your account at any time from your dashboard. We may suspend or terminate accounts that violate these terms, with notice where reasonably possible.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">8. Governing law</h2>
          <p className="mt-2 text-ink-soft">
            {/* TODO: confirm with a lawyer once the legal entity and its country of registration are set */}
            These terms are governed by the laws of the Netherlands, without regard to conflict-of-law rules.
            Disputes will be submitted to the competent court in the Netherlands, unless mandatory consumer
            protection law provides otherwise.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">9. Changes & contact</h2>
          <p className="mt-2 text-ink-soft">We may update these terms; material changes will be announced by email. Questions: legal@clauselens.org.</p>
        </div>
      </div>
    </section>
  );
}
