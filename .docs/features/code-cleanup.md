# Code cleanup skill, bundled logger, and Result helpers

## Status

- Implementation: implemented.
- Documentation: this feature file and DECISIONS.md.
- Source: hp_docs audit session 2026-10-04; audit of the code-cleanup skill and the cleanliness rules against six clean-code sources.

## Idea 1: code-cleanup skill

- Idea: a bundled skill for behavior-preserving mechanical cleanup: dead code, unused exports and dependencies, semantic duplicates, backward-compatibility cruft, leftover comments, logs and stubs, and mechanical `try/catch` migration. It records a baseline (typecheck, lint, tests), classifies every candidate, gates on per-package disposition, converts each site with the variant that fits, and proves behavior unchanged. Findings that need a design change are routed, not fixed in the pass.
- Comment: separate from docs-refactor (rule compliance) and review-audit (read-only) because cleanup must edit code while guaranteeing behavior; folding it into docs-refactor would mix "make it comply" with "delete what is unused". Status: skill created; it is the thirteenth bundled skill.
- Pros: one entry point for "почисти код"; the proof requirement (baseline plus post-change output) keeps deletion honest; the routing rule keeps cleanup from turning into a rewrite.
- Cons: another skill against the flat-layout threshold; needs a real typecheck/lint/test command, so it stops on projects without one.

## Idea 2: bundled logger template replaces hp_logger

- Idea: ship the risovach_new backend logger as a code template under `templates/code/logger/` and drop the external `hp_logger` reference. Weak the observability rule so structured logging stays the goal while level-as-text, context objects, and redaction are the growth path, not a precondition.
- Comment: the old docs pointed at an external package that no longer exists in the tree; a starting template plus softer wording keeps small Bun servers shippable.
- Pros: no external dependency; the template is real, working code.
- Cons: the template is a base, not a finished observability stack; teams still add metrics and tracing.

## Idea 3: attempt Result helpers

- Idea: bundle an `attempt` template (`toError`, `attempt`, `attemptSync`, `withFallback`) and make the project rule "a fallible call returns a Result instead of throwing, so the caller decides what a rejection means". Aim for zero `try/catch` outside the helper. A per-site conversion table maps normal-flow, sync, cleanup-swallow, cleanup-propagate, and floating-promise cases.
- Comment: a proposal, not a blind codemod. The rule is explicitly not a ban on `throw`: guards and invariant violations still throw to fail fast.
- Pros: errors become visible in the type instead of hidden behind `try/catch`; the conversion table prevents the classic mistake of swallowing an error that had to propagate.
- Cons: `attempt` collapses the error to `Error`, so callers that branched on error type must keep the type explicitly; two `try/catch` styles can coexist during migration.

## Idea 4: cleanliness rules expanded after the six-source audit

- Idea: audit the code-cleanup skill and the anti-slop code rules against clean-code-javascript, clean-code-typescript, domain-driven-hexagon, modular-monolith-with-ddd, react-philosophies, and a pasted clean-code principles text, then fold in the gaps.
- Comment: the six sources agree with most of the existing contract (Result monad, throw `Error`, no bare catch, remove dead code, YAGNI, composition). The audit found seven gaps/conflicts; the code rules now cover commented-out code, journal and positional comments, TODO routing, the throw boundary for guards, the duplication caveat, naming and signature rules, and error reporting via the logger.
- Pros: the contract matches the sources the user named, without importing their full manuals.
- Cons: naming and signature rules add length to the anti-slop section; design-only principles (SOLID, immutability, DDD value objects, architecture tests, TDD) stay out on purpose.

## Alternative: one big clean-code manual in DEVELOPMENT.md

- Rejected. Importing all six sources as rules would duplicate their content, bloat every consumer project, and turn the contract into a style guide. The contract keeps only rules that are project-relevant, behavior-relevant, and not already handled by lint, typecheck, or another skill.

## Related

- The duplication rule (merge lookalike code only when one abstraction fits) extends the pure duplication rule in `.docs/features/duplication-audit.md`; that file owns the search-and-reuse behavior.
