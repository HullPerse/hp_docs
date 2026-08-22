# todo-cli agent rules

A console task manager on TypeScript + Bun: add tasks, list them, mark done, filter. Storage is a JSON file in the user directory. No UI, no server.

Full rules live in `.docs/`. Read them before working.

## Mandatory

1. Read `.docs/AGENT_PROMPT.md` - the session contract (audit before code, response format).
2. Read `.docs/DEVELOPMENT.md` - conventions, typing, anti-slop.
3. Read `.docs/DECISIONS.md` before the audit and append decisions as you go.
4. Read module README before working in the respective directory.

## Key rules

- Audit first, code second; stop and ask on a Blocker.
- Feature disposition is mandatory: now / defer / reject + where to document it.
- Do not rubber-stamp bad ideas: a direct verdict with reason and alternative.
- Every answer to a question is recorded in `.docs/DECISIONS.md`.
- No dependency is added silently: check installed packages first.

## Commands

```bash
bun run dev -- add "task"
bun test
bun run typecheck
bun run lint
```

## Available tools

At session start list available MCP servers; for library questions use a documentation tool before answering from memory.
