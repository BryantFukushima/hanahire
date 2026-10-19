# Specs

HanaHire uses **spec-driven development**: every phase in [`ROADMAP.md`](../ROADMAP.md) has a spec,
written and approved *before* any code is written. Specs keep requirements, design, and progress in
the repo, so anyone (human or AI agent) can pick up the project without lost context.

## Lifecycle

```
Draft ──▶ Approved ──▶ In progress ──▶ Done
  ▲           │
  └───────────┘  (changes in scope go back to Draft for re-approval)
```

1. **Draft:** the agent or developer copies [`_template.md`](_template.md) to `NNN-short-name.md`
   (NNN = phase number, zero-padded) and fills it in.
2. **Approved:** the owner reviews it and agrees. No implementation starts before this.
3. **In progress:** PRs reference the spec. Tick off tasks and add to the **Progress log** as PRs merge.
4. **Done:** all acceptance criteria are met and the roadmap is updated.

Specs are living documents. If the implementation changes the design, update the spec in the same PR.
Significant technical choices get their own [ADR](../adr/README.md), linked from the spec.

## Index

| Spec                                   | Phase | Status |
| -------------------------------------- | ----- | ------ |
| [000-foundation](000-foundation.md)    | 0     | Draft  |
