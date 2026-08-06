"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up to `to` the first time it scrolls into view, then stops.
 *
 * The animation is a finite rAF sequence, not a standing loop, and the
 * observer disconnects after the first hit.
 *
 * The server renders the final number, so the HTML is correct without
 * JavaScript and the layout never jumps. Only once mounted does it drop to
 * zero and count, which also means reduced-motion users simply keep the
 * finished value.
 */
export function CountUp({
  to,
  suffix = "",
  duration = 1100,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || to === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setValue(0);

    let frame = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // Ease out, so it decelerates into the final number.
          setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, duration]);

  return (
    <span ref={ref}>
      {value ?? to}
      {suffix}
    </span>
  );
}
