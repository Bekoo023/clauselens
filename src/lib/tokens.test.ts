import { describe, it, expect } from "vitest";
import { generateRawToken, hashToken } from "@/lib/tokens";

describe("tokens", () => {
  it("generates sufficiently long, unique raw tokens", () => {
    const a = generateRawToken();
    const b = generateRawToken();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThanOrEqual(64); // 32 bytes hex-encoded
  });

  it("hashes deterministically (same input -> same hash)", () => {
    const raw = generateRawToken();
    expect(hashToken(raw)).toBe(hashToken(raw));
  });

  it("never stores the raw token as its own hash", () => {
    const raw = generateRawToken();
    expect(hashToken(raw)).not.toBe(raw);
  });

  it("produces different hashes for different tokens", () => {
    const a = generateRawToken();
    const b = generateRawToken();
    expect(hashToken(a)).not.toBe(hashToken(b));
  });
});
