import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Create a free ClauseLens account and get your first contract risk analysis in under a minute.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
