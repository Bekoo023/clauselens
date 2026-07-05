import Link from "next/link";
import { ScanSearch } from "lucide-react";

/** Split-screen shell shared by login & register. */
export function AuthShell({ title, subtitle, children }: {
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden flex-col justify-between bg-ink-fixed p-10 text-white lg:flex">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-bright">
            <ScanSearch size={18} aria-hidden />
          </span>
          <span className="h-display text-lg text-white">ClauseLens</span>
        </Link>
        <blockquote className="max-w-md">
          <p className="text-2xl font-semibold leading-snug">
            “Caught an unlimited liability clause in a €40k contract. Paid for itself a hundred times over.”
          </p>
          <footer className="mt-4 text-sm text-white/60">— Freelance product designer</footer>
        </blockquote>
        <p className="text-xs text-white/40">Information, not legal advice.</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-5 py-14">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center gap-2 font-bold lg:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-bright text-white">
              <ScanSearch size={18} aria-hidden />
            </span>
            <span className="h-display text-lg">ClauseLens</span>
          </Link>
          <h1 className="h-display text-2xl">{title}</h1>
          <p className="mt-1.5 text-sm text-ink-soft">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
