export { auth as middleware } from "@/lib/auth";

// Protect the app area; marketing pages stay public
export const config = {
  matcher: ["/dashboard/:path*"],
};
