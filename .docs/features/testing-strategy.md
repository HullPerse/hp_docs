# Testing strategy

## Status

- Implementation: now.
- Documentation: new `.docs/TESTING.md` and this feature file.
- Source: testing strategy task, 2026-08-24.

## Idea

Add a full testing contract to the documentation package. The contract requires behavior-first test design, strong assertions, deterministic isolation, explicit error and edge-case analysis, async and concurrency checks, regression-first bug fixes, separate performance evidence, property and mutation review, coverage analysis, and adversarial review.

## Comment

The existing package only states that domain rules need unit tests and persistence needs integration tests. Projects also need a safe migration path when tests already exist. The full testing pass is mandatory as an analysis and reporting step. A test is written only when the behavior is applicable and has a meaningful oracle; otherwise the result is recorded as not applicable or unavailable with a reason.

## Pros

- Makes test design behavior-driven instead of implementation-driven.
- Gives agents a repeatable way to find weak and false-positive tests.
- Covers existing suites without deleting useful coverage blindly.
- Keeps expensive checks visible without confusing them with ordinary correctness tests.
- Gives logger and stream-heavy projects explicit checks for ordering, flush, backpressure, errors, serialization, and cleanup.

## Cons

- Test planning and reports become longer.
- Mutation, fuzzing, benchmarks, and stress checks may require project-specific tools or extra runtime.
- A full review pass can delay small changes unless the agent records short, justified not-applicable results.
- Existing suites may expose behavior that was never documented and require a user decision.

## Approved design

- `test-architect` owns the strategy and specialist modes: unit, integration, edge-case, property, mutation, regression, flaky, concurrency, performance, fuzz, coverage, mocking, and maintenance.
- `test-reviewer` independently reviews tests and does not modify source or ordinary docs.
- `.docs/TESTING.md` is the permanent project contract. `AGENT_PROMPT.md`, `CHECKLIST.md`, `REVIEWER.md`, and `README.md` contain short references and workflow gates.
- Existing test migration is staged: baseline, inventory, behavior mapping, strengthen or replace, remove duplicates only after proof, and re-verify.

## Alternatives

Fourteen independent skills were considered. They were rejected for this change because their responsibilities overlap and a generic testing request would have unclear ownership. They can be split later if real projects show a need for separate activation, isolated dependencies, or different maintainers.
