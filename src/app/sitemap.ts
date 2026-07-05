import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog";
import { CONTRACT_TYPES } from "@/lib/contract-types";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/features", "/pricing", "/blog", "/review", "/faq", "/contact", "/privacy", "/terms"];
  return [
    ...staticPages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly" as const })),
    ...CONTRACT_TYPES.map((t) => ({
      url: `${site.url}/review/${t.slug}`,
      changeFrequency: "monthly" as const,
    })),
    ...posts.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: p.date,
      changeFrequency: "monthly" as const,
    })),
  ];
}
