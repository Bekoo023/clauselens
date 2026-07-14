import { describe, it, expect } from "vitest";
import { normalizeEmail } from "@/lib/normalize-email";

describe("normalizeEmail", () => {
  it("lowercases and trims", () => {
    expect(normalizeEmail("  Foo@BAR.com  ")).toBe("foo@bar.com");
  });

  it("makes case/whitespace variants resolve to the same value", () => {
    expect(normalizeEmail("User@Example.com")).toBe(normalizeEmail(" user@example.com"));
  });

  it("is a no-op for an already-normalized email", () => {
    expect(normalizeEmail("user@example.com")).toBe("user@example.com");
  });
});
