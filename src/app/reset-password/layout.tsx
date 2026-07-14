import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Set a new password",
  description: "Set a new password for your ClauseLens account.",
  alternates: { canonical: `${site.url}/reset-password` },
  robots: { index: false },
  openGraph: { title: `Set a new password · ${site.name}`, description: "Set a new password for your ClauseLens account." },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
