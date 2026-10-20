import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  test: {
    environment: "node",
    // Unit tests don't read .env. Provide placeholder values for variables src/env.ts requires.
    env: {
      DATABASE_URL: "postgresql://test:test@localhost:5432/test",
    },
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
