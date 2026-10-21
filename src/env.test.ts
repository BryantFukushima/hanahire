import { describe, expect, it } from "vitest";

import { parseEnv } from "./env";

const valid = {
  NODE_ENV: "production",
  DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
  BETTER_AUTH_SECRET: "a-secret-that-is-at-least-32-characters",
  BETTER_AUTH_URL: "http://localhost:3000",
  GOOGLE_CLIENT_ID: "google-id",
  GOOGLE_CLIENT_SECRET: "google-secret",
  GITHUB_CLIENT_ID: "github-id",
  GITHUB_CLIENT_SECRET: "github-secret",
  ALLOWED_EMAILS: "dev@example.com",
};

describe("parseEnv", () => {
  it("accepts a valid environment", () => {
    expect(parseEnv(valid)).toEqual({
      ...valid,
      ALLOWED_EMAILS: ["dev@example.com"],
    });
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

  it("rejects a BETTER_AUTH_SECRET shorter than 32 characters", () => {
    expect(() => parseEnv({ ...valid, BETTER_AUTH_SECRET: "short" })).toThrow(
      /BETTER_AUTH_SECRET/,
    );
  });

  it("parses ALLOWED_EMAILS into a trimmed, lowercased list", () => {
    expect(
      parseEnv({ ...valid, ALLOWED_EMAILS: " A@Example.com, b@example.com ,," })
        .ALLOWED_EMAILS,
    ).toEqual(["a@example.com", "b@example.com"]);
  });

  it("rejects ALLOWED_EMAILS with an invalid email", () => {
    expect(() =>
      parseEnv({ ...valid, ALLOWED_EMAILS: "dev@example.com,not-an-email" }),
    ).toThrow(/ALLOWED_EMAILS/);
  });

  it("rejects an empty ALLOWED_EMAILS", () => {
    expect(() => parseEnv({ ...valid, ALLOWED_EMAILS: " , " })).toThrow(
      /ALLOWED_EMAILS/,
    );
  });
});
