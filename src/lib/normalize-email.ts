// Central email normalization: every DB lookup or write keyed by email must
// go through this so "Foo@Bar.com" and " foo@bar.com " resolve to one account.
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
