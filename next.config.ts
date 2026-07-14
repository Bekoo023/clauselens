import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

function buildCsp(): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    // Next's own runtime is external <script src> chunks (script-src 'self'
    // covers it); JSON-LD <script type="application/ld+json"> data blocks
    // aren't executable scripts, so they aren't subject to script-src.
    "script-src": ["'self'", ...(isProd ? [] : ["'unsafe-eval'"])],
    // Tailwind is static at build time, but a few components set dynamic
    // inline `style` attributes (progress bars, gauges) — those need
    // 'unsafe-inline' in style-src specifically (not script-src).
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "img-src": ["'self'", "data:"],
    // The <link rel="preconnect"> hints in the root layout for Google Fonts
    // are governed by connect-src too, not just style-src/font-src.
    "connect-src": ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
    "frame-src": ["'self'"],
    "frame-ancestors": ["'none'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
  };

  const csp = Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join("; ");

  return isProd ? `${csp}; upgrade-insecure-requests` : csp;
}

const nextConfig: NextConfig = {
  // Security headers for every route
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: buildCsp() },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",
          },
          ...(isProd
            ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
