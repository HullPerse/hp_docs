# todo-cli Testing Contract

This document defines testing rules for the fictional todo-cli example.

## 1. Test setup

- Test runner: Bun test.
- Unit command: `bun test`.
- Integration command: `bun test` with temporary storage configured by the test.
- Full command: `bun test`.
- Coverage command: unavailable in this example.
- Mutation command: unavailable in this example.
- Benchmark command: unavailable in this example.
- Fuzz or property command: unavailable in this example.
- Test directory: tests next to the command or storage module.
- Test isolation: each storage integration test uses a fresh temporary directory and file.
- External services: none.

## 2. Behavior before tests

Tests protect CLI argument parsing, task filtering, completion changes, JSON persistence, corrupted-file errors, and the rule that concurrent access is unsupported. Private helper shape and JSON parsing implementation are not contracts.

## 3. Test design

For each command, cover normal, empty, minimal, repeated, invalid, missing, and error input where that input reaches the CLI boundary. Mark database, network, UI, concurrency, mutation, benchmark, and fuzz cases not applicable or unavailable instead of inventing them.

## 4. Assertions and names

Assert exact task lists, completion state, persisted JSON, exit behavior, and the storage error path. Use names such as `returns an empty list when no tasks exist` and `reports the file path when storage JSON is corrupted`. Keep one main behavior per test.

## 5. Test levels and boundaries

Argument parsing and filtering use unit tests. File creation, read, write, and corrupted JSON use integration tests with temporary files. No network or external service is mocked because none exists.

## 6. Edge cases and errors

Consider empty titles, whitespace titles, missing command arguments, duplicate task ids, an empty file, malformed JSON, missing directories, and write failures. Check the typed storage error and path context when exposed.

## 7. Async and concurrency

The example does not support parallel access, so concurrency is not applicable. Tests must still avoid sleep and wait for returned promises or Bun file operations to complete.

## 8. Properties, fuzzing, and mutation

Property, fuzz, and mutation tools are unavailable in this example. The design pass still checks that filtering preserves task identity and that writing then reading a valid task list preserves its fields.

## 9. Regression-first

A storage or CLI bug gets a reproducer and a failing `bun test` before the implementation fix. The regression runs with the full Bun test command after the fix.

## 10. Performance and load

The CLI handles a small local task list. A benchmark and stress test are unavailable and unnecessary for this example; no performance claim is made.

## 11. Coverage and quality

Coverage percentage is not collected. Review behavior, branches, corrupted input, and storage failures instead of using test count or line coverage as proof of quality.

## 12. Existing test-suite migration

If tests are added later, record the current `bun test` baseline, map tests to CLI and storage behavior, strengthen weak assertions, remove duplicates only after behavior coverage remains, and compare the result with the baseline.

## 13. Required review passes

Pass 1 designs and writes the tests. Pass 2 asks what broken parser, filter, or storage implementation would still pass. Pass 3 records the exact `bun test` result and all unavailable advanced checks.

## 14. Test report

Reports list the behavior matrix, test files, exact command output, error and persistence coverage, unavailable tools, and remaining gaps. Every test must fail for a meaningful regression.
