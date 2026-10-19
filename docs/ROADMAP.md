# Roadmap

Each phase is a branch and a PR. When a phase is too big for one reviewable PR, it's split into the
numbered PRs below, each on its own branch (`phase-<N>/<N.M>-<name>`). Every phase starts with an
approved [spec](specs/README.md), and every PR follows the plan → approve → build → explain → PR
workflow in [`AGENTS.md`](../AGENTS.md). Significant decisions are recorded as [ADRs](adr/README.md).

The tables below are a starting breakdown. Each phase's spec refines them before work begins.

Legend: ☐ not started · ◐ in progress · ☑ merged · ✍️ hand-written by the owner (AI reviews only; see `AGENTS.md`)

---

## Phase 0: Foundation

Goal: a working, tested, deployable empty app with a database and sign-in.
Spec: [000-foundation](specs/000-foundation.md)

| PR  | Title                    | Scope                                                                                       |
| --- | ------------------------ | ------------------------------------------------------------------------------------------- |
| 0.1 | ☑ Project docs           | `AGENTS.md`, `CLAUDE.md`, roadmap, specs + ADRs, PR template                               |
| 0.2 | ☐ Scaffold app           | Next.js + TS strict, Tailwind, ESLint/Prettier, Vitest, pnpm scripts, Zod env validation    |
| 0.3 | ☐ CI                     | GitHub Actions: lint, typecheck, test, build on every PR                                    |
| 0.4 | ☐ Database               | Docker Compose Postgres, Prisma, `User` model, first migration, seed script                 |
| 0.5 | ☐ Auth                   | Auth.js sign-in, protected routes, user-scoped data access helper                           |

**Learn:** App Router basics, server vs. client components, migrations, CI pipelines, session auth.

## Phase 1: Resume upload and parsing

Goal: the user uploads a resume and gets a structured, editable profile.

| PR  | Title                    | Scope                                                                                       |
| --- | ------------------------ | ------------------------------------------------------------------------------------------- |
| 1.1 | ☐ Upload                 | Upload UI, file type/size validation, storage behind an interface (local disk in dev)       |
| 1.2 | ☐ Text extraction        | PDF/DOCX → plain text, synthetic test fixtures                                              |
| 1.3 | ☐ LLM structured parsing | Claude API → Zod-validated `Profile` (skills, roles, seniority, education); prompt + evals  |
| 1.4 | ☐ Profile and preferences | Review/edit parsed profile; preferences form (role, salary, location, remote/hybrid/onsite) |

**Learn:** file uploads, structured LLM output, schema validation, prompt injection basics.
**Gotcha:** `.gitignore` ignores `*.pdf`/`*.docx`, so synthetic fixtures need an explicit `!tests/fixtures/**` exception.

## Phase 2: Job ingestion and search

Goal: real listings from multiple sources, searchable with filters.

| PR  | Title                    | Scope                                                                                       |
| --- | ------------------------ | ------------------------------------------------------------------------------------------- |
| 2.1 | ☐ ✍️ Job model + first source | Normalized `Job` schema, `JobSource` adapter interface, Greenhouse job board adapter      |
| 2.2 | ☐ More sources           | Lever + Ashby (and/or Adzuna) adapters, dedupe and normalization (salary, location)         |
| 2.3 | ☐ Search UI              | Filters (role, salary, location, remote), Postgres full-text search, pagination             |

**Learn:** adapter pattern, data normalization, rate limiting/caching, full-text search.

## Phase 3: Match scoring and ranking

Goal: every job gets a score against the profile, with reasons the user can check.

| PR  | Title                    | Scope                                                                                       |
| --- | ------------------------ | ------------------------------------------------------------------------------------------- |
| 3.1 | ☐ ✍️ Deterministic scoring | Skill overlap, seniority, location, and salary fit → score + structured reasons; unit tests |
| 3.2 | ☐ Semantic matching      | Embeddings (pgvector) and/or LLM assessment blended into the score; caching for cost        |
| 3.3 | ☐ Ranked results UI      | Sorted results, "why this ranks high/low" breakdown, matched skills vs. gaps                |

**Learn:** scoring design, embeddings, vector search, controlling LLM cost.

## Phase 4: Tailored resume and cover letter

Goal: job-specific materials grounded only in the user's real experience.

| PR  | Title                    | Scope                                                                                       |
| --- | ------------------------ | ------------------------------------------------------------------------------------------- |
| 4.1 | ☐ Tailored resume        | Re-emphasized resume per job, no-fabrication guardrail check, diff view vs. original        |
| 4.2 | ☐ Cover letter           | Company/role-specific letter, editable before use                                           |
| 4.3 | ☐ Export                 | Download as PDF/DOCX                                                                        |

**Learn:** grounded generation, guardrails and output checks, document generation.

## Phase 5: Application question answers

Goal: drafted answers to common application questions.

| PR  | Title                    | Scope                                                                                       |
| --- | ------------------------ | ------------------------------------------------------------------------------------------- |
| 5.1 | ☐ Q&A generation         | Answer drafts ("Why this company?", etc.), editable answer library reused across applications |

**Learn:** prompt templating, reusing user-approved content.

## Phase 6: Autofill with human approval

Goal: pre-filled applications that never submit without the user's explicit OK.

| PR  | Title                    | Scope                                                                                       |
| --- | ------------------------ | ------------------------------------------------------------------------------------------- |
| 6.1 | ☐ ADR + spike            | Decide on a local Playwright runner or a browser extension; prototype on one ATS            |
| 6.2 | ☐ ✍️ Approval state machine| `Application` model: draft → ready → approved → submitted, enforced server-side             |
| 6.3 | ☐ Autofill runner        | Fill a Greenhouse application from profile + answers, stop before submit, show for review   |
| 6.4 | ☐ More ATS support       | Lever / Ashby form mappings                                                                 |

**Learn:** browser automation, state machines, why safety gates belong on the server.
**Gotcha:** headless browsers don't run on typical serverless hosting, which is why 6.1 is an ADR.

## Phase 7: Application tracking

Goal: one place to see every application and where it stands.

| PR  | Title                    | Scope                                                                                       |
| --- | ------------------------ | ------------------------------------------------------------------------------------------- |
| 7.1 | ☐ Tracking model         | Status history/timeline, notes, manual status updates                                       |
| 7.2 | ☐ Dashboard              | Pipeline view (applied, interviewing, offer, rejected), basic stats                         |

**Learn:** dashboard data modeling, aggregate queries.

## Phase 8: Ship and showcase

Goal: deployed, private-by-design, and portfolio-ready.

| PR  | Title                    | Scope                                                                                       |
| --- | ------------------------ | ------------------------------------------------------------------------------------------- |
| 8.1 | ☐ Deploy                 | Vercel + managed Postgres, production env, secrets handling                                 |
| 8.2 | ☐ Privacy controls       | Delete-my-data, file encryption at rest, data retention policy                              |
| 8.3 | ☐ Demo mode              | Seeded fake persona so visitors can try it without uploading a real resume                  |
| 8.4 | ☐ Portfolio polish       | README screenshots/GIFs, architecture diagram, case-study write-up                          |

**Learn:** production deployment, privacy engineering, presenting technical work.
