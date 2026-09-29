# External skills batch 2: review-audit, addy borrows, design excerpts, diagram mode

## Status

- Implementation: implemented.
- Documentation: this feature file and DECISIONS.md.
- Source: user-provided list of 10 external skills, audit session 2026-09-29.

## Idea 1: review-audit skill

- Idea: new skill `review-audit` for a read-only general audit of a selected scope against all project rules. Compliance table plus ponytail over-engineering lens, duplication by concept, security and test spot-checks. Ends at per-package disposition, makes no fixes, writes no files.
- Comment: docs-refactor audits then fixes; REVIEWER.md needs issue files. The gap was a general entry point that only answers what is wrong. Status: new skill created, docs-refactor points to it for read-only runs.
- Pros: one command for "проверь код"; no-fix guarantee keeps audits cheap; ponytail lens finally has a home (README already referenced a local ponytail skill that did not exist).
- Cons: twelfth skill reaches the flat-layout threshold in hp-docs SKILL.md 5.7; partial overlap with REVIEWER.md and docs-refactor audit phase by design (different exit: disposition only).

## Idea 2: interview-me exit for Grill mode

- Idea: "interview me" trigger plus an exit rule (stop when remaining uncertainty no longer changes scope, about 95% confidence), then one-sentence restatement and confirm.
- Comment: Grill mode already asks one question at a time; the missing piece was when to stop. Borrowed from interview-me, paraphrased.
- Pros: interviews converge instead of drifting.
- Cons: the 95% figure is judgment, not a metric; agents must not cite it as measured.

## Idea 3: constraint bar

- Idea: record the quality bar once per non-trivial change (which checks pass, where each runs, what done means); never silence a check to get green.
- Comment: borrowed from constraint-driven development without adding a CONSTRAINTS.md template file; the bar lives in the task plan and outlives it only via DECISIONS.md.
- Pros: no new template file; kills "green by muting" behavior.
- Cons: relies on agent discipline plus the CHECKLIST item.

## Idea 4: doubt pass

- Idea: one adversarial in-flight pass for high-stakes changes (claim, evidence, doubt, reconcile, stop).
- Comment: borrowed from doubt-driven development; complements test-reviewer Pass 2, which attacks finished tests rather than the approach.
- Pros: cheap; catches confident-but-wrong direction early.
- Cons: one more step agents may skip; bounded by "one pass" rule.

## Idea 5: source grounding

- Idea: framework and library claims ground in official docs via the documentation tool, with citation and unverified flags.
- Comment: borrowed from source-driven development; extends the existing mandatory MCP check, which required the tool but not citation.
- Pros: fewer memory-invented APIs.
- Cons: extra calls; cite only what affected the implementation.

## Idea 6: compact result rule

- Idea: ordinary turns deliver the most important content first and stop; no oversized dumps or full-file pastes unless asked; the single recommended action carries `(recommended)` with its reason.
- Comment: extends the terse style from the 2026-09-05 caveman adaptation per user request. Lives in AGENT_PROMPT section 11 and the root AGENTS.md key rule. Never overrides task report structure or hides warnings, security findings, rules, or test evidence.
- Pros: smaller turns by default; recommendations stay explicit.
- Cons: agents must judge "most important"; wrong cuts hide context (mitigated by on-request full detail).

## Idea 7: design excerpts (ui-ux-pro-max, impeccable)

- Idea: take into DESIGN.md only: resilient-text rules plus pre-delivery checklist, AI-slop detector checklist with the Inter exception, product-truth vs visual-direction split, and the review vocabulary (audit/critique/polish/distill/harden/onboard/animate/typeset/layout/colorize).
- Comment: full ui-ux-pro-max catalog rejected (conflicts with the Scandinavian preset, AI-slop risk, context bloat); impeccable binary, hooks, and live mode rejected (supply chain and capability risks). Inter stays allowed as the preset default; flagged only with other telltales.
- Pros: review rubric becomes actionable; no new dependency.
- Cons: detector list needs maintenance as AI tells evolve.

## Idea 8: diagram mode in project-documentation

- Idea: optional diagram contract (archify paraphrase, no renderer): artifact-first typed source, validation before delivery, max 12 primary nodes, no invented topology, source evidence opt-in only, output lives with product docs never in `.docs/`.
- Comment: archify renderer itself not vendored (Node dependency, HTML artifacts to maintain).
- Pros: architecture maps become verifiable instead of improvised SVG.
- Cons: validation is manual until a renderer is adopted.

## Idea 9: rejected for vendoring

- Idea: Graphify, Understand Anything, Awesome catalog, Caveman proxy/middleware, Superpowers pack, Addy pack, UI/UX Pro Max catalog stay out.
- Comment: Graphify and Understand Anything duplicate the manual audit plus available code-graph tooling and cost a runtime; Awesome is an index not a skill (plus Composio gateway upsell is an undeclared outbound); Caveman runtime is BSL plus telemetry against least-privilege while its style is already adapted; Superpowers and Addy packs are already condensed, only four Addy patterns were missing (ideas 2-5).
- Pros: no new dependencies, no trigger conflicts, no telemetry.
- Cons: none recorded; revisit on real pain only.

## Alternatives

- New CONSTRAINTS.md template file: rejected, plan plus DECISIONS.md carry the bar.
- Thirteenth-plus skill split now: rejected, flat layout stays at twelve per the recorded 5.7 note.
