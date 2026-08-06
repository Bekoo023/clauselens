"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FilePlus2, Files, Settings } from "lucide-react";

// Defined here (not passed as a prop) because Lucide icon components are
// functions: passing them from the server layout to this client component
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

/** Desktop sidebar nav: highlights the current section. */
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
            className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
              active
                ? "bg-brand/10 text-brand shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-brand)_20%,transparent)]"
                : "text-ink-soft hover:bg-ink/5 hover:text-ink"
            }`}
          >
            {/* Left rail marker, grows in on the active item. */}
            <span
              aria-hidden
              className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-brand to-brand-bright transition-transform duration-500 ${
                active ? "scale-y-100" : "scale-y-0"
              }`}
            />
            <n.icon
              size={18}
              aria-hidden
              className="transition-transform duration-300 group-hover:scale-110"
            />{" "}
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Mobile top bar nav: even-width tab bar with icons, mirrors the desktop sidebar. */
export function MobileNav() {
  const pathname = usePathname();
  return (
    <div className="sticky top-0 z-30 flex items-stretch gap-1 border-b border-ink/5 bg-surface/95 p-2 sm:hidden">
      {nav.map((n) => {
        const active = isActive(pathname, n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium transition-all duration-300 ${
              active
                ? "bg-brand/10 text-brand shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-brand)_20%,transparent)]"
                : "text-ink-soft hover:bg-ink/5"
            }`}
          >
            <n.icon
              size={18}
              aria-hidden
              className={`transition-transform duration-300 ${active ? "scale-110" : ""}`}
            />
            {n.label}
          </Link>
        );
      })}
    </div>
  );
}
