import { z } from "zod";

// Every environment variable the app reads is declared here. Add new ones to
// this schema and to .env.example so a missing value fails at startup, not in production.
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),

  // Better Auth: signs session cookies and encrypts stored OAuth tokens.
  // Generate with `openssl rand -base64 32`.
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),

  // Comma-separated emails allowed to sign in, e.g. "a@x.com, b@y.com".
  ALLOWED_EMAILS: z
    .string()
    .transform((value) =>
      value
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
    )
    .pipe(z.array(z.email()).min(1)),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    throw new Error(
      `Invalid environment variables:\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}

// Imported by next.config.ts, so `pnpm dev` and `pnpm build` fail fast on bad config.
export const env = parseEnv(process.env);
