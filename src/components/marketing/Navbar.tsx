"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ScanSearch } from "lucide-react";

const links = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/review", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // Full-width bar with a permanent surface. Nothing sits on top of the
    // links, which is where click targets went missing in the inset variant.
    <header
      className={`sticky top-0 z-50 border-b bg-paper/95 transition-shadow duration-300 print-hidden ${
        scrolled ? "border-ink/10 shadow-[0_4px_24px_-16px_rgb(11_18_32/0.5)]" : "border-ink/5"
      }`}
    >
      <div className="container-page">
        <nav className="flex h-18 items-center justify-between" aria-label="Main">
          <Link href="/" className="group flex items-center gap-2.5 font-bold text-ink">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-deep via-brand to-brand-bright text-white shadow-[0_6px_18px_-8px_var(--color-brand)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              <ScanSearch size={18} aria-hidden />
            </span>
            <span className="h-display text-lg">ClauseLens</span>
          </Link>

          {/* Per-link background, not one shared overlay, so the highlight
              can never intercept a click. */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                    active
                      ? "bg-brand/10 text-brand"
                      : "text-ink-soft hover:bg-ink/[0.06] hover:text-ink"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Link href="/login" className="btn btn-ghost">Log in</Link>
            <Link href="/register" className="btn btn-primary">Analyze a contract free</Link>
          </div>

          <button
            className="rounded-xl p-2 transition-colors hover:bg-ink/5 md:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className={`menu-toggle-icon inline-flex ${open ? "is-open" : ""}`}>
              {open ? <X /> : <Menu />}
            </span>
          </button>
        </nav>

        {open && (
          <div className="menu-in border-t border-ink/5 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {links.map((l, i) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="menu-item rounded-xl px-3 py-2.5 font-medium transition-colors hover:bg-ink/5"
                  style={{ animationDelay: `${i * 40}ms` }}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="menu-item rounded-xl px-3 py-2.5 font-medium transition-colors hover:bg-ink/5"
                style={{ animationDelay: `${links.length * 40}ms` }}
                onClick={() => setOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="menu-item btn btn-primary mt-2"
                style={{ animationDelay: `${(links.length + 1) * 40}ms` }}
                onClick={() => setOpen(false)}
              >
                Analyze a contract free
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
