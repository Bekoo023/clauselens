import { describe, it, expect } from "vitest";
import { isSessionVersionStale } from "@/lib/session-version";

describe("isSessionVersionStale", () => {
  it("is not stale when the DB version matches the token", () => {
    expect(isSessionVersionStale(2, 2)).toBe(false);
  });

  it("is stale when a password reset bumped the DB version past the token's", () => {
    expect(isSessionVersionStale(3, 2)).toBe(true);
  });

  it("is stale when the user no longer exists (DB lookup returns undefined)", () => {
    expect(isSessionVersionStale(undefined, 0)).toBe(true);
  });

  it("is stale when the DB value is explicitly null", () => {
    expect(isSessionVersionStale(null, 0)).toBe(true);
  });
});
