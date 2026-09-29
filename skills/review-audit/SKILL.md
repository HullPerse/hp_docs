---
name: review-audit
version: 1.0.0
description: >
  Read-only general audit of a selected scope against all project rules. Walks file
  organization, typing, data flow, state, UI states, over-engineering (ponytail lens),
  duplication by concept, security spot-check, test coverage, and deslop; reports a
  compliance table plus classified findings with evidence and per-package disposition.
  Makes no fixes and writes no files. Use when the user asks to "проверь код",
  "review", "audit", "посмотри что не так", or wants a full check before deciding
  what to fix. For executing fixes use docs-refactor; for adversarial test attack
  use test-reviewer; for deep security proof use security-audit.
---

# Review Audit

A general read-only audit. It answers "what is wrong and what to do next" for any selected scope. It never fixes anything: every package of findings gets a disposition (fix now via docs-refactor, defer, reject) before any code changes.

## Preconditions

- `.docs/` exists and is filled (no `{{...}}` placeholders). Otherwise run the `hp-docs` first-run flow first.
- Read before auditing: root `AGENTS.md`, `.docs/AGENT_PROMPT.md`, `.docs/DEVELOPMENT.md` (typing rules, data-flow model), `.docs/DECISIONS.md` (accepted constraints first), `.docs/TESTING.md` and `.docs/SECURITY.md` for the test/security spot-checks, `.docs/DESIGN.md` for UI scopes, `.docs/CHECKLIST.md`.
- List available MCP tools and keep the list. Use the documentation tool for library claims before judging them.
- Quick rule-freshness check: a rule contradicted by the actual code everywhere is a stale-rule finding, not a code finding. Flag it and ask; never audit against a stale rule silently.

## Scope

If the user did not specify a scope - ask: whole project, one module or directory, one feature, or a commit range. Never guess from recently modified files. Record scope, target paths, revision, and date at the top of the report.

## Audit axes

Walk every axis that applies to the scope. Skip an axis only with a one-line reason.

| Axis | What is checked |
| --- | --- |
| File organization | Naming (casing, suffixes), directory boundaries (`types/`, `lib/`, `config/`, `hooks/`, `api/` or project equivalents), local code outside pinned locations |
| Typing | Project language rules from DEVELOPMENT.md (TS any/unknown, Rust unsafe, Python Any, Go error values) |
| Data flow | Fixed model: query rules or background tasks; no duplicated manual state |
| State | Single source of truth, no duplication between stores |
| UI/UX | Loading, empty, error, disabled, dirty, stale, recovery states; focus indicators; tokens instead of hardcoded values; no duplicate components |
| Over-engineering (ponytail lens) | Speculative abstractions, interfaces with one implementation, factories for one product, config for values that never change, reimplemented stdlib/native/installed solutions, missing `ponytail:` ceiling markers on deliberate simplifications |
| Duplication | Semantic duplicates by concept (synonyms, related terms, similar shapes), not only by name; each hit names files, symbols, and the actual problem, no refactor sketch |
| Security spot-check | Actual outbound calls (network, child processes, filesystem writes, env reads, lifecycle scripts) against the SECURITY.md capability budget; secrets hygiene; undeclared channels are Blocker findings |
| Tests spot-check | Behavior contract present, domain rules covered, integration at real boundaries, no mocks of the system under test, no sleep-based sync |
| Deslop | Comment-parrots, debug logs, dead code, placeholder data, em/en dashes, word-tag hits in touched texts |

## Report format

Compliance table first:

```markdown
| Rule | Status | Violations | Files |
|---|---|---|---|
| Component names camelCase+suffix | FAIL | 7 | foo-bar.tsx, ... |
| No explicit any | PASS | 0 | - |
| One query per file | WARN | 2 | lobby.api.ts (justified) |
```

Then findings, each with exact evidence (`file:line`), classified as Blocker, Risk, Gap, Optimization, Cleanup, or Clear. A Blocker stops everything until the user resolves it.

## Disposition per package

Group findings into packages (by axis or by user scope) and ask a disposition for each separately:

- **fix now** - handed to `docs-refactor` as an approved package in a follow-up task, never executed inside this audit;
- **defer** - recorded as a feature file with return conditions;
- **reject** - recorded in DECISIONS.md with a reason.

One disposition covers one coherent package. Never mix packages.

## Constraints

- Read-only: no source edits, no `.docs/` edits, no DECISIONS.md entries from the audit itself. Dispositions chosen by the user are recorded by the follow-up task, not here.
- No invented numbers or claims: every finding carries evidence or an explicitly stated limitation.
- Compact report: most important findings first, full detail only where the user asked. Mark the single recommended next action `(recommended)` only with justification.
