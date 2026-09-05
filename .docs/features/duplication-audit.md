# Duplication rule from slopo (pure doc principle)

## Status

- Implementation: implemented.
- Documentation: this feature file and DECISIONS.md.
- Source: hp_docs audit session 2026-09-05, follow-up on slopo.

## Idea

Add the useful core of rafal-qa/slopo as a plain rule, with no scripts, no CLI, and no tooling mode: before writing any new logic, the agent searches the whole project by concept, reuses an existing implementation when one fits, or records why not. During and after changes, the agent reports semantic duplicates found in the code it touched (same idea, different naming, far apart). The rule is a normal extension of the ponytail ladder (reuse project code) and of the existing no-duplication anti-slop rule.

## Comment

This overrides the earlier decision recorded on 2026-09-05 (and in the first version of this file) that duplication review runs as a docs-refactor mode over an installed slopo CLI. The user replaced that with the pure rule: no scripts, no external tool, nothing to install. That removes the reasons the mode needed guards in the first place - slopo is AGPL-3.0-or-later and can send source code to external embedding APIs unless a local model is configured. A documentation rule keeps the search-and-justify behavior and drops the tooling, the dependency, and the data-boundary question entirely.

## Idea (text)

- Before writing new logic: search the codebase by concept, not by name; reuse what exists; if nothing fits, note briefly why not in the plan or progress report.
- While reviewing changes: flag implementations that duplicate each other in behavior but differ in naming or location; report them as findings with files and the actual problem, not with a sketch of a refactor.

## Pros

- Catches semantic duplication that grep and name-based reuse miss.
- Zero tooling, zero dependencies, no AGPL or data-boundary exposure.
- Strengthens the existing reuse and no-duplication rules with one concrete behavior.
- Works in every project on the template with no setup.

## Cons

- No automated detection: the search and the duplicate report depend on the agent doing the pass.
- Without a tool, large-codebase sweeps are impractical; the rule targets the code the agent writes and touches.

## Approved decisions

- slopo enters hp_docs as a documentation rule, not as tooling.
- The earlier docs-refactor mode decision is superseded by this one.
- The rule is written into the contract docs (AGENT_PROMPT.md, DEVELOPMENT.md, CHECKLIST.md) as short text.
- Feature documentation stays in this file.
