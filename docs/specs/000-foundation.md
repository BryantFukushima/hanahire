# 000: Foundation

| Field   | Value                            |
| ------- | -------------------------------- |
| Status  | In progress                      |
| Phase   | 0 (see [ROADMAP](../ROADMAP.md)) |
| Owner   | @BryantFukushima                 |
| Updated | 2026-10-19                       |

## Context

Before any features, HanaHire needs a working, tested, deployable skeleton: an app, a database,
sign-in, CI, and the docs that tell humans and AI agents how to work in the repo.
Stack decision: [ADR 0001](../adr/0001-use-typescript-nextjs-stack.md).

## Goals

- Contributor docs and workflow (`AGENTS.md`, `CLAUDE.md`, specs, ADRs, PR template)
- A Next.js + TypeScript app that lints, typechecks, tests, and builds
- CI that runs those checks on every PR
- Local Postgres with Prisma migrations
- Sign-in, plus a helper that scopes data access to the current user

## Non-goals

- Any HanaHire feature (resume upload etc. starts in Phase 1)
- Production deployment (Phase 8)
- UI design system beyond Tailwind defaults

## Requirements

- **R1:** `pnpm dev` starts the app locally with a placeholder home page.
- **R2:** `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` all pass on a fresh clone.
- **R3:** The app fails fast with a clear error if required env vars are missing.
- **R4:** CI runs R2's checks on every PR and blocks merging on failure.
- **R5:** `pnpm db:up && pnpm db:migrate` gives a working local database.
- **R6:** A user can sign in and out with Google or GitHub. Protected pages redirect signed-out users.
- **R7:** Only emails on an allowlist (env var) can sign in. Everyone else sees a clear "not invited" message.

## Acceptance criteria

- [ ] R1–R6 are met
- [ ] `.env.example` lists every required variable
- [ ] README "Getting started" explains setup from a fresh clone

## Design

To be detailed per PR during planning. Initial direction:

- `src/` layout with `src/app` (routes), `src/lib` (shared code), `src/server` (server-only code)
- `src/env.ts`: Zod schema for env vars, imported at startup
- `docker-compose.yml`: Postgres for local development
- `prisma/schema.prisma`: `User` (fields match Better Auth's core user model) + the auth library's
  session/account tables in 0.5
- `src/server/db.ts`: single server-only Prisma client (Prisma 7, `@prisma/adapter-pg`)
- Auth: Google + GitHub OAuth, with an email allowlist to control access and LLM cost.
  Library decided in ADR 0002 during PR 0.5 planning (leaning Better Auth, since Auth.js is now
  maintained by the Better Auth team).
- Node.js: latest **LTS** release, pinned in `.nvmrc` and `package.json` `engines`.

## Security and privacy

- No secrets in the repo. `.env` is gitignored, and `.env.example` holds placeholders only.
- Every data-access helper requires a user id. No unscoped queries.

## Testing

- Vitest smoke test in 0.2; env validation tests; auth helper tests in 0.5

## Tasks / PR breakdown

- [x] **PR 0.1: Project docs** (branch `phase-0/project-docs`)
- [x] **PR 0.2: Scaffold app** (branch `phase-0/0.2-scaffold`)
- [x] **PR 0.3: CI** (branch `phase-0/0.3-ci`)
- [x] **PR 0.4: Database** (branch `phase-0/0.4-database`)
- [x] **PR 0.5: Auth** (branch `phase-0/0.5-auth`)
- [ ] **PR 0.6: Security policy** (branch `phase-0/0.6-security-policy`): `SECURITY.md`

## Open questions

- Follow-up: bump Node 24 → 26 in a small chore PR once 26 becomes LTS (2026-10-28). Update
  `.nvmrc`, `engines`, and `@types/node` together (Dependabot ignores `@types/node` majors).

## Progress log

- 2026-10-19: Spec drafted. Stack chosen (ADR 0001).
- 2026-10-19: PR 0.1 adds agent instructions (`AGENTS.md`, `CLAUDE.md`), roadmap, spec/ADR structure, and PR template.
- 2026-10-19: Resolved: Google + GitHub providers with email allowlist; latest Node LTS.
- 2026-10-19: Spec approved.
- 2026-10-19: PR 0.2 scaffolds Next.js 16.4 (App Router, Tailwind v4, Turbopack), Vitest, Prettier, and Zod env validation. Pinned Node 24 LTS (bump to 26 after it becomes LTS on 2026-10-28) and TypeScript 6.0.3 (typescript-eslint doesn't support TS 7 yet).
- 2026-10-19: PR 0.3 adds GitHub Actions CI (`pnpm check` on PRs and pushes to `main`, actions pinned to SHAs) and Dependabot (weekly, grouped). The `check` job becomes a required status check in the `protect-main` ruleset after merge.
- 2026-10-19: PR 0.4 adds Postgres 18 via Docker Compose, Prisma 7.10.1 (pinned stable; npm `latest` points at an 8.0 RC), the `User` model + init migration, seed script, `db:*` scripts, and a Postgres service in CI. Local env file is now `.env` (Prisma's CLI doesn't read `.env.local`). Prisma 7 changes handled: `migrate dev`/`migrate reset` no longer generate or seed automatically.
- 2026-10-19: PR 0.5 adds Better Auth 1.7.10 (ADR 0002): Google + GitHub sign-in, email allowlist enforced in database hooks (new users and every new session), encrypted OAuth access/refresh tokens, ID tokens not stored, 3-day idle sessions, `requireUser()`, sign-in and dashboard pages, and an optimistic `proxy.ts`. Session tokens are stored unhashed in `session` (Better Auth default), mitigated by short expiry and revocation.
