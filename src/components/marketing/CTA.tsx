import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="container-page pb-24">
      <div className="card relative overflow-hidden border-white/10 bg-ink-fixed p-10 text-center sm:p-16">
        {/* Two offset blooms, painted as gradients so no blur filter is needed. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(32rem 20rem at 32% -5%, rgb(91 91 214 / 0.55), transparent 70%), radial-gradient(26rem 18rem at 100% 105%, rgb(34 211 238 / 0.28), transparent 70%)",
          }}
          aria-hidden
        />
        {/* Faint grid, masked out toward the edges. */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(255 255 255) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent 80%)",
          }}
          aria-hidden
        />

        <h2 className="h-display relative text-3xl text-white sm:text-4xl lg:text-5xl">
          Your next contract deserves{" "}
          <span className="bg-gradient-to-r from-brand-bright to-accent bg-clip-text text-transparent">
            a second pair of eyes
          </span>
        </h2>
        <p className="relative mx-auto mt-5 max-w-xl text-white/70">
          Analyze your first contract free. No credit card, no legal jargon, just clarity in 60 seconds.
        </p>
        <div className="relative mt-9">
          <Link href="/register" className="btn btn-primary group text-base">
            Analyze a contract free
            <ArrowRight size={18} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
