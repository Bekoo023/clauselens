import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How ClauseLens collects, uses and protects your data.",
};

export default function PrivacyPage() {
  return (
    <section className="container-page max-w-3xl py-16 sm:py-20">
      <h1 className="h-display text-4xl">Privacy policy</h1>
      <p className="mt-2 text-sm text-ink-soft">Last updated: July 2026.</p>
      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink">
        <div>
          <h2 className="text-lg font-semibold">1. Who we are</h2>
          <p className="mt-2 text-ink-soft">
            {/* TODO: replace with the registered legal entity name, address and (if applicable) KvK/VAT number */}
            ClauseLens (&quot;we&quot;, &quot;us&quot;) is the data controller for the personal data described in this
            policy. You can reach us at privacy@clauselens.org.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">2. What we collect</h2>
          <p className="mt-2 text-ink-soft">Account data (name, email), billing data (processed by Stripe; we never store card numbers), contracts you upload for analysis, and usage data (pages visited, features used).</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">3. Legal basis for processing</h2>
          <p className="mt-2 text-ink-soft">
            We process account and contract data to perform our contract with you (Art. 6(1)(b) GDPR) — i.e. to
            provide the analysis you signed up for. We process billing data to comply with legal and tax
            obligations (Art. 6(1)(c)). We process aggregated usage data on the basis of our legitimate interest
            in improving the product (Art. 6(1)(f)), balanced against your right to privacy.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">4. How we use it</h2>
          <p className="mt-2 text-ink-soft">To provide the service (analyzing your contracts), process payments, send transactional email, and improve the product. We do not sell personal data. We do not use your data to train AI models.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">5. Who we share it with</h2>
          <p className="mt-2 text-ink-soft">
            We share data with a small number of processors, strictly to run the service: Anthropic (to analyze
            contract text you submit), Stripe (payment processing), our database and hosting provider, and Resend
            (transactional email). Each acts under a data processing agreement and may not use your data for its
            own purposes. We do not share data with third parties for their own marketing.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">6. International transfers</h2>
          <p className="mt-2 text-ink-soft">
            Some processors above may process data outside the EU/EEA (for example, in the United States). Where
            that happens, we rely on the EU Standard Contractual Clauses or an equivalent adequacy mechanism to
            protect your data.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">7. Retention</h2>
          <p className="mt-2 text-ink-soft">
            We keep account and contract data for as long as your account is active. If you delete a contract or
            your account, it is permanently removed from our production systems within 30 days, except where we
            must keep billing records for longer to meet legal or tax obligations.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">8. Storage & security</h2>
          <p className="mt-2 text-ink-soft">Data is encrypted in transit (TLS) and at rest. You can permanently delete any contract or your entire account from your dashboard at any time.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">9. Your rights (GDPR)</h2>
          <p className="mt-2 text-ink-soft">
            You have the right to access, correct, export and delete your data, and to object to or restrict
            processing. Email privacy@clauselens.org to exercise these rights; we respond within 30 days. If you
            are not satisfied with our response, you have the right to lodge a complaint with your local data
            protection authority (in the Netherlands: the Autoriteit Persoonsgegevens).
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">10. Cookies</h2>
          <p className="mt-2 text-ink-soft">We use strictly necessary cookies for authentication and privacy-friendly analytics. No third-party advertising cookies.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">11. Children</h2>
          <p className="mt-2 text-ink-soft">ClauseLens is intended for business use and is not directed at, or knowingly used by, children under 16.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">12. Changes & contact</h2>
          <p className="mt-2 text-ink-soft">We may update this policy; material changes will be announced by email. Questions: privacy@clauselens.org.</p>
        </div>
      </div>
    </section>
  );
}
