# todo-cli DEVELOPMENT.md

Permanent project contract.

## Source of truth

User decision > this file > DECISIONS.md > README > code.

## Project

- CLI `todo-cli`: TypeScript + Bun, strict mode.
- Storage: a single JSON file in `~/.todo-cli/`, no database.
- Docs: `.docs/`, tracked in Git.

## Fixed decisions

- Package manager: Bun (chosen at initialization).
- Lint: oxlint + oxfmt via the ultracite preset (`check` = `ultracite check`, `fix` = `ultracite fix`).
- Project language: English.
- Data-flow model: synchronous file operations, no query libraries or background tasks.
- Storage format: JSON array of tasks with id, title, done, createdAt fields; no migrations - on a corrupted file show a clear error with the path.
- Rejected: cloud sync, tags, subprojects (out of scope until an explicit decision).

## Typing by language

TypeScript: no explicit `any`; `unknown` only at the JSON-read boundary narrowed via a type guard; `strict: true`.

## Project commands

`bun run dev`, `bun test`, `bun run typecheck`, `bun run lint`, `bun run check`, `bun run fix`.

## Agent communication protocol

Read docs before code; ask before ambiguous decisions; tests together with features; honestly report what is unverified; never add dependencies silently; update DECISIONS.md.

## Direct critical mode

Never rubber-stamp bad ideas. Verdict + reason + consequences + alternative + revision condition. Harsh language about a decision is allowed; demeaning the person is not.

## Feature disposition and destination

Both questions mandatory before code. Deferred/rejected carry a reason and return condition. Never asked again while scope is unchanged.

## Mandatory decision journal

Read before audit, appended after every significant decision, before the final report.

## Anti-slop rules

ASCII punctuation; rare purposeful comments; no speculative abstractions, debug logs, dead code, or placeholder data; UI strings short and direct.

## Documentation

AGENT_PROMPT.md - session contract; DEVELOPMENT.md - this file; DECISIONS.md - journal; CHECKLIST.md omitted as redundant for a micro-project (decision in DECISIONS.md); DESIGN.md deleted: the project has no UI.
