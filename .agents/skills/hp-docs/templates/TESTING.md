# {{PROJECT_NAME}} Testing Contract

This document defines how tests are designed, migrated, reviewed, and verified in this project. The project-specific commands, frameworks, isolation rules, and available tools are recorded during initialization.

## 1. Test setup

- Test runner: {{TEST_RUNNER}}
- Unit command: {{UNIT_TEST_COMMAND}}
- Integration command: {{INTEGRATION_TEST_COMMAND}}
- Full command: {{TEST_COMMAND}}
- Coverage command: {{COVERAGE_COMMAND}}
- Mutation command: {{MUTATION_COMMAND}}
- Benchmark command: {{BENCHMARK_COMMAND}}
- Fuzz or property command: {{FUZZ_COMMAND}}
- Test directory: {{TEST_DIRECTORY}}
- Test isolation: {{TEST_ISOLATION}}
- External services: {{EXTERNAL_SERVICE_POLICY}}

Unavailable commands are written as `unavailable` with a reason. A command is never implied by a framework name.

## 2. Behavior before tests

Before writing or changing a test, identify:

- public behavior and the boundary where it is observed;
- accepted and rejected inputs;
- expected outputs and stable error type, code, and context;
- side effects, ordering, persistence, cleanup, and recovery behavior;
- invariants that must survive transformations or repeated operations;
- implementation details that must not become test contracts.

Read the relevant docs, public types, callers, implementation, configuration, and existing tests. If the intended behavior is ambiguous and the choice changes the test, ask or record the assumption before coding. Do not turn an accidental implementation detail into a requirement.

## 3. Test design

For each public behavior, build a test matrix. Consider the cases that apply to the contract:

- normal input;
- empty and minimal input;
- maximum and boundary - 1, boundary, boundary + 1;
- missing, malformed, invalid, and unexpected input;
- repeated, duplicate, and out-of-order input;
- failure, partial failure, recoverable failure, fatal failure, retry, retry failure, and cleanup after failure;
- side effects, ordering, cancellation, and recovery.

The matrix is a reasoning tool. Every row is marked `covered`, `not applicable` with a reason, `deferred` with a return condition, or `unavailable` with a reason. Do not pass values that the type or public contract cannot accept merely to enlarge a checklist.

Every test answers: "What meaningful regression would make this test fail?" A test with no clear answer is removed or redesigned.

## 4. Assertions and names

Test observable behavior, not private fields, call counts, internal buffers, or incidental control flow. Assert the exact result, state transition, emitted event, persisted value, or stable error contract when the contract exposes it.

Prefer specific assertions over `toBeTruthy`, `toBeDefined`, or non-empty checks when a stronger assertion is possible. Generic assertions are valid when truthiness or definedness is the actual public contract.

Use names that describe condition and behavior, for example:

```text
preserves input ordering when writes complete out of order
returns a typed validation error when the title is empty
```

Keep one main behavior per test. Use parameterized tests when data changes but the behavior does not. Do not split one behavior into many tests just to increase the count.

Arrange, Act, Assert is the default structure. Omit comments when the code already makes the phases clear.

## 5. Test levels and boundaries

- Unit tests cover domain rules and pure transformations in isolation.
- Integration tests cover real interactions with persistence, filesystem, streams, protocols, and serialization.
- End-to-end tests are limited to critical user or system paths where lower levels cannot prove the contract.
- Fake services isolate external dependencies. Mocks are used at boundaries such as network, clock, randomness, filesystem, or expensive external services, not for ordinary internal functions.
- A test must not replace an integration test with mocks when the behavior under test is the integration boundary itself.

Keep tests isolated from the network, production data, user credentials, machine-specific paths, wall-clock time, random output, and test order. Use temporary resources and deterministic fixtures.

## 6. Edge cases and errors

Edge-case testing is a separate design pass. Consider empty strings, whitespace, zero, negative values, `NaN`, infinity, very large values, long strings, Unicode, duplicates, malformed values, missing fields, and unexpected types when the boundary allows them.

For loggers and stream writers also consider empty and huge messages, ANSI sequences, newlines, tabs, multiple and duplicate tags, empty and huge metadata, circular objects, `Error` objects, nested objects, partial writes, backpressure, stream errors, rotation, append versus overwrite, watcher cleanup, duplicate events, and shutdown.

Error tests check the stable type, code, context, side effects, cleanup, and recovery result exposed by the contract. They do not assert exact message text unless message text is itself part of the contract.

## 7. Async and concurrency

Async tests cover ordering, lost or duplicate work, premature completion, unhandled rejections, backpressure, cancellation, cleanup, retries, and deadlock or race risks where applicable.

Coordinate tests with real promises, barriers, flushes, stream completion, events, or explicit signals. Never use sleep-based synchronization. A fake clock is allowed only when time is a boundary of the behavior and the test advances it explicitly.

Concurrency tests must control the schedule so that a failure is repeatable. Do not claim race coverage from one lucky parallel run.

## 8. Properties, fuzzing, and mutation

Use property-based tests when an invariant gives stronger protection than a list of examples. Useful properties include valid output for every accepted input, serialize-then-parse preservation, idempotent normalization, stable ordering, and unrelated metadata not changing the message.

Fuzz and property runs use deterministic seeds, bounded work, shrinking when supported, and an explicit oracle or invariant. Save a minimal reproducer for every discovered failure.

Mutation testing asks whether tests fail when a condition, boundary operator, error path, ordering rule, or cleanup action is changed. Run the configured mutation command for critical or changed code when available. Mental mutation review is required as a design step, but it is not evidence of a mutation score.

## 9. Regression-first

For a reproducible bug:

1. reproduce the bug;
2. write a failing regression test against the public behavior;
3. verify that the test fails for the right reason;
4. fix the root cause;
5. run the regression test;
6. run the relevant suite and required full checks.

Do not change production code only to make a weak test pass. A minimal test seam is allowed when it preserves behavior, has a clear boundary, and is documented as part of the test design.

## 10. Performance and load

Correctness tests, benchmarks, stress tests, and load tests are separate artifacts. Performance checks are required for every task as an analysis pass, and an executable benchmark or stress test is added when the changed path is performance-sensitive or has a stated budget.

A benchmark records environment, workload, baseline, current result, difference, and regression threshold. Use throughput, latency percentiles, memory, or allocations as appropriate. A microbenchmark does not prove application-level performance.

Never hide a correctness failure inside a benchmark. Never set an arbitrary threshold without a baseline or an agreed budget.

## 11. Coverage and quality

Coverage percentage is evidence about executed code, not proof of test quality. Review line, branch, behavior, error-path, and critical-path coverage. Mutation score is useful evidence when a supported tool can run.

A coverage report must state its command, scope, result, exclusions, and limitations. Do not add tests solely to satisfy a percentage. A changed critical branch without a meaningful test is a gap even when line coverage is high.

## 12. Existing test-suite migration

When tests already exist, use this order:

1. record the current commands, results, duration, failures, skips, and flakes as a baseline;
2. inventory tests and classify them as valuable, weak, flaky, implementation-coupled, duplicated, obsolete, or unverified;
3. map tests to public behaviors, invariants, error paths, and integration boundaries;
4. add missing regression and critical-path tests before deleting anything;
5. strengthen weak assertions and replace implementation coupling with contract assertions;
6. split mixed-purpose tests only when separate failures improve diagnosis;
7. remove duplicates only after equivalent behavior coverage is demonstrated;
8. re-run the baseline commands and compare failures, coverage, mutation evidence, duration, and flake rate.

Do not rewrite a suite wholesale for style. Preserve useful tests, keep a migration record, and get a decision before a removal that could hide lost coverage.

## 13. Required review passes

Every non-trivial testing task has three passes:

### Pass 1: design and implementation

Understand behavior, create the matrix, choose test levels, write tests, and run the relevant checks.

### Pass 2: adversarial attack

Assume the tests are wrong until proven otherwise. Ask what broken implementation would still pass. Check weak assertions, false positives, missing branches and errors, mock abuse, duplicated coverage, implementation coupling, flakiness, and missing edge cases. Apply the full testing-axis checklist even when the result is `not applicable` or `unavailable` with a reason.

### Pass 3: verification

Run tests, typecheck, lint, coverage, mutation, property or fuzz, benchmarks, and stress checks according to the project setup. Record exact results and separate passed, failed, skipped, not applicable, and unavailable checks.

## 14. Test report

The task report includes:

- behavior contract and assumptions;
- test matrix and coverage gaps;
- changed and new tests by level;
- errors, edge cases, invariants, and regression risks;
- determinism and isolation notes;
- concurrency, performance, property, mutation, fuzz, and coverage results;
- migration baseline and comparison when existing tests were changed;
- exact commands and results;
- remaining risks and return conditions.

The final question is always:

```text
What behavior could be broken while these tests still pass?
```

A test is valuable only when it can fail for a meaningful regression.
