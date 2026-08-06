import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/lib/site";
import { NativeChrome } from "@/components/NativeChrome";
import { AuroraBackdrop } from "@/components/AuroraBackdrop";
import { ScrollProgress } from "@/components/ScrollProgress";
import "./globals.css";

// Self-hosted at build time. Replaces a render-blocking <link> to
// fonts.googleapis.com plus two preconnects on every page load.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: AI contract review in 60 seconds`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "contract review AI",
    "NDA checker",
    "freelance contract review",
    "contract risk analysis",
    "AI legal assistant",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name}: ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: { card: "summary_large_image", site: site.twitter },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bricolage.variable} ${jetbrains.variable}`}
    >
      <body>
        <AuroraBackdrop />
        <ScrollProgress />
        <NativeChrome />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
