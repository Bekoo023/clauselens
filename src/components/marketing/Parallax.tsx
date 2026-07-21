"use client";

import { useEffect, useRef } from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & { speed?: number };

/**
 * Purely decorative depth cue: translates its own element by a fraction of
 * scroll position. Used on background layers (dot-grid, blur blobs), never
 * on content, so it can't affect layout or reading order. No-ops under
 * prefers-reduced-motion.
 */
export function Parallax({ speed = 0.1, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame: number;
    const update = () => {
      if (ref.current) ref.current.style.transform = `translate3d(0, ${window.scrollY * speed}px, 0)`;
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [speed]);

  return <div ref={ref} {...rest} />;
}
