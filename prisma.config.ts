import "dotenv/config";

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Read directly instead of with Prisma's env() helper, which throws when the variable is
    // missing. That would break `prisma generate` (run on every install) on a fresh clone.
    url: process.env.DATABASE_URL,
  },
});
