# DOCUMENTATION_SPEC

Contract for product documentation in this project. An agent generating or updating documentation (see the `project-documentation` skill) may not declare documentation complete while any applicable requirement here is unmet. Created on demand; delete if the project ships no user-facing documentation.

## Provenance rule

Every claim in generated documentation traces to exactly one of:

- a `.docs/` decision, feature file, or contract;
- a source location (file and symbol);
- a test name demonstrating the behavior;
- output of an executed command recorded at generation time.

A claim with no traceable source is removed, not softened.

## Feature page

Every documented feature carries:

- description: what it does in one paragraph;
- why it exists: the problem, linked to its feature file or product-spec entry;
- installation / setup: real commands from package scripts;
- basic example: minimal working code;
- advanced example: only when a second example teaches something the first cannot;
- API: signatures used by this feature;
- configuration: options, defaults, constraints;
- edge cases: limits, error paths, recovery behavior proven by tests;
- performance implications: only with measured numbers and their artifact path;
- security implications: only from SECURITY.md facts (capability budget, redaction), never generic advice;
- related features: links.

Sections that do not apply are marked "not applicable" with a reason instead of being padded.

## API entry

Every documented public API entry carries:

- signature copied from the real exported symbol;
- parameters with types and meaning;
- return value including the empty/none case;
- errors: stable error type, code, and when each is raised;
- example: runnable code;
- advanced example: only when needed;
- related entries.

Signatures are checked against the actual exports during validation; a mismatch is a failure of the documentation pass, not a nitpick.

## Benchmark record

Every benchmark mentioned in documentation carries:

- environment: machine class, OS;
- runtime and version;
- methodology: what was measured and how;
- workload: input shape and size;
- results: path to the result artifact plus the numbers quoted from it;
- comparison baseline: against what;
- caveats: what this benchmark does not prove.

Numbers exist only inside result artifacts produced by executed runs. A number without an artifact is deleted on sight.

## Examples

- examples are real files in the repository (`docs/examples/` or equivalent), not inline fiction;
- they compile (or typecheck) with the project toolchain; a broken example fails CI like a broken test;
- imports reference real module paths;
- an example doubling as a regression test is welcome.

## Readiness

The readiness percentage counts documented items over manifest items where both sides follow this spec. The report names the denominator and lists every gap as covered / outdated / missing / unverifiable.
