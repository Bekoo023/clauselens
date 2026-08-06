"use client";

import { useEffect, useRef } from "react";

type Variant = "up" | "left" | "right" | "scale";

const variantClass: Record<Variant, string> = {
  up: "",
  left: "reveal-left",
  right: "reveal-right",
  scale: "reveal-scale",
};

/**
 * Scroll-triggered reveal (IntersectionObserver).
 *
 * `delay` staggers siblings across a mapped grid. It is set as a CSS custom
 * property so the easing itself stays in globals.css.
 */
export function Reveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${variantClass[variant]} ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
