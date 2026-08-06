"use client";

import { useEffect, useRef } from "react";

/**
 * Thin progress bar across the top of the page.
 *
 * Writes straight to the element's style instead of through React state, so a
 * scroll never triggers a render. The listener is passive and coalesced into
 * one animation frame, and there is no standing rAF loop.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let queued = false;

    const write = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      el.style.transform = `scaleX(${pct})`;
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(write);
    };

    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div ref={ref} className="scroll-progress print-hidden" aria-hidden />;
}
