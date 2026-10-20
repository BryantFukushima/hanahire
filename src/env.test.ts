import { describe, expect, it } from "vitest";

import { parseEnv } from "./env";

describe("parseEnv", () => {
  it("accepts a valid environment", () => {
    expect(parseEnv({ NODE_ENV: "production" })).toEqual({
      NODE_ENV: "production",
    });
  });

  it("defaults NODE_ENV to development", () => {
    expect(parseEnv({}).NODE_ENV).toBe("development");
  });

  it("throws a readable error for invalid values", () => {
    expect(() => parseEnv({ NODE_ENV: "staging" })).toThrow(
      /Invalid environment variables[\s\S]*NODE_ENV/,
    );
  });
});
