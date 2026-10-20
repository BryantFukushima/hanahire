# AGENTS.md

Instructions for any AI coding agent (Claude Code, Codex, Cursor, Copilot, Gemini, etc.) working in this repo.
This file is the source of truth. Tool-specific files (e.g. `CLAUDE.md`) only add to it and never contradict it.

## Project

HanaHire is an AI-powered job search copilot: resume parsing → job search → match ranking → tailored
materials → autofill with **human approval** → application tracking. See `README.md` for the product
and `docs/ROADMAP.md` for the phased build plan.

This is also a **learning and portfolio project**. The owner wants to understand every part of the
build, so explaining the work matters as much as writing it.

## Tech stack

| Layer            | Choice                                                                   |
| ---------------- | ------------------------------------------------------------------------ |
| Language         | TypeScript (strict mode)                                                 |
| App framework    | Next.js (App Router), React Server Components where useful               |
| Styling          | Tailwind CSS                                                             |
| Database / ORM   | PostgreSQL (Docker locally) + Prisma                                     |
| Validation       | Zod (env vars, API inputs, LLM outputs)                                  |
| Auth             | Google + GitHub sign-in; library chosen in ADR 0002 (likely Better Auth) |
| AI               | Claude API via the official Anthropic TypeScript SDK                     |
| Browser autofill | Playwright                                                               |
| Testing          | Vitest (unit/integration), Playwright (e2e)                              |
| Runtime          | Node.js, latest LTS (pinned in `.nvmrc` + `engines`)                     |
| Package manager  | pnpm                                                                     |
| CI               | GitHub Actions                                                           |

Changing anything in this table needs an ADR in `docs/adr/` and the owner's approval.
Rationale: [ADR 0001](docs/adr/0001-use-typescript-nextjs-stack.md).

## Where context lives

Project knowledge belongs in the repo, not in chat history or any one tool's memory, so anyone
(human or agent) can pick up the work. Read these before starting:

| Path              | What it holds                                                    |
| ----------------- | ---------------------------------------------------------------- |
| `docs/ROADMAP.md` | Phases → PRs, with status                                        |
| `docs/specs/`     | One spec per phase: requirements, design, tasks, progress log    |
| `docs/adr/`       | Architecture Decision Records: why significant choices were made |
| `AGENTS.md`       | How to work here (this file)                                     |

If you learn something a future contributor needs, such as a decision, constraint, or gotcha,
write it into the relevant spec or ADR.

## Commands

Requires Node 24 LTS (`nvm use` reads `.nvmrc`) and pnpm. Keep this section up to date when scripts change.

```bash
pnpm install          # install dependencies
pnpm dev              # run the app at http://localhost:3000
pnpm lint             # ESLint
pnpm typecheck        # generate Next.js route types, then tsc --noEmit
pnpm test             # Vitest (run once); pnpm test:watch for watch mode
pnpm build            # production build
pnpm format           # Prettier (write); pnpm format:check to verify
pnpm check            # all checks: lint, typecheck, test, build, format:check
```

Before you say a change is done, run `pnpm check`. CI (`.github/workflows/ci.yml`) runs the same
command on every PR and push to `main`, and its `check` job must pass before a PR can merge.
Dependabot (`.github/dependabot.yml`) opens weekly update PRs for npm packages and GitHub Actions.

## Workflow (required)

### 1. Plan first, with no code changes until the plan is approved

Planning is **spec-driven**. At the start of a phase, write its spec in `docs/specs/` from
`_template.md` (see `docs/specs/README.md`) and get the owner's approval before any code is written.
Write an ADR for each significant technical choice. Then, before each PR in the phase, walk the
owner through a plan for that PR and **wait for explicit approval**. The plan must cover:

- **Goal**: what this change does and which roadmap item it covers (e.g. "PR 1.2")
- **Files**: what you will create, change, or delete
- **Approach**: how it works, step by step, in plain language
- **Concepts**: new libraries, patterns, or ideas involved, explained briefly for a learner
- **Alternatives**: other options and why you didn't pick them (keep it short)
- **Risks / gotchas**: anything non-obvious, such as security, data handling, cost, or breaking changes

Answer the owner's questions and revise the plan as needed. Approval for one plan does not cover
the next one. If the work drifts from the approved plan while you implement it, stop and check in.
Then update the spec's design section to match.

Docs-only edits that the owner explicitly requested don't need a separate plan.

**Hand-written PRs (✍️ in the roadmap):** the owner writes the implementation code. The agent
helps plan, explains concepts, answers questions, and reviews the owner's code, but doesn't write
or edit implementation code unless asked for a specific snippet. Point out problems and hint at
fixes instead of rewriting.

### 2. Branch per PR

- Never commit straight to `main`.
- By default, **one phase = one branch = one PR.** If a phase is too big for one reviewable PR,
  split it into the numbered PRs listed in `docs/ROADMAP.md`.
- Branch names: `phase-<N>/<short-kebab-name>`, e.g. `phase-1/resume-upload`.
  For split phases, include the PR number: `phase-1/1.2-text-extraction`.
- Aim for PRs a human can review in one sitting (roughly under 400 changed lines, not counting
  lockfiles and generated code).

### 3. Implement

- Follow the approved plan. Make small, focused commits with clear messages.
- Match the existing code's style, naming, and structure.
- Add or update tests with every behavior change.
- Don't add dependencies that weren't in the approved plan.

### 4. Explain as you go

When the work is done, walk the owner through the diff: what each file does, how the pieces
connect, and anything worth understanding before review. Point to specific `file:line` locations.

### 5. Update the spec and roadmap

In the same PR, tick off the spec's task, add a dated line to its **Progress log**, and update the
status in `docs/ROADMAP.md` and `docs/specs/README.md`.

### 6. Open the PR

Before creating the PR, show the owner the draft description and wait for approval.
Use `.github/pull_request_template.md`. Every PR description must include:

- **What changed**: a concise summary of the changes
- **Why**: the problem or roadmap item it addresses
- **Gotchas**: anything reviewers should watch for (edge cases, follow-ups, config, migrations)
- **How to verify**: steps to check it locally

Don't merge PRs. The owner reviews and merges.

## Non-negotiable product rules

- **Human in the loop:** nothing is ever submitted to an employer without explicit user approval.
  Enforce the approval gate **server-side**, not only in the UI. Autofill stops before the final submit.
- **No fabrication:** tailored resumes, cover letters, and answers may rephrase and re-emphasize
  the user's real experience but must never invent jobs, skills, degrees, or metrics.
- **Explainable rankings:** every match score is stored with its reasoning.
- **Respect job sources:** use official or public APIs (e.g. Greenhouse, Lever, Ashby job board APIs).
  Don't scrape sites whose terms forbid it.

## Security and privacy

- Never commit secrets, `.env` files, real resumes, or real personal data. Use synthetic fixtures.
- Validate all env vars at startup with Zod. Keep `.env.example` current.
- Treat resume text and job descriptions as untrusted input, including in LLM prompts (prompt injection).
- Validate LLM outputs with Zod schemas before you persist or act on them.
- Scope every database query to the signed-in user.

## Documentation

- `docs/ROADMAP.md`: phases and PRs. Check items off as their PRs merge.
- `docs/specs/NNN-name.md`: one spec per phase (living document, updated with each PR).
- `docs/adr/NNNN-title.md`: ADRs (MADR format). Never rewrite an accepted ADR; supersede it with a new one.
- `README.md`: public-facing and portfolio-quality. Update "Getting started" and "Status" as features land.

## Framework notes

The block below is maintained by Next.js: `next dev` re-adds it if it's missing. Leave it in place.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
