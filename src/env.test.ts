import { describe, expect, it } from "vitest";

import { parseEnv } from "./env";

const valid = {
  NODE_ENV: "production",
  DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
};

describe("parseEnv", () => {
  it("accepts a valid environment", () => {
    expect(parseEnv(valid)).toEqual(valid);
  });

  it("defaults NODE_ENV to development", () => {
    expect(parseEnv({ ...valid, NODE_ENV: undefined }).NODE_ENV).toBe(
      "development",
    );
  });

  it("throws a readable error for invalid values", () => {
    expect(() => parseEnv({ ...valid, NODE_ENV: "staging" })).toThrow(
      /Invalid environment variables[\s\S]*NODE_ENV/,
    );
  });

  it("requires DATABASE_URL", () => {
    expect(() => parseEnv({ ...valid, DATABASE_URL: undefined })).toThrow(
      /DATABASE_URL/,
    );
  });

  it("rejects a DATABASE_URL that isn't a Postgres URL", () => {
    expect(() =>
      parseEnv({ ...valid, DATABASE_URL: "mysql://user:pass@localhost/db" }),
    ).toThrow(/DATABASE_URL/);
  });
});
