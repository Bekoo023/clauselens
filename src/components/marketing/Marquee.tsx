import Link from "next/link";
import { CONTRACT_TYPES } from "@/lib/contract-types";

/**
 * Slow horizontal ticker of the contract types the analyzer covers.
 *
 * The list is rendered twice and the track slides exactly half its own width,
 * so the loop point is invisible. Pure CSS from there, one composited
 * transform, and it pauses while the pointer is over it.
 *
 * The duplicate copy is hidden from screen readers so the links are not
 * announced twice.
 */
export function Marquee() {
  const items = CONTRACT_TYPES.map((t) => ({ slug: t.slug, name: t.name }));

  return (
    <div className="marquee py-2">
      <div className="marquee-track gap-3">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-3 pr-3" aria-hidden={copy === 1}>
            {items.map((t) => (
              <Link
                key={t.slug}
                href={`/review/${t.slug}`}
                tabIndex={copy === 1 ? -1 : undefined}
                className="rounded-full border border-ink/10 bg-surface/70 px-4 py-2 text-sm font-medium whitespace-nowrap text-ink-soft transition-colors duration-300 hover:border-brand/40 hover:text-ink"
              >
                {t.name}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
