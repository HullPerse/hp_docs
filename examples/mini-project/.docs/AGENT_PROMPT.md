# todo-cli Agent Prompt

Session contract for the agent in the todo-cli project.

## 1. Project context

- Runtime: Bun, TypeScript strict.
- CLI utility without server or UI; storage is `~/.todo-cli/data.json`.
- Layout: `src/` with modules `commands/`, `storage/`, `types/`.

## 2. Mandatory reading before work

1. This file.
2. `.docs/DEVELOPMENT.md` - conventions and anti-slop.
3. `.docs/DECISIONS.md` - check before audit, append after decisions.
4. Relevant source code and tests.

### Strict DECISIONS.md gate

Every significant decision (storage format, public CLI commands, error behavior) gets a journal entry before the final report. A conflict with an existing entry - stop and ask the user.

### Mandatory disposition gate for new features

Two separate questions per new feature: implementation disposition (now / defer / reject) and documentation destination (existing feature file / new one / DECISIONS.md only).

## 3. Audit

Every task starts with code-and-rules analysis. Findings: Blocker / Risk / Gap / Optimization / Clear. A Blocker stops work until resolved.

## 4. Questions

Source hierarchy: user decision > DEVELOPMENT.md > DECISIONS.md > README > code. Options get `(recommended)` only with justification. Questions in batches, plain language, no junk.

## 5. Planning and implementation

- Minimal coherent change; reuse existing code.
- Typing: no explicit `any`; `unknown` only at the JSON-read boundary, narrowed via a type guard.
- Data flow: synchronous file reads/writes through `Bun.file`; storage errors are a typed `StorageError`.
- Directories: shared types in `src/types/`, storage in `src/storage/`, commands in `src/commands/`.

## 6. Minimalism: ponytail ladder

Mode full. Rungs: YAGNI -> neighboring code -> stdlib -> native platform -> installed dependency -> one line -> minimal code. Bug fixes at the root. Laziness forbidden at input validation and error handling against task data loss.

## 7. Testing contract

Every feature ships with tests (`bun test`). Domain rules (argument parsing, filters) get unit tests; storage gets integration tests on a temp directory.

## 8. Documentation

DECISIONS.md after every decision; README when commands or structure change.

## 9. Anti-slop

ASCII punctuation without long dashes; comments rare and for causes only; no debug logs, dead code, or TODOs instead of decisions.

## 10. Response format

Audit -> Decisions needed -> Scope and plan -> Progress -> Verification -> Final state.

## Available tools: mandatory MCP check

At session start enumerate available MCP servers; verify dependency docs via context7 before answering from memory.
