import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms that govern your use of ClauseLens.",
};

export default function TermsPage() {
  return (
    <section className="container-page max-w-3xl py-16 sm:py-20">
      <h1 className="h-display text-4xl">Terms of service</h1>
      <p className="mt-2 text-sm text-ink-soft">Last updated: July 2026 · Template — review with a lawyer before launch.</p>
      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink">
        <div>
          <h2 className="text-lg font-semibold">1. The service</h2>
          <p className="mt-2 text-ink-soft">ClauseLens provides AI-powered contract analysis: risk scores, flagged clauses and negotiation suggestions, for informational purposes.</p>
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
          <p className="mt-2 text-ink-soft">To the maximum extent permitted by law, ClauseLens's total liability is limited to the fees you paid in the 12 months preceding the claim. We are not liable for decisions made based on analyses.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">7. Changes & contact</h2>
          <p className="mt-2 text-ink-soft">We may update these terms; material changes will be announced by email. Questions: legal@clauselens.com.</p>
        </div>
      </div>
    </section>
  );
}
