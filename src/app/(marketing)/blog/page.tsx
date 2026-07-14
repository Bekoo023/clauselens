import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/blog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog — contract clauses explained in plain language",
  description:
    "Guides, checklists and clause explainers for freelancers, agencies and startups. Understand every contract before you sign.",
  alternates: { canonical: `${site.url}/blog` },
  openGraph: {
    title: `Blog · ${site.name}`,
    description: "Guides, checklists and clause explainers for freelancers, agencies and startups.",
  },
};

export default function BlogPage() {
  return (
    <section className="container-page py-16 sm:py-20">
      <p className="eyebrow">Blog</p>
      <h1 className="h-display mt-4 max-w-2xl text-4xl sm:text-5xl">
        Contracts, translated
      </h1>
      <p className="mt-4 max-w-xl text-lg text-ink-soft">
        Clause explainers, red-flag guides and checklists — written for people
        who sign contracts, not people who draft them.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="card card-hover flex h-full flex-col p-7">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand">
              {p.category}
            </span>
            <h2 className="mt-3 text-lg font-semibold leading-snug">{p.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{p.description}</p>
            <p className="mt-4 text-xs text-ink-soft">
              {new Date(p.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · {p.readingTime}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
