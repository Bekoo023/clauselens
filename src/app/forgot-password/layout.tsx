import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Request a password reset link for your ClauseLens account.",
  alternates: { canonical: `${site.url}/forgot-password` },
  robots: { index: false },
  openGraph: { title: `Reset your password · ${site.name}`, description: "Request a password reset link for your ClauseLens account." },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
