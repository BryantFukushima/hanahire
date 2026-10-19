# Architecture Decision Records

An ADR records one significant technical decision: the context, the options considered, what was
chosen, and the consequences. They're numbered and never rewritten. To change a decision, add a new
ADR that supersedes the old one, so the history stays readable.

Format: [MADR](https://adr.github.io/madr/) (lightweight). Copy [`0000-template.md`](0000-template.md)
to `NNNN-short-title.md`.

## When to write one

- Choosing or replacing a framework, library, database, or hosting option
- Decisions that are expensive to reverse (data model shape, auth approach, autofill architecture)
- Anything a future contributor would reasonably ask "why did we do it this way?" about

## Index

| ADR                                         | Title                                 | Status   |
| ------------------------------------------- | ------------------------------------- | -------- |
| [0001](0001-use-typescript-nextjs-stack.md) | Use a full TypeScript / Next.js stack | Accepted |
