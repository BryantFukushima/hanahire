import { z } from "zod";

// Every environment variable the app reads is declared here. Add new ones to
// this schema and to .env.example so a missing value fails at startup, not in production.
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
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
