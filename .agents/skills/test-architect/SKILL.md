---
name: test-architect
version: 1.0.0
description: Designs, writes, migrates, and verifies behavior-focused tests across unit, integration, edge-case, regression, async, concurrency, performance, property, mutation, fuzz, coverage, mocking, flaky, and maintenance modes.
---

# Test Architect

Use this skill when designing tests, adding tests to a feature, fixing a bug with a regression test, or improving an existing test suite.

## Ownership

This skill owns test strategy and test implementation. It reads `.docs/TESTING.md` first when present, then the project agent rules, decisions, module README, package manifest, lockfile, source, tests, and test configuration. It does not silently change production behavior or add dependencies.

Use `test-reviewer` for an independent attack after implementation. The specialist names below are modes, not separate installed skills.

## Required workflow

### 1. Audit behavior

Before writing a test, identify the public behavior, accepted and rejected inputs, outputs, stable errors, side effects, ordering, cleanup, recovery, invariants, and implementation details. Trace callers and boundaries. If the contract is ambiguous, ask or record the assumption before encoding it.

### 2. Build the matrix

For each behavior, consider normal, empty, minimal, maximum, boundary - 1, boundary, boundary + 1, invalid, missing, repeated, duplicate, unexpected, error, partial failure, retry, cleanup, and recovery cases when applicable.

For every axis mark `covered`, `not applicable` with a reason, `deferred` with a return condition, or `unavailable` with a reason. Full-axis review is mandatory; invented tests are not.

### 3. Choose the smallest honest test level

- Pure rules and transformations: unit.
- Real filesystem, streams, persistence, serialization, or protocols: integration.
- Critical cross-system paths: limited end-to-end.
- External boundaries: fakes or mocks at the boundary only.

Do not mock the behavior being tested. Do not test private fields or incidental call counts when observable behavior is available.

### 4. Write strong deterministic tests

Use exact contract assertions, one main behavior per test, parameterization for data variants, clear condition-to-behavior names, and Arrange / Act / Assert where useful. Isolate tests from network, production data, global state, machine paths, wall-clock time, randomness, and order.

For async code, coordinate with promises, barriers, events, flush, completion, or cancellation signals. Never use sleep to wait for work.

### 5. Run every review axis

Always evaluate these modes and record their result:

- `unit-testing`: domain and transformation behavior;
- `integration-testing`: real boundary interactions;
- `edge-case-hunter`: applicable boundary inputs;
- `regression-testing`: bug reproduction before the fix;
- `concurrency-testing`: ordering, lost work, races, cancellation, backpressure;
- `performance-testing`: baseline, current result, threshold, and workload;
- `property-testing`: invariants and shrinking;
- `fuzz-testing`: deterministic seed and saved reproducers;
- `mutation-testing`: meaningful mutation operators and score when available;
- `coverage-analysis`: branch, behavior, error-path, and critical-path evidence;
- `mocking-strategy`: boundary isolation and mock abuse;
- `flaky-test-hunter`: order, timing, environment, and race dependence;
- `test-maintenance`: duplication, brittle assertions, obsolete tests;
- `browser-verification`: for UI claims, capture DOM snapshot, console errors, and network trace via Playwright MCP or equivalent browser tool; verify focus, hover, pressed, and responsive states via computed style, not only screenshots (borrowed pattern, no runtime dep; tool is optional and reported as unavailable with reason when absent);
- `test-reviewer`: independent adversarial pass after writing.

Correctness tests, benchmarks, stress tests, fuzz runs, and mutation runs remain separate artifacts. A missing tool is reported, not hidden. A not-applicable axis still receives a short reason.

### 6. Verify test strength

Ask:

```text
What behavior could be broken while these tests still pass?
```

Mentally mutate removed conditions, changed boundaries, changed ordering, skipped cleanup, swallowed errors, and weakened validation. If no test would fail, strengthen the test or record the gap.

Run exact project commands from `.docs/TESTING.md` and report passed, failed, skipped, not applicable, and unavailable separately. Compilation is not a test.

## Existing suite migration

When tests already exist, use a non-destructive sequence:

1. record baseline commands, results, duration, skips, failures, and observed flakes;
2. inventory tests and classify valuable, weak, flaky, implementation-coupled, duplicate, obsolete, or unverified tests;
3. map them to public behaviors, invariants, errors, and integration boundaries;
4. add missing regression and critical-path tests;
5. strengthen assertions and remove implementation coupling;
6. split mixed-purpose tests only when diagnosis improves;
7. remove duplicates only after equivalent behavior coverage is demonstrated;
8. rerun and compare behavior coverage, failures, flakes, duration, and available mutation evidence.

Do not rewrite all tests for style. Do not delete a test to make the suite pass. If implementation behavior is unclear, stop and ask instead of promoting an accident to a contract.

## Logger and stream profile

When the project contains a logger or stream writer, explicitly inspect message and write ordering, flush, completion, backpressure, partial writes, stream errors, file and directory creation, rotation, append versus overwrite, concurrent writers, high volume, large messages, ANSI formatting, timestamps, metadata, `Error` and nested values, circular metadata, Unicode, newlines, watcher events and cleanup, duplicate events, and shutdown.

Only assert behavior exposed by the logger contract. Do not require an internal buffer shape.

## Regression-first bug mode

Reproduce the defect, write a failing public-behavior test, verify the failure reason, fix the root cause, rerun the regression, then run the relevant and full suites. A minimal test seam is acceptable only when it preserves production behavior and is the correct boundary.

## Output

Report:

- behavior contract and assumptions;
- matrix with covered, not applicable, deferred, and unavailable rows;
- test files and levels;
- error, edge, invariant, async, concurrency, and regression results;
- performance, property, mutation, fuzz, coverage, mock, flaky, and maintenance results;
- exact commands and output summary;
- remaining gaps and return conditions.

A test is valuable only if a meaningful regression can make it fail.
