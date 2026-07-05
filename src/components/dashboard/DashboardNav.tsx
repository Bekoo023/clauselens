"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FilePlus2, Files, Settings } from "lucide-react";

// Defined here (not passed as a prop) because Lucide icon components are
// functions — passing them from the server layout to this client component
// as prop data would cross the RSC boundary illegally (functions aren't
// serializable). Static nav content, so co-locating it is fine.
const nav = [
  { href: "/dashboard", label: "Contracts", icon: Files },
  { href: "/dashboard/new", label: "New analysis", icon: FilePlus2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
}

/** Desktop sidebar nav — highlights the current section. */
export function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="mt-4 flex flex-1 flex-col gap-1" aria-label="Dashboard">
      {nav.map((n) => {
        const active = isActive(pathname, n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active ? "bg-brand/10 text-brand" : "text-ink-soft hover:bg-ink/5 hover:text-ink"
            }`}
          >
            <n.icon size={18} aria-hidden /> {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Mobile top bar nav — same active-state logic, compact layout. */
export function MobileNav() {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-1.5 border-b border-ink/5 bg-surface p-3 sm:hidden">
      {nav.map((n) => {
        const active = isActive(pathname, n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              active ? "bg-brand/10 text-brand" : "text-ink-soft hover:bg-ink/5"
            }`}
          >
            {n.label}
          </Link>
        );
      })}
    </div>
  );
}
