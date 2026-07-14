import { randomBytes, createHash } from "crypto";

// Shared helpers for one-time tokens (password reset, email verification):
// only the SHA-256 hash of a token is ever persisted. The raw token exists
// only in the URL we email to the user and is never logged or stored.

export function generateRawToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}
