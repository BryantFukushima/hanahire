import { describe, expect, it } from "vitest";

import { isEmailAllowed } from "./allowlist";

const allowed = ["dev@example.com", "owner@example.com"];

describe("isEmailAllowed", () => {
  it("allows a listed email", () => {
    expect(isEmailAllowed("dev@example.com", allowed)).toBe(true);
  });

  it("ignores case and surrounding whitespace", () => {
    expect(isEmailAllowed("  Dev@Example.COM ", allowed)).toBe(true);
  });

  it("rejects an unlisted email", () => {
    expect(isEmailAllowed("someone@example.com", allowed)).toBe(false);
  });

  it("rejects everything when the list is empty", () => {
    expect(isEmailAllowed("dev@example.com", [])).toBe(false);
  });
});
