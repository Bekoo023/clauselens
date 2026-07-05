"use client";

import Link from "next/link";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-paper/80 backdrop-blur-lg transition-shadow duration-300 ${
        scrolled ? "border-ink/10 shadow-[0_1px_16px_rgb(11_18_32/0.06)]" : "border-ink/5"
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between" aria-label="Main">
        <Link href="/" className="flex items-center gap-2 font-bold text-ink">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-bright text-white">
            <ScanSearch size={18} aria-hidden />
          </span>
          <span className="h-display text-lg">ClauseLens</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="btn btn-ghost">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login" className="btn btn-ghost">Log in</Link>
          <Link href="/register" className="btn btn-primary">Analyze a contract free</Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="menu-in border-t border-ink/5 bg-paper px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 font-medium hover:bg-ink/5" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link href="/login" className="rounded-lg px-3 py-2 font-medium hover:bg-ink/5" onClick={() => setOpen(false)}>Log in</Link>
            <Link href="/register" className="btn btn-primary mt-2" onClick={() => setOpen(false)}>Analyze a contract free</Link>
          </div>
        </div>
      )}
    </header>
  );
}
