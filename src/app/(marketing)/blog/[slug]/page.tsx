import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPost, posts } from "@/lib/blog";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: "article" },
    alternates: { canonical: `${site.url}/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: site.name },
  };

  return (
    <article className="container-page max-w-3xl py-16 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
        <ArrowLeft size={14} aria-hidden /> All posts
      </Link>
      <p className="eyebrow mt-6">{post.category}</p>
      <h1 className="h-display mt-3 text-3xl leading-tight sm:text-4xl">{post.title}</h1>
      <p className="mt-3 text-sm text-ink-soft">
        {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · {post.readingTime} read
      </p>

      <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-ink">
        {post.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {/* Inline conversion CTA */}
      <div className="card mt-12 flex flex-col items-start gap-4 bg-ink-fixed p-8 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">Reading a contract right now?</p>
          <p className="mt-1 text-sm text-white/70">Run it through ClauseLens first. Analysis is free.</p>
        </div>
        <Link href="/register" className="btn btn-primary shrink-0">
          Analyze it free <ArrowRight size={16} aria-hidden />
        </Link>
      </div>

      {related.length > 0 && (
        <aside className="mt-14">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Related posts</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="card card-hover p-5">
                <p className="font-semibold leading-snug">{p.title}</p>
                <p className="mt-2 text-xs text-ink-soft">{p.readingTime} read</p>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </article>
  );
}
