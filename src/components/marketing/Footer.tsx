import Link from "next/link";
import { ScanSearch } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/review", label: "Review guides" },
      { href: "/review/nda", label: "NDA review" },
      { href: "/review/freelance", label: "Freelance contract review" },
      { href: "/blog/freelance-contract-red-flags", label: "Contract red flags" },
      { href: "/blog/nda-checklist-before-you-sign", label: "NDA checklist" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of service" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-ink/5 bg-surface">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-bright text-white">
              <ScanSearch size={18} aria-hidden />
            </span>
            <span className="h-display text-lg">ClauseLens</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink-soft">
            Know what you&apos;re signing. AI contract review for freelancers, agencies and startups.
          </p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-sm font-semibold">{col.title}</h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-soft hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-ink/5">
        <div className="container-page flex flex-col gap-1.5 py-5 text-xs text-ink-soft">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} ClauseLens. All rights reserved.</p>
            <p>ClauseLens provides information, not legal advice.</p>
          </div>
          {/* TODO: replace with the registered legal entity name, address and (if applicable) KvK/VAT number */}
          <p>ClauseLens</p>
        </div>
      </div>
    </footer>
  );
}
