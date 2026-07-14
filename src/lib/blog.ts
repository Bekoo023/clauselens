// Static blog content. Swap for MDX/CMS (e.g. Contentlayer, Sanity) when scaling.
export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  category: string;
  body: string[]; // paragraphs
};

export const posts: Post[] = [
  {
    slug: "freelance-contract-red-flags",
    title: "7 red flags in freelance contracts (and how to push back)",
    description:
      "From unlimited liability to 90-day payment terms: the clauses that cost freelancers real money, explained in plain language.",
    date: "2026-06-18",
    readingTime: "3 min",
    category: "Guides",
    body: [
      "Most freelancers sign client contracts without reading past the rate. That is exactly where expensive surprises hide: in liability, payment terms and IP clauses written by the client's lawyer, for the client's benefit. Here are the seven that cost freelancers the most money, and the exact language to push back with.",
      "1. Unlimited liability. If a project goes wrong, you could be on the hook for damages far beyond the project fee, including the client's lost revenue or third-party claims. This is the single most expensive clause in freelance contracts, because it turns a €5,000 project into potentially unlimited exposure. Push back by capping total liability at the fees paid under the agreement (or, at most, a fixed multiple of them) and excluding indirect or consequential damages.",
      "2. Slow payment terms. Net-60 or net-90 terms turn you into your client's bank, financing their business with your unpaid invoices while your own bills stay on a 30-day clock. Counter with net-15 or net-30 and add a late-payment interest clause (many jurisdictions set a statutory rate you can simply reference). Most clients accept this without discussion: it's rarely the term they actually care about.",
      "3. Broad IP assignment. IP transfer clauses often assign everything you create during the engagement, including your reusable tooling, internal libraries, and pre-existing frameworks, to the client. Carve out your pre-existing IP and general-purpose components explicitly, and only assign what's specific to the deliverable. Without this carve-out, you may technically lose the right to reuse your own toolkit on the next project.",
      "4. No kill fee. If the client cancels midway, a contract with no kill fee can leave you unpaid for work already scheduled or started. A simple fix: a clause guaranteeing a percentage of remaining fees (commonly 25-50%) if the project is cancelled without cause.",
      "5. Unlimited revisions. \"Revisions until client satisfaction\" sounds reasonable until it means unpaid rework for months. Cap revisions at a fixed number per deliverable, with additional rounds billed at your hourly rate.",
      "6. Vague scope. A one-paragraph scope description is a red flag by itself: it lets the client redefine \"included\" work indefinitely. Insist on a scope exhibit or statement of work with concrete deliverables, and a clause stating that anything not listed is a change order.",
      "7. One-sided termination rights. Some contracts let the client terminate for convenience with no notice, while requiring you to give 60 or 90 days' notice to walk away. Push for symmetrical termination rights, or at minimum a notice period you can actually live with.",
      "None of these clauses are unusual: they show up in the majority of client-drafted agreements, simply because the client's lawyer wrote them to favor the client. Asking to adjust them is standard practice, not confrontation, and in our experience the large majority of clients accept reasonable pushback on at least a few of these without any negotiation drama at all.",
    ],
  },
  {
    slug: "what-is-an-indemnification-clause",
    title: "What is an indemnification clause? A plain-language guide",
    description:
      "Indemnification sounds harmless. It can mean paying your client's legal bills. Here is how to read it and rewrite it.",
    date: "2026-06-25",
    readingTime: "3 min",
    category: "Clause library",
    body: [
      "An indemnification clause decides who pays when a third party sues over the work. In many service agreements it is written one-way: you protect the client, the client protects nobody. It sounds like routine legal boilerplate, which is exactly why it gets signed without a second look and exactly why it's worth five minutes of attention.",
      "In plain language, to \"indemnify\" someone means to compensate them for a loss. So a clause that says \"Contractor shall indemnify Client against all claims arising from Contractor's services\" means: if a third party sues the client over something related to your work, you pay the client's legal bills and any resulting damages even if you weren't the one who caused the problem.",
      "The risk is asymmetric and often unbounded. A single third-party claim (say, a stock photo used without the right licence, a competitor alleging your code infringes a patent, or an end-user injured by a product you helped build) can cost more than a year of project fees if you have agreed to cover the client's losses and legal defence in full, with no cap.",
      "Watch for three variations, from worst to best for you. \"Broad form\" indemnification makes you responsible even for claims caused partly or entirely by the client's own negligence: the most dangerous version, and one you should always try to strike. \"Intermediate form\" splits liability by fault. \"Limited form\" (the fairest) only holds you responsible for claims arising from your own negligence or breach.",
      "A fair version is also mutual and capped: each party indemnifies the other for its own negligence, the total exposure is limited to the fees paid under the agreement (or a stated multiple), and both sides exclude indirect, consequential and reputational damages.",
      "This matters most in specific industries: software and SaaS (IP infringement and data breach claims), physical products or construction (personal injury and property damage), and anything involving licensed third-party assets like stock photos, fonts or open-source code with restrictive licences.",
      "When you receive a one-sided indemnification clause, propose mutuality first: \"Each party shall indemnify the other for claims arising from its own negligence or breach of this agreement, limited to fees paid.\" It is a reasonable, standard request and signals that you read contracts carefully, which changes the negotiation dynamic in your favour more than almost any other single edit.",
      "If a client refuses any cap or mutuality at all on a high-value engagement, treat that as useful information: it tells you how much risk they intend to shift onto you before the project has even started.",
    ],
  },
  {
    slug: "nda-checklist-before-you-sign",
    title: "The 5-minute NDA checklist before you sign",
    description:
      "Most NDAs are fine. The ones that aren't hide non-competes, perpetual terms and one-way obligations. Check these five things first.",
    date: "2026-07-01",
    readingTime: "3 min",
    category: "Checklists",
    body: [
      "NDAs feel like a formality, and usually they are. But a minority smuggle in obligations that outlive the deal, sometimes by design, sometimes by sloppy templating from a form the other side barely reads either. Five checks catch nearly all of it.",
      "1. Mutual or one-way? A one-way NDA only protects the party disclosing information. If you'll also share your own know-how, methods, rates, or client list during the conversation (which is common even in early sales calls), insist on a mutual NDA instead. It costs nothing to ask and protects you equally.",
      "2. How long does it last? Two to five years is standard for most business information, since most business information stops being sensitive well before then. 'Perpetual' (no end date) should be reserved for genuine trade secrets (a proprietary formula or algorithm), not a pitch deck. If you see 'perpetual' attached to ordinary business information, ask for a defined term.",
      "3. Is there hidden non-compete or non-solicit language? An NDA's job is to protect confidential information, not to stop you from working with competitors or hiring the other party's staff. Non-compete and non-solicit clauses sometimes get bundled into NDAs anyway, and courts in many jurisdictions are skeptical of them outside a proper commercial agreement, but you don't want to test that in litigation. If you find one, ask for it to be removed or moved into a separate, clearly negotiated agreement.",
      "4. How is 'confidential information' defined? A fair definition excludes information that is already public, independently developed by you, already known to you before disclosure, or later received lawfully from someone else. Without these carve-outs, you could technically be restricted from using things you already knew or that anyone could find with a search engine.",
      "5. Is there an IP assignment hiding in the boilerplate? Occasionally an NDA includes a clause assigning ownership of any ideas or feedback you share during discussions to the other party. That has nothing to do with confidentiality and everything to do with IP: read the definitions section carefully, not just the title of the document.",
      "Bonus check: look for a return-or-destroy clause requiring you to delete or hand back confidential materials when the relationship ends, and confirm it has a reasonable deadline (30 days is typical) rather than an immediate, hard-to-verify obligation.",
      "Five minutes, five checks, one bonus, then sign with confidence instead of just trusting that 'it's probably standard.'",
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
