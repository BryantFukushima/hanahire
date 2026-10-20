import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { env } from "@/env";
import { PrismaClient } from "@/generated/prisma/client";

function createClient() {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
  });
}

// Next.js hot reload re-runs this module on every save. Caching the client on globalThis in
// development keeps one connection pool instead of opening a new one per reload.
const globalForDb = globalThis as unknown as { db?: PrismaClient };

export const db = globalForDb.db ?? createClient();

if (env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
