// Single source of truth for contract types.
// Powers: the type selector in the analyzer, and the programmatic SEO pages at /review/[type].

export type ContractType = {
  slug: string;
  name: string; // "NDA": always correctly cased, use as-is (never .toLowerCase())
  longName: string; // "Non-Disclosure Agreement"
  // Grammar metadata, set explicitly per type rather than inferred from the
  // first letter (a "starts with a vowel" check gets abbreviations like NDA
  // and MSA wrong, since they're pronounced letter-by-letter).
  article: "a" | "an"; // the article that precedes `name`, e.g. "an NDA"
  midSentenceName: string; // lowercase-safe form for mid-sentence use, preserving abbreviation casing (e.g. "NDA", "SaaS agreement", "freelance contract")
  intro: string; // 2-3 sentences for the SEO page
  audience: string; // who typically signs this
  redFlags: { title: string; detail: string }[];
  checklist: string[]; // "before you sign" checklist
  faq: { q: string; a: string }[];
};

export const CONTRACT_TYPES: ContractType[] = [
  {
    slug: "nda",
    name: "NDA",
    longName: "Non-Disclosure Agreement",
    article: "an",
    midSentenceName: "NDA",
    intro:
      "NDAs look harmless because they are short, but a bad one can silence you for years or claim ownership of ideas you brought to the table. Most NDA risk hides in the definition of confidential information and the survival period.",
    audience: "Freelancers, consultants, and founders in early partnership or investor talks",
    redFlags: [
      { title: "Overbroad definition of confidential information", detail: "If 'everything disclosed' counts as confidential, you can be blamed for using general industry knowledge later." },
      { title: "Indefinite or excessive term", detail: "Confidentiality that survives forever is rarely reasonable outside trade secrets. 2-3 years is the common standard." },
      { title: "One-way (unilateral) obligations", detail: "You are bound, they are not. Fine when only they disclose, dangerous when the exchange is mutual." },
      { title: "IP assignment hidden inside an NDA", detail: "An NDA should protect secrets, not transfer ownership of ideas, feedback, or work product." },
      { title: "Non-compete disguised as confidentiality", detail: "Clauses that stop you from working with 'similar companies' go far beyond protecting information." },
    ],
    checklist: [
      "Is the definition of confidential information specific and limited?",
      "Is the term 2-3 years (unless genuine trade secrets are involved)?",
      "Are obligations mutual if both sides share information?",
      "Are standard exclusions present (public knowledge, independently developed, legally required disclosure)?",
      "Does it avoid IP assignment and non-compete language?",
    ],
    faq: [
      { q: "How long should an NDA last?", a: "Two to three years is standard for business information. Indefinite terms are usually only justified for true trade secrets, like formulas or source code." },
      { q: "Should I sign a one-way NDA?", a: "Only if the information genuinely flows one way. If you will also share sensitive material (your process, pricing, or ideas), ask for a mutual NDA." },
      { q: "Can an NDA stop me from working with competitors?", a: "It should not. That is a non-compete, a different (and often unenforceable) instrument. Flag any NDA that restricts who you can work for." },
    ],
  },
  {
    slug: "freelance",
    name: "Freelance contract",
    longName: "Freelance / Independent Contractor Agreement",
    article: "a",
    midSentenceName: "freelance contract",
    intro:
      "Freelance agreements decide when you get paid, who owns your work, and how easily a client can walk away. The most expensive clauses are usually the quiet ones: unlimited revisions, IP transfer before payment, and 60-day payment terms.",
    audience: "Freelancers, independent contractors, and solo consultants",
    redFlags: [
      { title: "IP transfers before full payment", detail: "Ownership of your work should transfer only when the invoice is paid. Otherwise a non-paying client keeps your work anyway." },
      { title: "Unlimited revisions", detail: "'Until client satisfaction' is an open-ended obligation. Cap revisions in rounds and price extra rounds separately." },
      { title: "Net-60 or net-90 payment terms", detail: "Long payment terms turn you into your client's bank. Net-14 or net-30 with late fees is defensible market practice." },
      { title: "Termination for convenience without a kill fee", detail: "If the client can cancel any time without paying for work in progress, all project risk sits with you." },
      { title: "Broad indemnification", detail: "You should not insure the client against every possible claim. Limit indemnity to your own IP infringement and misconduct." },
    ],
    checklist: [
      "Payment terms net-30 or shorter, with a late-payment clause?",
      "Deposit or milestone payments for larger projects?",
      "IP transfers only upon full payment?",
      "Revisions capped, scope-change process defined?",
      "Kill fee or payment for work performed on early termination?",
      "Liability capped at fees paid?",
    ],
    faq: [
      { q: "What is a kill fee?", a: "A fixed amount (often 25-50% of the remaining project value) the client pays if they cancel the project early. It compensates you for reserved time and lost opportunities." },
      { q: "Should I accept 'work for hire'?", a: "Work-for-hire means the client owns everything from the moment of creation. It is acceptable when it is priced in, but pair it with payment-conditional transfer so you keep leverage until you are paid." },
      { q: "Can I keep the right to show work in my portfolio?", a: "Yes, add a portfolio clause. Most clients accept it, sometimes with a delay or anonymization for sensitive projects." },
    ],
  },
  {
    slug: "saas-agreement",
    name: "SaaS agreement",
    longName: "SaaS Subscription / Services Agreement",
    article: "a",
    midSentenceName: "SaaS agreement",
    intro:
      "SaaS contracts govern uptime, data, and what happens when things break. Buyers should scrutinize auto-renewal and data export; vendors should watch liability and indemnity creep from enterprise templates.",
    audience: "Startups buying or selling software subscriptions",
    redFlags: [
      { title: "Auto-renewal with long notice windows", detail: "A 12-month renewal that requires 90-day notice quietly locks you in for another year if you miss one calendar entry." },
      { title: "No data export or deletion commitments", detail: "Without an export clause, leaving the vendor means losing your data, the strongest lock-in there is." },
      { title: "Uncapped liability (as vendor)", detail: "Enterprise buyers push for unlimited liability. Standard practice caps it at 12 months of fees." },
      { title: "Unilateral price increases", detail: "'Vendor may adjust pricing at any time' makes budgeting impossible. Negotiate caps like CPI or a fixed maximum percentage." },
      { title: "Weak SLA with service credits as sole remedy", detail: "99% uptime still allows 7+ hours of downtime a month, and 'credits only' means you cannot terminate a chronically failing service." },
    ],
    checklist: [
      "Renewal terms: notice window realistic (30 days) and calendar-tracked?",
      "Data export in a usable format, deletion after termination?",
      "Liability cap mutual and proportionate (typically 12 months of fees)?",
      "Price increase caps at renewal?",
      "SLA with termination right for chronic failure?",
      "Security commitments (encryption, breach notification) in writing?",
    ],
    faq: [
      { q: "What is a reasonable liability cap in SaaS?", a: "The most common market standard is the fees paid in the 12 months before the claim, with carve-outs for confidentiality breaches and IP indemnity." },
      { q: "Are auto-renewal clauses enforceable?", a: "Generally yes, though several jurisdictions require clear notice for consumer contracts. In B2B, assume it is enforceable and negotiate the notice window instead." },
      { q: "What should a data clause include?", a: "Export on request in a standard format, deletion within a defined period after termination, and a commitment that your data is not used to train models or resold without consent." },
    ],
  },
  {
    slug: "employment",
    name: "Employment contract",
    longName: "Employment Agreement",
    article: "an",
    midSentenceName: "employment contract",
    intro:
      "Employment contracts front-load excitement (title, salary) and back-load risk (non-competes, IP assignment, termination terms). The clauses that matter most are the ones that apply after you leave.",
    audience: "Employees and startup hires reviewing an offer",
    redFlags: [
      { title: "Overbroad non-compete", detail: "A non-compete covering your whole industry, nationwide, for two years can freeze your career. Scope, geography, and duration should all be narrow." },
      { title: "IP assignment covering personal projects", detail: "'All inventions during employment' can capture your side projects. Ask for a carve-out for work done on your own time without company resources." },
      { title: "Vague bonus or commission terms", detail: "'Discretionary' bonuses tied to undefined targets are promises that cost the employer nothing." },
      { title: "Clawback and repayment clauses", detail: "Training-cost or sign-on clawbacks can make leaving expensive. Check the amounts and the time decay." },
      { title: "Unilateral change clauses", detail: "If the employer can change role, location, or terms 'at its discretion', the contract you signed is not the contract you will have." },
    ],
    checklist: [
      "Non-compete narrow in scope, geography, and duration (or absent)?",
      "IP clause carves out personal projects on personal time?",
      "Bonus/commission criteria objective and written?",
      "Notice periods symmetrical for both sides?",
      "All promised perks (equity, remote days, budget) in the written contract?",
    ],
    faq: [
      { q: "Are non-competes enforceable?", a: "It varies enormously by jurisdiction. Some ban them for most workers, others enforce reasonable ones. Regardless of enforceability, they create legal risk and chilling effects, so negotiate them down before signing." },
      { q: "What is a reasonable IP assignment clause?", a: "It should cover work created for the company, using company resources, or within the company's business. It should not capture unrelated projects built on your own time and hardware." },
      { q: "Can I negotiate an employment contract?", a: "Almost always, especially at startups. Non-competes, IP carve-outs, notice periods, and severance are commonly negotiated even when salary is fixed." },
    ],
  },
  {
    slug: "consulting",
    name: "Consulting agreement",
    longName: "Consulting / Professional Services Agreement",
    article: "a",
    midSentenceName: "consulting agreement",
    intro:
      "Consulting agreements blur the line between advice and outcomes. The riskiest clauses make you responsible for results you cannot control, or quietly expand the scope you priced.",
    audience: "Consultants, advisors, and boutique agencies",
    redFlags: [
      { title: "Outcome guarantees", detail: "'Consultant warrants the client will achieve...' turns advice into insurance. Warrant professional effort and competence, not business results." },
      { title: "Scope defined by client 'as needed'", detail: "Open-ended scope means unlimited work at a fixed price. Tie the fee to defined deliverables or a time budget." },
      { title: "Non-solicitation of all client contacts", detail: "Broad non-solicits can block you from working with anyone you met through the engagement, including people who approach you." },
      { title: "Immediate termination without payment", detail: "If the client can end the engagement instantly, ensure payment for work performed and a notice period." },
      { title: "Unlimited liability for advice", detail: "Cap liability at fees paid; you are not underwriting the client's business decisions." },
    ],
    checklist: [
      "Deliverables or time budget explicitly defined?",
      "Change-request procedure for out-of-scope work?",
      "Liability capped, no outcome guarantees?",
      "Payment for work performed on termination?",
      "Non-solicit limited to active recruiting of client employees?",
    ],
    faq: [
      { q: "Should a consulting agreement include a warranty?", a: "A warranty of professional, workmanlike service is standard. A warranty of results is not. Decline it or price it like the insurance policy it is." },
      { q: "What liability cap is normal for consulting?", a: "Fees paid under the agreement (or in the preceding 12 months) is the common ceiling, often with carve-outs for gross negligence." },
      { q: "How do I handle scope creep contractually?", a: "Define deliverables precisely, then add a change-control clause: any addition requires a written estimate approved before work starts." },
    ],
  },
  {
    slug: "lease",
    name: "Commercial lease",
    longName: "Commercial Lease Agreement",
    article: "a",
    midSentenceName: "commercial lease",
    intro:
      "Commercial leases are long, one-sided, and written by the landlord's lawyers. Unlike residential leases, there is little consumer protection, and what you sign is what you get.",
    audience: "Small businesses, agencies, and startups renting office or retail space",
    redFlags: [
      { title: "Triple-net surprises", detail: "Base rent is only the start: taxes, insurance, and maintenance (NNN) can add 30-50%. Demand historical operating-cost statements." },
      { title: "Personal guarantees", detail: "A personal guarantee puts your house behind your office. Negotiate a cap, a burn-off after X months of good payment, or a security deposit instead." },
      { title: "Broad repair obligations", detail: "'Tenant maintains the premises' can include the roof and HVAC replacement. Structural elements should stay with the landlord." },
      { title: "No assignment or subletting rights", detail: "If you outgrow (or shrink out of) the space, an assignment clause is your only exit. 'Consent not to be unreasonably withheld' is the key phrase." },
      { title: "Relocation and demolition clauses", detail: "Some leases let the landlord move you or terminate for redevelopment. Understand the compensation, or strike the clause." },
    ],
    checklist: [
      "Total occupancy cost (base + NNN + utilities) modeled, not just base rent?",
      "Personal guarantee capped or burning off over time?",
      "Repair split: structure and systems to landlord, interior to tenant?",
      "Assignment/sublet permitted with reasonable consent?",
      "Renewal option with defined rent formula?",
    ],
    faq: [
      { q: "What does triple-net (NNN) mean?", a: "The tenant pays, on top of base rent, a pro-rata share of property taxes, building insurance, and common-area maintenance. Always ask for prior-year statements to size it." },
      { q: "Can I avoid a personal guarantee?", a: "Sometimes, with a larger deposit, a letter of credit, or a 'good guy' guarantee limited to the period until you hand back the keys. Any cap is better than an unlimited guarantee." },
      { q: "What is a fair lease term for a startup?", a: "Shorter is safer: 1-3 years with renewal options preserves flexibility. Landlords trade shorter terms for slightly higher rent, usually worth it." },
    ],
  },
  {
    slug: "partnership",
    name: "Partnership agreement",
    longName: "Partnership / Founders Agreement",
    article: "a",
    midSentenceName: "partnership agreement",
    intro:
      "Partnership agreements are cheap to write and brutally expensive to skip. The clauses that matter are the ones for the bad days: deadlock, departure, and death.",
    audience: "Co-founders and business partners formalizing a venture",
    redFlags: [
      { title: "No vesting on founder equity", detail: "Without vesting, a co-founder can leave in month three and keep half the company forever. Four years with a one-year cliff is standard." },
      { title: "50/50 with no deadlock mechanism", detail: "Equal partners with no tiebreaker means one disagreement can paralyze the company. Add a deadlock clause (mediation, buy-sell, casting vote)." },
      { title: "No buy-sell provisions", detail: "What happens when a partner wants out, divorces, or dies? Without a valuation formula and process, the answer is: litigation." },
      { title: "Undefined roles and capital obligations", detail: "'Partners contribute as needed' invites resentment. Define who invests what, who decides what, and what happens if someone stops contributing." },
      { title: "Profit distribution without a written formula", detail: "Distributions 'as agreed from time to time' means the majority decides, or nobody does." },
    ],
    checklist: [
      "Equity vesting with a cliff for all founders?",
      "Deadlock resolution mechanism defined?",
      "Buy-sell (shotgun clause, right of first refusal) with valuation method?",
      "Roles, decision rights, and spending limits documented?",
      "IP assigned to the company, not the individuals?",
    ],
    faq: [
      { q: "What is a shotgun clause?", a: "A buy-sell mechanism: one partner names a price; the other must either sell at that price or buy the first partner out at the same price. It forces fair valuations but favors the partner with more cash." },
      { q: "Do co-founders really need vesting?", a: "Yes, it protects the founders who stay. Even solo-funded ventures use reverse vesting so a departing founder's unvested shares return to the company." },
      { q: "Should the partnership own the IP?", a: "The entity, not individuals, should own all IP. Otherwise a departing partner can walk away with the product." },
    ],
  },
  {
    slug: "loan",
    name: "Loan agreement",
    longName: "Business Loan Agreement",
    article: "a",
    midSentenceName: "loan agreement",
    intro:
      "Loan agreements are asymmetric by nature, because the lender writes them. Your job is to understand exactly what triggers default, what you have pledged, and what the loan truly costs.",
    audience: "Founders and small-business owners taking on debt",
    redFlags: [
      { title: "Confession of judgment", detail: "Some agreements let the lender obtain a judgment without a lawsuit the moment they claim default. Avoid entirely where possible." },
      { title: "Cross-default clauses", detail: "Defaulting on any other obligation, even a small one, can trigger default here, making all debt due at once." },
      { title: "Blanket liens and personal guarantees", detail: "A lien on 'all assets, present and future' plus a personal guarantee means the lender owns your downside completely." },
      { title: "Prepayment penalties", detail: "Being punished for paying early locks you into the interest schedule. Negotiate free prepayment or a declining fee." },
      { title: "Variable rates without caps", detail: "Floating rates without a ceiling turn your financing cost into a lottery ticket." },
    ],
    checklist: [
      "True cost calculated (APR including all fees, not the headline rate)?",
      "Default events specific and cure periods included?",
      "Collateral limited to defined assets?",
      "Prepayment allowed without penalty?",
      "Financial covenants realistic for your projections?",
    ],
    faq: [
      { q: "What is a cure period?", a: "A window (often 10-30 days) to fix a default (a late payment, a missed report) before the lender can act. Contracts without cure periods are unforgiving by design." },
      { q: "What does a personal guarantee on a business loan mean?", a: "If the business cannot pay, you pay from personal assets. Limited guarantees (capped amount, specific assets, time-limited) are negotiable alternatives." },
      { q: "What are financial covenants?", a: "Promises about your business's numbers: minimum revenue, maximum debt ratio. Breaching one is a default even if you never miss a payment, so model them against your worst-case projections." },
    ],
  },
  {
    slug: "msa",
    name: "Master services agreement",
    longName: "Master Services Agreement (MSA)",
    article: "a",
    midSentenceName: "master services agreement",
    intro:
      "An MSA sets the legal rules once so each new project only needs a short statement of work. Powerful, but it also means one bad clause infects every future project automatically.",
    audience: "Agencies and B2B service providers with repeat clients",
    redFlags: [
      { title: "Order-of-precedence traps", detail: "If the MSA overrides SOWs, project-specific agreements you negotiate later may be silently void, or vice versa. Know which document wins." },
      { title: "Unlimited liability flowing to every SOW", detail: "An uncapped MSA liability clause applies to all future work. Cap it once, correctly, at the MSA level." },
      { title: "Client-friendly IP defaults", detail: "'All work product, including tools and methods' can transfer your reusable frameworks and libraries. Carve out pre-existing IP and generic know-how." },
      { title: "Payment terms buried at the MSA level", detail: "Net-60 in the MSA silently applies to every SOW, whatever you write later." },
      { title: "Termination of the MSA killing active SOWs", detail: "Ensure work in progress survives MSA termination, or a client can cancel everything with one notice." },
    ],
    checklist: [
      "Order of precedence between MSA and SOW explicit?",
      "Liability capped at the MSA level, applying to all SOWs?",
      "Pre-existing IP and reusable components carved out?",
      "Payment terms and late fees acceptable as defaults?",
      "Active SOWs survive MSA termination?",
    ],
    faq: [
      { q: "What is the difference between an MSA and a SOW?", a: "The MSA contains the durable legal terms (liability, IP, confidentiality, payment defaults); each statement of work defines one project's scope, deliverables, and price under those terms." },
      { q: "Which document should win in a conflict?", a: "Common practice: the SOW wins for project-specific commercial terms, the MSA wins for legal terms. What matters most is that the contract says so explicitly." },
      { q: "Should small agencies bother with an MSA?", a: "Yes, from the second project with the same client. It cuts negotiation time dramatically and prevents terms from drifting between projects." },
    ],
  },
  {
    slug: "influencer",
    name: "Influencer agreement",
    longName: "Influencer / Brand Partnership Agreement",
    article: "an",
    midSentenceName: "influencer agreement",
    intro:
      "Influencer contracts decide who owns your content, how long a brand can use your face, and what you are allowed to say afterwards. Usage rights and exclusivity are where creators lose the most money.",
    audience: "Content creators, influencers, and the brands that hire them",
    redFlags: [
      { title: "Perpetual, all-media usage rights", detail: "'In perpetuity, all media, worldwide' turns one post fee into a lifetime advertising license. Time-box usage (3-12 months) and price extensions separately." },
      { title: "Broad category exclusivity", detail: "Exclusivity across 'beauty' or 'tech' can block most of your income. Narrow the category, shorten the window, and price it explicitly." },
      { title: "Unlimited reshoots and approvals", detail: "Approval rounds without limits are unpaid production work. Cap revisions and define approval timelines with auto-approval on silence." },
      { title: "Morality clauses without reciprocity", detail: "Brands can terminate over your 'controversy', but you should equally be able to exit if the brand becomes toxic." },
      { title: "Payment tied to performance metrics", detail: "Compensation based on views or conversions shifts all platform-algorithm risk onto you. Fixed fee first; bonuses on top are fine." },
    ],
    checklist: [
      "Usage rights time-limited and channel-specific?",
      "Paid-media (whitelisting) rights priced separately?",
      "Exclusivity narrow, short, and compensated?",
      "Deliverables, revision rounds, and approval deadlines defined?",
      "Payment: fixed fee, net-30 or shorter, kill fee for cancellations?",
    ],
    faq: [
      { q: "What are usage rights in influencer contracts?", a: "The brand's license to reuse your content, on their channels, in ads, on packaging. Each channel and month of usage has market value; unlimited usage should cost a multiple of the content fee." },
      { q: "What is whitelisting?", a: "The brand runs paid ads through your account or with your handle. It uses your credibility and affects your audience, so it is always a separately priced right, never a freebie." },
      { q: "Should I accept exclusivity?", a: "Only if it is narrow (specific competitors, not whole categories), short, and explicitly paid. Calculate what you could earn from the excluded brands during the window: that is the price floor." },
    ],
  },
];

export function getContractType(slug: string) {
  return CONTRACT_TYPES.find((t) => t.slug === slug);
}

export const PERSPECTIVES = [
  { value: "provider", label: "I provide the service / work" },
  { value: "client", label: "I hire / pay the other party" },
  { value: "employee", label: "I am the employee / talent" },
  { value: "other", label: "Other / not sure" },
] as const;
