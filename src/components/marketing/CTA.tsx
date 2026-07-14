import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="container-page pb-24">
      <div className="card relative overflow-hidden bg-ink-fixed p-10 text-center sm:p-16">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-brand/30 blur-3xl" aria-hidden />
        <h2 className="h-display relative text-3xl text-white sm:text-4xl">
          Your next contract deserves a second pair of eyes
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-white/70">
          Analyze your first contract free. No credit card, no legal jargon just clarity in 60 seconds.
        </p>
        <div className="relative mt-8">
          <Link href="/register" className="btn btn-primary text-base">
            Analyze a contract free <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
