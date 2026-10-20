# HanaHire

[![CI](https://github.com/BryantFukushima/hanahire/actions/workflows/ci.yml/badge.svg)](https://github.com/BryantFukushima/hanahire/actions/workflows/ci.yml)

> **We draft. You decide. You get hired.**

HanaHire is an AI-powered job search copilot. Upload your resume, tell it what you're looking for, and it finds, ranks, and helps you apply to the jobs that actually fit you — with you approving every application before it goes out.

_Hana_ is Hawaiian for "work."

---

## Features

### 🔍 Resume-driven job search

- Parses your resume to understand your skills, experience, and seniority
- Search filters for role type, salary range, location, remote/hybrid/onsite, and more
- Pulls listings from multiple job sources

### 📊 Match ranking

- Scores each job against your resume
- Explains _why_ a job ranks high or low (matching skills, gaps, seniority fit)
- Surfaces the best opportunities first so your time goes where it counts

### ✍️ Tailored application materials

- Tailors your resume to emphasize the experience most relevant to each role
- Generates cover letters specific to the company and position
- Drafts answers to application questions ("Why do you want to work here?", etc.)

### 📝 Application autofill — with human review

- Pre-fills application forms using your resume and generated answers
- **Nothing is submitted without your explicit approval** — review, edit, then send
- Tracks what you've applied to and where each application stands

---

## How it works

```
 Resume + preferences
          │
          ▼
   ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
   │  Job search  │ ──▶ │  Rank & match│ ──▶ │ Tailor resume,   │
   │  & filtering │     │  vs. resume  │     │ cover letter, Q&A│
   └──────────────┘     └──────────────┘     └──────────────────┘
                                                      │
                                                      ▼
                                          ┌──────────────────────┐
                                          │ Autofill application │
                                          │  → 👤 human review   │
                                          │  → submit            │
                                          └──────────────────────┘
```

## Design principles

- **Human in the loop.** The app drafts; you decide. No auto-submitting.
- **Explainable rankings.** Every match score comes with reasoning you can check.
- **Your data stays yours.** Resumes and personal details are handled with care and never shared without consent.

---

## Status

🚧 **In early development.** The project is being planned and scaffolded.

### Roadmap

- [ ] Project scaffolding and tech stack
- [ ] Resume upload and parsing
- [ ] Job search with filters (role, salary, location, remote)
- [ ] Resume-to-job match scoring and ranking
- [ ] Tailored resume and cover letter generation
- [ ] Application question answer generation
- [ ] Application autofill with review/approval flow
- [ ] Application tracking dashboard

See [docs/ROADMAP.md](docs/ROADMAP.md) for the phase-by-phase PR breakdown.

## Tech stack

TypeScript · Next.js (App Router) · Tailwind CSS · PostgreSQL + Prisma · Better Auth (planned) · Claude API · Playwright · Vitest · GitHub Actions

## Getting started

**Prerequisites:**

- Node.js 24 LTS (see `.nvmrc`) and [pnpm](https://pnpm.io)
- A Docker runtime with Compose: [Colima](https://github.com/abiosoft/colima) (what I use),
  [OrbStack](https://orbstack.dev), or [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
git clone git@github.com:BryantFukushima/hanahire.git
cd hanahire
nvm use              # or install Node 24 LTS another way
pnpm install
cp .env.example .env
pnpm db:up           # start Postgres in Docker
pnpm db:migrate      # create the database tables
pnpm db:seed         # add a sample dev user
pnpm dev             # http://localhost:3000
```

Database scripts: `pnpm db:down` (stop), `pnpm db:reset` (wipe, re-migrate, re-seed),
`pnpm db:studio` (browse tables in the browser).

> **Colima users:** if `docker compose` reports "unknown command", add
> `"cliPluginsExtraDirs": ["/opt/homebrew/lib/docker/cli-plugins"]` to `~/.docker/config.json`.

Run `pnpm check` to run every check (lint, typecheck, tests, build, formatting) before opening a PR.
Individual scripts: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm format`.

---

## License

Copyright © 2026 Bryant Fukushima. All rights reserved. See [LICENSE](LICENSE).

## Author

**Bryant Fukushima** — [GitHub](https://github.com/BryantFukushima)
