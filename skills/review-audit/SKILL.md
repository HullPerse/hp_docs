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

Run each axis as a scripted sweep: one search or count command per axis, and the table is the output. Cite `file:line` for findings only; a dump of every match is not evidence.

| Axis | What is checked |
| --- | --- |
| File organization | Naming (casing, suffixes), directory boundaries (`types/`, `lib/`, `config/`, `hooks/`, `api/` or project equivalents), local code outside pinned locations |
| Typing | Project language rules from DEVELOPMENT.md (TS any/unknown, Rust unsafe, Python Any, Go error values); for TypeScript also the type-usage checklist below: duplicated shapes, non-exhaustive unions, `Record<string>` with known keys, consumer-less utility types |
| Data flow | Fixed model: query rules or background tasks; no duplicated manual state |
| State | Single source of truth, no duplication between stores |
| UI/UX | Loading, empty, error, disabled, dirty, stale, recovery states; focus indicators; tokens instead of hardcoded values; no duplicate components |
| Over-engineering (ponytail lens) | Speculative abstractions, interfaces with one implementation, factories for one product, config for values that never change, reimplemented stdlib/native/installed solutions, missing `ponytail:` ceiling markers on deliberate simplifications |
| Duplication | Semantic duplicates by concept (synonyms, related terms, similar shapes), not only by name; each hit names files, symbols, and the actual problem, no refactor sketch |
| Security spot-check | Actual outbound calls (network, child processes, filesystem writes, env reads, lifecycle scripts) against the SECURITY.md capability budget; secrets hygiene; undeclared channels are Blocker findings |
| Tests spot-check | Behavior contract present, domain rules covered, integration at real boundaries, no mocks of the system under test, no sleep-based sync |
| Resource lifecycle | Every acquired listener, timer, subscription, observer, stream, handle, worker, and native object has a release path on success, failure, cancel, unmount, and shutdown; caches, queues, and maps have a growth policy; no duplicate acquisition; a suspected leak names the retention path |
| Deslop | Comment-parrots, debug logs, dead code, placeholder data, em/en dashes, word-tag hits in touched texts |

## Resource lifecycle checklist

Apply when the scope acquires resources or holds state across time. Skip with a one-line reason otherwise.

- Listeners and subscriptions: add/remove symmetry, duplicate registration on re-run, cleanup on unmount.
- Timers and frames: interval, timeout, animation frame, and scheduled callback stopped on teardown and on the error path.
- Observers and streams: `ResizeObserver`, `IntersectionObserver`, `MutationObserver`, media elements, readers, sockets, and WebSocket handlers closed or disconnected.
- Async work: owner, cancellation, stale results not applied to disposed state, rejected background promises handled.
- Caches and collections: growth policy, eviction, entries removed when the entity is disposed; no unbounded promise map, retry queue, or dedupe registry.
- Buffers and payloads: no retained request or response bodies, DOM nodes, media frames, or binary buffers when metadata suffices.
- Native resources: file handles, connections, workers, players, decoders, and FFI allocations released by their documented API.
- React: effect cleanup symmetric, StrictMode double-invocation safe, object URLs revoked, media stopped, workers terminated, no `useMemo` or ref added as a supposed leak fix.
- Rust and desktop: no `Arc`/`Rc` cycle, `WeakEntity` where ownership must not extend, `cx.observe`/`cx.subscribe` handles dropped, spawned tasks bounded and abortable, channels bounded.
- Shutdown and errors: release on failure, cancellation, navigation, window close, and process termination; no work that outlives its owner.

A resource existing is not a defect. A missing lifecycle, unbounded growth, duplicated acquisition, or measured degradation is. A leak claim needs a retention path (who holds the reference, what should release it) plus a measurement; a suspicion without evidence is a Risk, not a finding.

## Type usage checklist (TypeScript)

Apply when the scope is TypeScript or TSX. Skip for other languages with a one-line reason.

- Duplicated shapes: the same fields declared twice; one should derive from the other.
- `any`, leaked `unknown`, and casts at call sites where the parser should cast once at the boundary.
- Unions switched without an exhaustive `default` (an `assertNever` call or an explicit throw).
- `Record<string, V>` where the key set is finite, or keys not derived from the source union or `keyof typeof`.
- Handwritten unions duplicating a literal table that already exists.
- Brands spread across ordinary call sites, or missing where runtime-identical ids mix.
- Utility types with no consumer, and type-level programming the project does not already use.
- Shared type contracts without a type-test pin.

Triage when a type is proposed:

- use without asking: `Partial`, `Record`, `Pick`, `Omit`, `Exclude`, `Extract`, `NonNullable`, `ReturnType`, `Parameters`, `Awaited`, `keyof`, `typeof`, indexed access, `infer`, `as const`, `satisfies`, discriminated unions, type predicates;
- needs a consumer: branded or opaque ids, `DeepPartial`, `DeepReadonly`, `Mutable`, `Prettify`, `Exact`, `XOR`/`AtLeastOne`/`ExactlyOne`, `NonEmptyArray`, `EventMap`, template literal types, mapped types, `Required`, narrow `Readonly`;
- rejected by default: type-level parsers and state machines, recursive conditional or mapped types, key remapping with `as`, case-conversion types, overloads and assertion signatures added for style, `const` type parameters, new TypeScript `enum`, `namespace` typing, `Record<string, unknown>` used as a domain shape.

A type without a consumer is a speculative abstraction, not a standard.

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
