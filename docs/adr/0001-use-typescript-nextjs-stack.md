# 0001: Use a full TypeScript / Next.js stack

- **Status:** Accepted
- **Date:** 2026-10-19
- **Deciders:** @BryantFukushima

## Context and problem

HanaHire needs a web UI, a backend for resume parsing, job ingestion, and ranking, LLM calls, a
relational database, and browser automation for autofill. It's built by one developer as a learning
and portfolio project, so keeping things simple and having a stack employers recognize both matter.

## Options considered

1. **Full TypeScript: Next.js + Prisma/Postgres + Playwright.** One language end to end, shared Zod
   types between UI and server, first-class Anthropic and Playwright SDKs, easy Vercel deploys.
   Con: a weaker data/ML ecosystem than Python.
2. **Next.js frontend + Python (FastAPI) backend.** Python's ML/NLP libraries.
   Con: two languages, duplicated types, more infrastructure to run and learn at once.
3. **Python full stack (Django/FastAPI + templates).** Con: a weaker modern-frontend story for a
   portfolio piece.

## Decision

**Option 1.** The heavy AI work goes through the Claude API, not local ML models, so Python's
ecosystem advantage matters less here than one language and shared types do.

## Consequences

- Good: one toolchain (pnpm, Vitest, ESLint), types shared across client and server, simple deploys.
- Trade-off: if local ML (custom embeddings, classifiers) becomes necessary, it may need a separate
  service and a new ADR.
- Follow-up: headless browsers don't run on typical serverless hosting. The autofill architecture
  gets its own ADR in Phase 6.
