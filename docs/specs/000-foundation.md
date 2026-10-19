# 000: Foundation

| Field   | Value                                  |
| ------- | -------------------------------------- |
| Status  | Draft                                  |
| Phase   | 0 (see [ROADMAP](../ROADMAP.md))       |
| Owner   | @BryantFukushima                       |
| Updated | 2026-10-19                             |

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
- **R6:** A user can sign in and out. Protected pages redirect signed-out users.

## Acceptance criteria

- [ ] R1–R6 are met
- [ ] `.env.example` lists every required variable
- [ ] README "Getting started" explains setup from a fresh clone

## Design

To be detailed per PR during planning. Initial direction:

- `src/` layout with `src/app` (routes), `src/lib` (shared code), `src/server` (server-only code)
- `src/env.ts`: Zod schema for env vars, imported at startup
- `docker-compose.yml`: Postgres for local development
- `prisma/schema.prisma`: `User` (+ Auth.js tables)
- Auth.js provider: to be decided in PR 0.5 (likely GitHub OAuth or email magic link)

## Security and privacy

- No secrets in the repo. `.env` is gitignored, and `.env.example` holds placeholders only.
- Every data-access helper requires a user id. No unscoped queries.

## Testing

- Vitest smoke test in 0.2; env validation tests; auth helper tests in 0.5

## Tasks / PR breakdown

- [x] **PR 0.1: Project docs** (branch `phase-0/project-docs`)
- [ ] **PR 0.2: Scaffold app** (branch `phase-0/0.2-scaffold`)
- [ ] **PR 0.3: CI** (branch `phase-0/0.3-ci`)
- [ ] **PR 0.4: Database** (branch `phase-0/0.4-database`)
- [ ] **PR 0.5: Auth** (branch `phase-0/0.5-auth`)

## Open questions

- Auth provider for 0.5: GitHub OAuth (simple, dev-friendly) or email magic link (more realistic for job seekers)?
- Node version to pin (`.nvmrc` / `engines`)

## Progress log

- 2026-10-19: Spec drafted. Stack chosen (ADR 0001).
- 2026-10-19: PR 0.1 adds agent instructions (`AGENTS.md`, `CLAUDE.md`), roadmap, spec/ADR structure, and PR template.
