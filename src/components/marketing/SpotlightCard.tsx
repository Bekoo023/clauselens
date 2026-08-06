"use client";

import { useRef } from "react";

/**
 * Card that lights up under the cursor.
 *
 * The highlight itself is a pseudo-element (see `.spotlight` in globals.css);
 * this only writes the pointer position into two custom properties. Writing
 * them directly rather than through state keeps a pointermove off the React
 * render path, and the handler is bound to the card, so nothing runs unless
 * the pointer is actually over one.
 */
export function SpotlightCard({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const queued = useRef(false);

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || queued.current) return;
    const { clientX, clientY } = e;
    queued.current = true;
    requestAnimationFrame(() => {
      queued.current = false;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - r.left}px`);
      el.style.setProperty("--my", `${clientY - r.top}px`);
    });
  }

  return (
    <div ref={ref} onPointerMove={onPointerMove} className={`spotlight ${className}`}>
      {children}
    </div>
  );
}
