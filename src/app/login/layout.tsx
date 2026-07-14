import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your ClauseLens account to review your contracts.",
  alternates: { canonical: `${site.url}/login` },
  openGraph: { title: `Log in · ${site.name}`, description: "Log in to your ClauseLens account to review your contracts." },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
