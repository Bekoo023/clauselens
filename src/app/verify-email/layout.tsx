import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Verify your email",
  description: "Confirm your email address to unlock contract analysis on ClauseLens.",
  alternates: { canonical: `${site.url}/verify-email` },
  robots: { index: false },
  openGraph: { title: "Verify your email · ClauseLens", description: "Confirm your email address to unlock contract analysis on ClauseLens." },
};

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
