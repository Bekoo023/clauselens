"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

const LIGHT_BG = "#f8fafc"; // --color-paper (light)
const DARK_BG = "#0b1120"; // --color-paper (dark)

/**
 * Native-shell chrome: mounted once in the root layout, no-ops entirely on
 * the web. Reserves its own space for the status bar (rather than letting
 * the WebView draw under it) so no page needs manual safe-area padding, and
 * keeps its color/text style in sync with the app's own light/dark theme.
 */
export function NativeChrome() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    async function applyTheme(isDark: boolean) {
      try {
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
        // Android-only; no-ops harmlessly on iOS.
        await StatusBar.setBackgroundColor({ color: isDark ? DARK_BG : LIGHT_BG });
      } catch {
        // Status bar APIs can be unavailable in some WebView contexts; the
        // rest of the app functions fine without them.
      }
    }

    applyTheme(media.matches);
    const onChange = (e: MediaQueryListEvent) => applyTheme(e.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return null;
}
