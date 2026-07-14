import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about plans, Enterprise, partnerships or press — the ClauseLens team replies within one business day.",
  alternates: { canonical: `${site.url}/contact` },
  openGraph: {
    title: `Contact · ${site.name}`,
    description: "Questions about plans, Enterprise, partnerships or press — the ClauseLens team replies within one business day.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
