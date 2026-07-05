import Link from "next/link";
import { redirect } from "next/navigation";
import { FilePlus2, Files, ScanSearch, Settings } from "lucide-react";
import { auth, signOut } from "@/lib/auth";

const nav = [
  { href: "/dashboard", label: "Contracts", icon: Files },
  { href: "/dashboard/new", label: "New analysis", icon: FilePlus2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-60 flex-col border-r border-ink/5 bg-surface p-4 sm:flex">
        <Link href="/" className="flex items-center gap-2 px-2 py-3 font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-bright text-white">
            <ScanSearch size={18} aria-hidden />
          </span>
          <span className="h-display text-lg">ClauseLens</span>
        </Link>
        <nav className="mt-4 flex flex-1 flex-col gap-1" aria-label="Dashboard">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-ink/5 hover:text-ink">
              <n.icon size={18} aria-hidden /> {n.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-ink/5 pt-3">
          <p className="truncate px-3 text-xs text-ink-soft">{session.user.email}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-ink-soft hover:bg-ink/5">
              Log out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1">
        {/* Mobile top bar */}
        <div className="flex items-center gap-2 border-b border-ink/5 bg-surface p-3 sm:hidden">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink-soft hover:bg-ink/5">
              {n.label}
            </Link>
          ))}
        </div>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
