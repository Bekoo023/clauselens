import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — plans for freelancers, agencies and startups",
  description:
    "Start free with one contract analysis per month. Upgrade to Pro from €24/month or Business from €66/month for unlimited reviews, playbooks and team seats.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
