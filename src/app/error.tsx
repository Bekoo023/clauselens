"use client";

import { useEffect } from "react";
import Link from "next/link";
import { OctagonAlert } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-risk-high/10 text-risk-high">
        <OctagonAlert size={26} aria-hidden />
      </span>
      <p className="eyebrow mt-6 text-risk-high">Something went wrong</p>
      <h1 className="h-display mt-2 text-3xl sm:text-4xl">Unexpected error</h1>
      <p className="mt-3 max-w-sm text-ink-soft">
        This has been logged. Try again, or head back home if it keeps happening.
      </p>
      <div className="mt-7 flex gap-3">
        <button onClick={reset} className="btn btn-primary">Try again</button>
        <Link href="/" className="btn btn-ghost">Back to home</Link>
      </div>
    </div>
  );
}
