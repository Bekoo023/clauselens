"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { signIn } from "next-auth/react";
import { ExternalLink } from "lucide-react";
import { site } from "@/lib/site";

/**
 * Google blocks OAuth sign-in inside embedded WebViews (the "disallowed_useragent"
 * error): which is exactly what the Capacitor native app uses to load the site.
 * Rather than ship a button that silently fails on iOS/Android, detect the native
 * runtime and send the user to Google sign-in in their system browser instead,
 * where it works normally.
 */
export function GoogleSignInButton({ callbackUrl }: { callbackUrl: string }) {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  if (isNative) {
    return (
      <a
        href={`${site.url}/login`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn w-full border border-ink/15 hover:bg-ink/5"
      >
        <ExternalLink size={16} aria-hidden /> Continue with Google (opens in browser)
      </a>
    );
  }

  return (
    <button onClick={() => signIn("google", { callbackUrl })} className="btn w-full border border-ink/15 hover:bg-ink/5">
      Continue with Google
    </button>
  );
}
