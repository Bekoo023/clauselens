"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Site-wide smooth (inertia) scrolling. Mounted once in the root layout.
 * Renders nothing — Lenis hijacks wheel/touch input and eases native
 * scrollTop, so IntersectionObserver-based reveals and anchor links keep
 * working untouched. Skipped entirely under prefers-reduced-motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    let frame: number;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
