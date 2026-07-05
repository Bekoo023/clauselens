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
    readingTime: "6 min",
    category: "Guides",
    body: [
      "Most freelancers sign client contracts without reading past the rate. That is exactly where expensive surprises hide: in liability, payment terms and IP clauses written by the client's lawyer, for the client's benefit.",
      "The most common red flag is an unlimited liability clause. If a project goes wrong, you could be on the hook for damages far beyond the project fee. Push back by capping liability at the total fees paid under the agreement.",
      "Watch payment terms next. Net-60 or net-90 terms turn you into your client's bank. Counter with net-30 and a late-payment interest clause; most clients accept it without discussion.",
      "IP transfer clauses often assign everything you create — including your reusable tooling and libraries — to the client. Carve out your pre-existing work and general-purpose components explicitly.",
      "Finally, check for missing clauses: a kill fee for cancelled projects, a revision limit, and a clear scope definition. What a contract doesn't say is often riskier than what it does.",
    ],
  },
  {
    slug: "what-is-an-indemnification-clause",
    title: "What is an indemnification clause? A plain-language guide",
    description:
      "Indemnification sounds harmless. It can mean paying your client's legal bills. Here is how to read it — and rewrite it.",
    date: "2026-06-25",
    readingTime: "5 min",
    category: "Clause library",
    body: [
      "An indemnification clause decides who pays when a third party sues over the work. In many service agreements it is written one-way: you protect the client, the client protects nobody.",
      "The risk is asymmetric. A single third-party claim — say, a stock photo used without the right licence — can cost more than a year of project fees if you have agreed to cover the client's losses and legal defence.",
      "A fair version is mutual and capped: each party indemnifies the other for its own negligence, limited to the fees paid under the agreement, and excludes indirect damages.",
      "When you receive a one-sided indemnification clause, propose mutuality first. It is a reasonable, standard request and signals that you read contracts carefully — which changes the negotiation dynamic in your favour.",
    ],
  },
  {
    slug: "nda-checklist-before-you-sign",
    title: "The 5-minute NDA checklist before you sign",
    description:
      "Most NDAs are fine. The ones that aren't hide non-competes, perpetual terms and one-way obligations. Check these five things first.",
    date: "2026-07-01",
    readingTime: "4 min",
    category: "Checklists",
    body: [
      "NDAs feel like a formality, and usually they are. But a minority smuggle in obligations that outlive the deal — sometimes by design, sometimes by sloppy templating.",
      "First, check whether the NDA is mutual or one-way. If you will also share know-how, methods or pricing, insist on mutual confidentiality.",
      "Second, look at the term. Two to five years is standard for most business information; 'perpetual' should be reserved for genuine trade secrets only.",
      "Third, scan for non-compete or non-solicit language. An NDA is not the place for it, and courts in many jurisdictions agree — but you don't want to test that in litigation.",
      "Fourth, check the definition of confidential information: it should exclude what is public, independently developed, or already known to you. Fifth, confirm there's no IP assignment hiding in the boilerplate. Five minutes, five checks — then sign with confidence.",
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
