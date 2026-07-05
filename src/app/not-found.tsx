import Link from "next/link";
import { ScanSearch } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-bright text-white">
        <ScanSearch size={26} aria-hidden />
      </span>
      <p className="eyebrow mt-6">404</p>
      <h1 className="h-display mt-2 text-3xl sm:text-4xl">This page didn&apos;t make it through review</h1>
      <p className="mt-3 max-w-sm text-ink-soft">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link href="/" className="btn btn-primary mt-7">Back to home</Link>
    </div>
  );
}
