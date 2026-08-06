import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.clauselens.app',
  appName: 'ClauseLens',
  // Deliberately not Next's `public/`. Anything in there is served at the site
  // root, so the shell's manifest.webmanifest collided with the one generated
  // by src/app/manifest.ts and returned a 500.
  webDir: 'capacitor/www',
  // ClauseLens is a server-rendered Next.js app (API routes, auth, Postgres,
  // Stripe webhooks), so it can't be statically exported into webDir. The
  // native shell loads the live production site directly; webDir only needs to
  // exist to satisfy Capacitor's build-time check.
  server: {
    url: 'https://clauselens.org',
    cleartext: false,
  },
};

export default config;
