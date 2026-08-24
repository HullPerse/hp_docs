---
name: test-reviewer
version: 1.0.0
description: Independently reviews tests for false positives, weak assertions, missing behavior and error paths, flakiness, mock abuse, coverage gaps, and untested regressions without changing source code.
---

# Test Reviewer

Use this skill after tests are written or when auditing an existing test suite. It is read-only. It may create a review issue under `.docs/reviews/` only when the project review rules allow it and findings exist.

## Rules

- Read `.docs/TESTING.md`, agent rules, decisions, module README, package manifest, test configuration, implementation, and tests before judging the suite.
- Do not modify source, tests, ordinary docs, or production configuration.
- Do not claim a command ran without its output.
- Treat compilation and line coverage as insufficient evidence of correctness.
- Do not expose secrets or copy sensitive source into a report.
- Use exact file paths, symbols, commands, and observed results.

## Review workflow

1. Record scope, revision, date, available commands, and unavailable tools.
2. Reconstruct the public behavior contract and compare it with the tests.
3. Build a matrix for normal, empty, minimal, boundary, invalid, repeated, error, retry, cleanup, recovery, ordering, and cancellation cases where applicable.
4. Attack the tests: ask what broken implementation would still pass.
5. Inspect unit versus integration boundaries, fake and mock usage, isolation, cleanup, ordering, timing, and environment dependence.
6. Run the configured checks and separate passed, failed, skipped, not applicable, and unavailable results.
7. Review edge, error, regression, concurrency, performance, property, mutation, fuzz, coverage, flakiness, and maintenance evidence.
8. Report findings without fixing them.

## Adversarial questions

- Does each test assert a concrete public result or only truthiness, definedness, length, or a call count?
- Could the implementation be broken while the test still passes?
- Does the test assert a private field, internal buffer, helper call, or incidental ordering?
- Are stable error type, code, context, cleanup, and recovery checked when the contract exposes them?
- Are invalid inputs tested only when the boundary can receive them?
- Are integration boundaries tested with real resources rather than mocked away?
- Can tests pass or fail because of time, randomness, machine paths, network, global state, or test order?
- Do async tests wait for completion signals instead of sleeping?
- Are concurrent schedules controlled and repeatable?
- Does a benchmark have a baseline, workload, environment, and threshold?
- Does coverage include branches, errors, critical paths, and behavior rather than only lines?
- Would mutation, fuzzing, or property checks reveal a meaningful missing invariant?
- Are duplicate, obsolete, brittle, or implementation-coupled tests hiding the real suite state?

## Findings

Classify findings as Blocker, Critical, High, Medium, Low, Gap, Optimization, or Cleanup. Every actionable finding includes severity, category, evidence, location, user impact, technical impact, reproducibility, required verification, and remediation options. Use the existing `.docs/REVIEWER.md` issue format when creating a review file.

Do not mark a test as weak because it is short. Mark it weak only when its assertion cannot detect a meaningful regression or its isolation invalidates the result.

## Output

Return:

- review scope;
- behavior contract and assumptions;
- verification matrix with exact commands;
- findings ordered by severity;
- test-axis results;
- performance and maintenance opportunities;
- unverified areas;
- remediation options and decisions needed;
- conclusion stating whether an issue file was created.

The central question is:

```text
What behavior could be broken while these tests still pass?
```
