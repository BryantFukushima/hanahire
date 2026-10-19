# CLAUDE.md

@AGENTS.md

## Claude Code specifics

Everything in `AGENTS.md` applies. These notes add Claude Code-specific behavior on top:

- **Planning:** use plan mode (or a written plan in chat) for the "plan first" step, and don't
  edit files until the owner approves.
- **Git:** create the branch before the first edit. Commit, push, or open a PR only when the owner
  says the work is ready. Use `gh pr create --body-file` and fill in the PR template.
- **Review support:** after implementing, offer to run `/code-review` on the diff before the PR goes up.
- **Claude API work:** load the `claude-api` skill before writing code that calls the Anthropic SDK,
  so model IDs and SDK usage stay current.
