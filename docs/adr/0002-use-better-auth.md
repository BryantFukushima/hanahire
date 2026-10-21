# 0002: Use Better Auth for authentication

- **Status:** Accepted
- **Date:** 2026-10-19
- **Deciders:** @BryantFukushima

## Context and problem

HanaHire stores sensitive personal data (resumes, salary preferences, application history) and makes
paid Claude API calls, so every user must be signed in. Phase 0 settled the requirements: sign-in
with **Google and GitHub**, an **email allowlist** to control early access and LLM cost, and
sessions the server can validate and revoke. The library has to work with Next.js 16 (App Router),
Prisma 7, and PostgreSQL. It should also keep user data in our own database, in line with the
"your data stays yours" principle.

## Options considered

1. **Better Auth:** a TypeScript-first, framework-agnostic auth library.
   - Pros:
     - Actively developed (1.7.x as of October 2026).
     - Official Next.js and Prisma adapters, with Next 16, Prisma 7, and Zod 4 in its supported versions.
     - Database-backed sessions stored in our Postgres.
     - Database hooks for custom rules (the allowlist), and a plugin system (passkeys, 2FA, etc.) for later.
   - Cons:
     - Younger than Auth.js, with fewer community answers for edge cases.
2. **Auth.js (NextAuth):** the long-standing default for Next.js.
   - Pros: widely known, with many tutorials.
   - Cons:
     - Maintained by the Better Auth team since September 2025 and in security-only maintenance.
     - The stable package is still v4. The App Router-oriented v5 never left beta (`5.0.0-beta.32`).
     - The maintainers themselves recommend Better Auth for new projects.
3. **Hosted auth (Clerk, Supabase Auth):** managed services with prebuilt UI.
   - Pros: fastest setup, with security handled by the vendor.
   - Cons:
     - User records live with a third party.
     - Per-user pricing as the product grows, plus vendor lock-in.
     - Less to learn about how auth actually works.

## Decision

We chose **Better Auth**. It's the actively maintained option that fits the stack, keeps user and
session data in our own Postgres, and supports the server-side allowlist through database hooks.
Auth.js isn't a good base for a new project now that it only gets security fixes, and hosted
services conflict with the data-ownership principle.

Better Auth is pinned to an exact version (`1.7.10`) and updated through Dependabot, which keeps
the cooldown before new releases.

## Consequences

- Good:
  - Sessions are rows in our database, so they can be revoked instantly. Cookies are HTTP-only.
  - No passwords are stored (OAuth only). OAuth access and refresh tokens from Google and GitHub
    are encrypted at rest with `BETTER_AUTH_SECRET` (off by default in Better Auth, turned on here),
    so a database leak doesn't expose tokens that could be used against users' accounts.
  - Auth tables (`user`, `session`, `account`, `verification`) live in `prisma/schema.prisma` with
    the rest of the data model and go through normal migrations.
  - The allowlist is enforced server-side in database hooks, on both sign-up and every new session.
  - Passkeys, magic links, or 2FA can be added later as plugins.
- Bad / trade-offs:
  - We own more of the auth surface than with a hosted service: secrets, OAuth app configuration,
    and keeping the library patched.
  - Rotating `BETTER_AUTH_SECRET` needs care, because it also decrypts the stored OAuth tokens (use
    Better Auth's versioned secrets rather than replacing the value).
  - Smaller ecosystem than Auth.js.
- Follow-ups:
  - Production needs separate OAuth apps (GitHub allows one callback URL per app) and a published
    Google consent screen (Phase 8).
  - Revisit the allowlist once there's real cost control and HanaHire opens to more users.
