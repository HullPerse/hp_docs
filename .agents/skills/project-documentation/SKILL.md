---
name: project-documentation
version: 1.0.0
description: >
  Generates user-facing product documentation from the knowledge a project already
  has: .docs/ contracts, public API surface, tests as behavior evidence, and benchmark
  result files. Builds a documentation map, generates pages per DOCUMENTATION_SPEC,
  validates examples compile and links resolve, and reports readiness percentage with
  gaps. Documentation is derived, never invented. Use when the user says
  "собери документацию", "generate docs", "build documentation from project knowledge",
  "документация проекта", or asks to turn .docs into README/API guides/docs site.
---

# Project Documentation

Generates product documentation (README sections, guides, API reference, recipes) from what the project already contains: `.docs/` contracts, source code, tests, and recorded results. The skill never reconstructs the project from scratch and never invents facts, numbers, or behavior.

## Sources of truth

Read before generating anything:

- `.docs/DECISIONS.md`, `.docs/features/*.md`, `product-spec.md` - what exists and why;
- `.docs/SECURITY.md` - capability budget and security implications per feature;
- `.docs/TESTING.md` - where behavior evidence lives; test files prove documented behavior;
- `.docs/DEVELOPMENT.md` - conventions the documentation text must follow;
- public exports of the source tree (entry points, exported symbols, configuration types);
- benchmark result artifacts (`benchmarks/results/*.json` or equivalent) - the only allowed source of numbers.

If `DOCUMENTATION_SPEC.md` exists at the project root, it is the completeness contract; generate against it. If it does not exist, propose creating one from the bundled template before generating.

## Workflow

### 1. Discover

Build an in-memory manifest of everything documentable:

- features (from feature files, product spec, changelog);
- public API entries (from exports, typed signatures);
- executable example candidates (existing examples, snippets in tests);
- benchmark records (result files with environment metadata).

Record where each item's ground truth lives (file paths). An item without locatable ground truth is marked undocumented-source, not invented.

#### Legacy docs ingestion (optional, no dependency)

If the project has non-markdown sources (docx, pdf, html, slides), inventory them separately:

1. List legacy files and their purpose; mark which are still authoritative vs outdated.
2. Convert via a local tool such as MarkItDown when the user requests it; do not install it silently and report unavailable with a reason when absent.
3. Treat converted content as draft input to the manifest, not as truth: every claim still needs a code, test, or decision source before it enters generated docs.
4. Validate encoding after conversion (reference the 2026-08-22 encoding incident: explicit UTF-8, no PS 5.1 Get-Content without encoding).

Skip this subsection when no legacy docs exist.

### 2. Map

Diff the manifest against existing documentation (`README.md`, `docs/`). Output the map: covered, outdated, missing. Outdated means the doc claims something code, tests, or decisions contradict.

### 3. Generate

Write pages per the spec contract: every feature page carries the required sections, every API entry its required fields, every benchmark record its required fields. Prose follows the project anti-slop rules. Structure adapts to the project size: a micro-tool gets one README; a library gets `docs/` with getting-started, configuration, api, examples, recipes.

Rules during generation:

- numbers come only from executed runs and their recorded artifacts; no metric without a result file or command output;
- do not document behavior that code and tests do not demonstrate; a desired-but-missing behavior becomes a gap entry, not prose;
- every claim traces to a decision, a source location, a test name, or a command output;
- security implications come from SECURITY.md (capability budget), not from generic advice.

### 4. Validate

Run what the stack allows and report each result separately:

- compile or typecheck example files (tsc, cargo check, or equivalent); a broken example fails the pass;
- link check across generated files (lychee or manual walk when unavailable);
- markdown structure lint (markdownlint or equivalent) when configured;
- API accuracy spot-check: signatures in docs match real exported signatures;
- run the relevant test suite if generation touched example files that double as tests.

Never install tools without permission; unavailable checks are reported with reasons.

### 5. Report readiness

Output:

```text
Documentation readiness: N%
Covered: feature X (source: features/x.md), API Y (src/y.ts), ...
Outdated: page Z claims A, code does B (evidence)
Missing: feature W has no page; API V lacks error docs
Unverifiable: ... (reason)
Next concrete action: ...
```

The percentage is documented items over manifest items by the spec definition. State the denominator. Never round up enthusiasm.

## Tool guidance

Recommendations only; compare before installing, respect the packages-first rule:

- API extraction: TypeDoc or API Extractor (TypeScript), cargo doc + cargo public-api (Rust), mkdocstrings (Python). Generated API reference guarantees signature accuracy; prose explains the human side.
- Docs site: VitePress (fast, Vue-free content works), Docusaurus (versioning, search, heavier), Starlight (Astro, content-first), mdBook (Rust-flavored, minimal), MkDocs (+ Material, Python projects). The site renders documentation; it never owns it.
- Validation: lychee (link checking), markdownlint (structure), Vale (prose linting) when the project wants style enforcement.

Stack-adaptive: pick per detected toolchain, mark `(recommended)` only with justification, install nothing silently.

## Constraints

- Read-only toward `.docs/`: this skill consumes contracts, it does not rewrite them; corrections flow back through the normal disposition gate.
- Generated docs live where the project keeps them (`docs/`, README); they are consumers of project knowledge, alongside any site.
- Anti-slop applies fully to generated prose: no filler intros, no invented specifics, ASCII punctuation per project rules.
- Update `.docs/DECISIONS.md` when generation revealed contradictions that needed user decisions.
