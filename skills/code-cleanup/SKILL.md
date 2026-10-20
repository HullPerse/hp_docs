---
name: code-cleanup
version: 1.0.0
description: >
  Behavior-preserving mechanical cleanup of code: dead code, unused exports and
  dependencies, semantic duplicates, backward-compatibility cruft, leftover
  comments, logs and stubs, and mechanical error-handling migration. Its first
  case converts try/catch/finally to the bundled attempt Result helpers with a
  per-site conversion table and proof that behavior did not change. Use when the
  user says "почисти код", "чистка кода", "clean up dead code", "remove unused",
  "migrate try/catch", or wants cruft removed without a rewrite. Not prose
  cleanup (deslop), not simplification judgement (ponytail), not rule compliance
  (docs-refactor), not a read-only audit (review-audit).
---

# Code Cleanup

Removes code that no longer earns its place, without changing what the program
does. Every removal is mechanical and provable: if a change cannot be shown to
preserve behavior, it is not a cleanup, it is a refactor and needs its own
disposition.

## Ownership

This skill owns behavior-preserving mechanical edits. Boundaries:

- prose, comments as writing, docs text -> `deslop`;
- "this is over-engineered, delete it" judgement -> `ponytail` and the
  over-engineering pass of `review-audit`;
- bring code to its own `.docs/` rules -> `docs-refactor`;
- find problems, change nothing -> `review-audit`.

Cleanup edits code. It must leave evidence that behavior is unchanged.

## When to use

- dead code, unreachable branches, unused local symbols;
- unused exports, unused interfaces or extension points, unused dependencies;
- semantic duplicates: two implementations of one concept;
- backward-compatibility leftovers: shims, deprecated aliases, feature flags
  whose rollout finished;
- leftover comments, debug logs, `console.log`, stubs, placeholder success
  paths, commented-out code, and TODO/FIXME markers;
- mechanical migration of `try/catch/finally` to the `attempt` Result helpers.

## Preconditions

- `.docs/` exists and is filled (no `{{...}}` placeholders). Otherwise run the
  `hp-docs` first-run flow first.
- Read root `AGENTS.md`, `.docs/AGENT_PROMPT.md`, `.docs/DEVELOPMENT.md`
  (including "Error handling (Result helpers)" and the anti-slop rules),
  `.docs/CHECKLIST.md`, and `.docs/DECISIONS.md` before touching anything.
- A working typecheck, lint, and test command exist. Without a way to prove
  behavior unchanged, cleanup is unsafe; say so and stop.

## Process

### 1. Scope and inventory

Fix the scope (whole project, module, diff, or one cleanup kind). Inventory
candidates with exact locations: symbol, file, line, and why it looks dead or
duplicated. Build the inventory with one search per cleanup kind and print the
candidate table; reading files one by one is the slow path. Record the baseline:
run typecheck, lint, and tests and keep the output. A cleanup without a baseline
cannot be proven.

### 2. Classify every candidate

For each candidate decide one of: remove, replace, or leave with a reason.
Uncertain reachability is not "dead" until proven: check exports, dynamic
imports, string references, config, tests, and public API before deleting.
Anything ambiguous becomes a question in the report, never a silent deletion.

### 3. Disposition gate

Group findings into packages and ask the user per package: fix now, defer, or
reject. Do not start editing before the disposition. This is the same gate the
other skills use.

### 4. Execute per site

Apply each approved change with the variant that fits that exact site (see the
error-handling table below). Never bulk-replace a pattern without choosing the
variant per site.

### 5. Prove behavior unchanged

After the changes, re-run typecheck, lint, and the tests from the baseline.
Compare results and report each. If a test fails, the cleanup is wrong or the
test was asserting the cruft; decide which, do not paper over it.

### 6. Report

List every changed site, the variant used, and the before/after command output.
Record the decision in `.docs/DECISIONS.md` when the change alters a convention
or removes a public symbol. List every non-mechanical finding as an open item
(see "Findings that are not cleanup").

## First case: try/catch/finally to Result helpers

The project rule is a proposal, not a mandate: fallible calls return a Result
instead of throwing, so the caller decides what a rejection means. The bundled
helper is `templates/code/attempt/attempt.ts` (`toError`, `attempt`,
`attemptSync`, `withFallback`). Aim for zero `try/catch` outside the helper.
Convert each site by choosing the variant that preserves behavior:

| Site | Convert to |
| --- | --- |
| failure is normal flow | `const [data, error] = await attempt(call)` plus an explicit fallback |
| sync fallible call | `attemptSync(() => ...)` |
| cleanup, failure swallowed | `await attempt(call).finally(stop)` - `attempt` never rejects, so `finally` always runs |
| cleanup, failure must propagate | `await attempt(call).finally(stop)` then `if (error) throw error` |
| floating promise | `.catch(() => {})` with a comment naming why silence is safe |

Rules for this migration:

- This is not a ban on `throw`. Throwing stays correct for invariant violations
  and programmer errors that should fail fast (guards); Result is for failures
  that are part of normal flow. Do not convert a guard into a Result.
- A blind codemod is forbidden. The dangerous case is `try/finally` where the
  error had to propagate: the swallowed version changes behavior silently.
- `attempt` collapses the error to `Error`; a `catch` that branched on error
  type loses that type, so leave it or handle the type explicitly. Keep domain
  errors as `Error` subclasses with codes so the type survives.
- One `try` guarding several statements maps to several `attempt` calls with
  explicit fallbacks, not to one.
- The helper itself and an intentional floating-promise `.catch(() => {})` are
  the only expected remainders.

## Cleanup catalog (other kinds)

- Dead code: remove unreachable branches, unused locals, write-only state, and
  unused interfaces, empty extension points, or unused type aliases with no
  consumer. Prove reachability first; delete exports only when no consumer and
  no dynamic import references them, or ask. "No consumer" is mechanical;
  "used but over-engineered" is `ponytail` judgement, not cleanup.
- Unused dependencies: a package is removable only when no import, config, or
  script uses it. Check the lockfile and the framework's own config.
- Semantic duplicates: two copies of one fact or one concept are a defect -
  keep one, delete the other, update callers. But lookalike code that only
  shares a shape is not automatically a defect: merge it only when one
  abstraction fits cleanly, because a leaky or speculative abstraction is worse
  than the duplication. When unsure, keep both and record why in
  `.docs/DECISIONS.md`. The duplication rule in `.docs/DEVELOPMENT.md` owns the
  principle; this skill applies the deletion.
- Backward-compat cruft: shims, deprecated aliases, finished feature flags.
  Remove only when the rollout is done and no external consumer relies on them.
- Comments, logs, stubs: remove comment-parrots, debug logs, `console.log` left
  in production paths, commented-out code, journal or changelog comments in
  source, positional or banner markers, stubs, and placeholder success paths.
  Version control already keeps old code and history. Keep rare comments that
  name a non-obvious cause, invariant, workaround, or security constraint.
- TODO/FIXME comments: do not leave them as the decision. Route the unresolved
  item to `.docs/DECISIONS.md` (project rule) and remove the marker.

## Findings that are not cleanup

A cleanup pass often surfaces problems that are not mechanical removals. Do not
fix them here - a behavior-preserving pass must not change design:

- naming, signatures, structure, or abstraction smells -> `ponytail` (simplify)
  or `docs-refactor` (bring to `.docs/` rules);
- prose, comments as writing, docs text -> `deslop`;
- an error-handling site where the right variant is unclear, or a design
  question about throwing vs Result -> record it in `.docs/DECISIONS.md` and ask.

List them in the report as open findings, with location and reason. Never leave
a silent TODO or a silent half-fix.

## Rationalizations (excuses and rebuttals)

- "Bulk replace is faster." -> It is also how an error that had to propagate
  gets swallowed. Pick the variant per site.
- "It might be used somewhere." -> Prove it or ask. "Might" is not evidence.
- "Leave the old path, it is harmless." -> Two sources of truth for one
  concept is the bug; delete one and update callers.
- "Merge the duplicates, they look the same." -> Lookalike shape is not one
  concept. Merge only when one abstraction fits; otherwise keep both and say
  why.
- "Tests will catch it." -> Only if the tests cover that path; run them and
  show the output, do not assume.

## Red flags

- Deleting an export before checking dynamic imports, config, or the public API.
- One `attempt` call wrapping body that spanned several statements.
- A `finally` replaced by `attempt` without deciding whether the error must
  propagate.
- Converting a guard or invariant check (a `throw` that should stay) into a
  Result.
- Fixing a design smell inside a cleanup pass instead of routing it.
- Reporting "clean" without baseline and post-change command output.

## Verification

The cleanup is done only when:

- baseline and post-change typecheck, lint, and test output are both reported;
- every changed site names its cleanup kind and the variant used;
- nothing ambiguous was deleted silently - open questions are listed;
- non-mechanical findings are routed, not fixed in place;
- `.docs/DECISIONS.md` records any removed public symbol or changed convention.
