# {{PROJECT_NAME}} Decisions

User decision journal. The agent must check this file before any question and append decisions after answers, so nothing gets asked twice. All entries are written in English; entries dated before the v1.3.0 language migration were translated from their Russian originals.

## Entry format

```markdown
### YYYY-MM-DD: Short heading

- Decision: ...
- Context: ...
- Consequence: ...
- Source: session/task reference
```

## Entries

<!-- Appended by the agent as decisions are made -->

### 2026-08-22: Skills canonically live in .docs/skills/ [translated from RU]

- Decision: canonical copies of all skills live in `.docs/skills/<name>/`; at initialization they are copied into the target project's `.agents/skills/` for auto-discovery. Working copies under this repo's `.agents/skills/` sync from canonical.
- Context: requirement "skills ship together with docs"; opencode auto-discovers only `.agents/skills/`.
- Consequence: edits go only into `.docs/skills/`, then copies sync; README documents the install model.
- Source: template update session 2026-08-22.

### 2026-08-22: Ten-skill anti-slop collection consolidated into one deslop [translated from RU]

- Decision: instead of installing ten overlapping skills, one internal skill `.docs/skills/deslop/SKILL.md` was created (EN+RU word tags, structural patterns, punctuation limits, voice preservation, self-check, scoring).
- Context: all ten sources target prose, not code; installing them together creates activation noise and trigger conflicts.
- Consequence: originals are not installed; an extract also landed as the "Deslop prose" section in DEVELOPMENT.md and AGENT_PROMPT.md.
- Source: template update session 2026-08-22.

### 2026-08-22: DESIGN.md switches to presets, Scandinavian default [translated from RU]

- Decision: DESIGN.md contains three presets (Scandinavian default, neo-brutalism, Zed dark) plus a selection rule at initialization. A custom user style rewrites its own preset section; common rules stay. The vendored scandinavian-design skill was installed under `.docs/skills/` for deep UI work.
- Context: needed a meaningful design default with user override; user chose "presets + question".
- Consequence: initialization keeps only the chosen preset section; DESIGN_* placeholders removed from first-run; DESIGN health check now counts 7 sections.
- Source: template update session 2026-08-22.

### 2026-08-22: Ponytail ladder built into the rules, mode full [translated from RU]

- Decision: AGENT_PROMPT.md gained section 6 "Minimalism": a 7-rung ladder, root-cause bug fixes via caller grep, no unrequested abstractions, `ponytail:` markers for deliberate ceilings, laziness-forbidden zones (validation, error handling against data loss, security, a11y). CHECKLIST gained three items.
- Context: ponytail base coexists with the existing testing contract (unchanged) and response format (ponytail governs code, not conversation).
- Consequence: AGENT_PROMPT sections 6-10 renumbered to 7-11; AGENT_PROMPT health check temporarily counted 19 sections.
- Source: template update session 2026-08-22.

### 2026-08-22: Grill mode embedded in the question protocol [translated from RU]

- Decision: AGENT_PROMPT.md section 4 gained a "Grill mode" subsection: one question at a time, recommended answer per question, depth-first decision-tree walk, codebase lookup before asking, per-branch outcome recording, closing question about unwritten assumptions.
- Context: the local grill-me skill turned out to be a stub referencing a nonexistent skill; content restored from mattpocock/skills and adapted.
- Consequence: activated by user command ("grill"); no separate skill needed.
- Source: template update session 2026-08-22.

### 2026-08-22: Four initialization questions in first-run [translated from RU]

- Decision: before filling templates the agent asks one batch: project language (Russian recommended), package manager (Bun recommended), lint preset (ultracite + oxlint/oxfmt recommended; alternatives ultracite+biome, plain oxlint/oxfmt, eslint+prettier, none), design preset (Scandinavian recommended). Answers recorded in DECISIONS.md and define commands across docs.
- Context: the template previously did not fix manager or linter; risovach's ultracite pattern taken as canon.
- Consequence: doc commands written through the chosen manager; lint choice names concrete oxlint.config.ts / oxfmt.config.ts configs.
- Source: template update session 2026-08-22.

### 2026-08-22: Optional ROADMAP.md and answers/ added to the template [translated from RU]

- Decision: added templates `.docs/ROADMAP.md` (phased feature map with done/now/deferred/rejected statuses) and `.docs/answers/README.md` (long research answers).
- Context: both files are really used by live projects (hpClean, risovach) but were missing from the template.
- Consequence: created optionally; decisions derived from them duplicate into DECISIONS.md.
- Source: template update session 2026-08-22.

### 2026-08-22: ASCII punctuation brought to its own rule [translated from RU]

- Decision: em/en dashes replaced with hyphens across all templates and repo README. Exception: the vendored scandinavian-design skill stays verbatim as an external source.
- Context: the rules ban long dashes but the templates contained them since creation.
- Consequence: U+2013/U+2014 scan clean outside the vendor folder.
- Source: template update session 2026-08-22.

### 2026-08-22: Encoding incident during mass cleanup [translated from RU]

- Decision: recorded incident: dash cleanup via PowerShell Get-Content/Set-Content without explicit encoding corrupted UTF-8 files (CP1251 misdecode plus loss of Zh/Z/z/zh letters). Files restored from git and templates copies, edits reapplied, final cleanup done via [IO.File]::ReadAllText/WriteAllText with explicit UTF-8.
- Context: PS 5.1 without BOM reads UTF-8 as system ANSI; letters Zh/Z contain bytes 0x96/0x97 which collide with en/em dash bytes in CP1251.
- Consequence: agent rule: any mass edits of text files require explicit UTF-8 encoding and post-write content verification.
- Source: template update session 2026-08-22.

### 2026-08-22: MCP check mandatory at session start [translated from RU]

- Decision: the "Available tools" section of AGENT_PROMPT became a mandatory step: the agent enumerates available MCP servers, uses documentation tools for any library questions before answering from memory, and applies task-appropriate tools instead of workarounds. Items added to CHECKLIST and template AGENTS.md.
- Context: agents routinely forget installed tools and solve tasks by hand.
- Consequence: tool checking enters every session contract in all projects on the template.
- Source: template extension session 2026-08-22.

### 2026-08-22: Data-flow rules become stack-adaptive [translated from RU]

- Decision: AGENT_PROMPT gained a "Data flow rules" subsection: with a query library, TanStack Query rules apply; without one - the background-tasks model (UI never blocks, event subscriptions); other stacks get formulated equivalents agreed with the user. The model is fixed in DEVELOPMENT.md at initialization.
- Context: hard TanStack rules fit only one project type; hpClean showed the GPUI/concurrency pattern.
- Consequence: CHECKLIST references the chosen model; typing similarly moved to language variants (TS/Rust/Python/Go) in the new DEVELOPMENT "Typing by language" section.
- Source: template extension session 2026-08-22.

### 2026-08-22: product-spec.md as optional feature source of truth [translated from RU]

- Decision: optional `product-spec.md` template added to the project root (hpClean pattern): the feature set lives separately from .docs/features; question N5 added to first-run; AGENTS.md references the file when present.
- Context: large product projects need a separate "what we build" file so agents do not disposition features outside scope.
- Consequence: not created by default; features default to features/.
- Source: template extension session 2026-08-22.

### 2026-08-22: Skill canon moved from .docs/skills to skills/ [translated from RU]

- Decision: canonical skill copies now live in root `skills/`; `.agents/skills` mirrors remain working copies. The earlier `.docs/skills` decision was overridden by the user.
- Context: npx/bunx/pnpm dlx skills CLI searches skills/, .agents/skills and similar folders but does not see .docs/skills - README install commands would not work.
- Consequence: `npx skills add hullperse/ai-docs` works directly; distribution into target projects unchanged (copy into .agents/skills); the sync script rebuilds both places.
- Source: template extension session 2026-08-22.

### 2026-08-22: New skills docs-refactor and docs-onboard [translated from RU]

- Decision: two skills added. docs-refactor brings existing code to compliance with its own .docs (PASS/WARN/FAIL compliance table -> work packages -> disposition -> execution -> reverification). docs-onboard connects a fresh chat to a documented project (AGENTS.md -> mandatory reading -> contract summary into chat).
- Context: user needed rules-based refactoring and fast agent connection to existing projects.
- Consequence: full skill set at that point: ai-docs, deslop, scandinavian-design, docs-refactor, docs-onboard.
- Source: template extension session 2026-08-22.

### 2026-08-22: Repository infrastructure [translated from RU]

- Decision: added scripts/sync-templates.ps1 and .sh (template plus mirror rebuild with hash verification; DECISIONS.md excluded from auto-sync - the shipped template stays an empty journal), CI workflow docs-check.yml (dashes outside vendor, skill frontmatter, templates freshness via git diff), scripts/pre-commit (dashes, any, component naming), CHANGELOG.md with versioning (v1.0.0/v1.1.0), versions in skill frontmatter, examples/mini-project (filled micro-CLI docs example).
- Context: manual syncing had already caused desync twice plus an incident; manager-command installs required an npx-compatible layout.
- Consequence: live-file changes require running the sync script; CI catches desync automatically.
- Source: template extension session 2026-08-22.

### 2026-08-22: Unlicense license and health check counters [translated from RU]

- Decision: LICENSE = Unlicense (public domain, any use). Health check switched to real top-level section counters: AGENT_PROMPT 12, DEVELOPMENT 13, DESIGN 7, CHECKLIST 5, REVIEWER 8 (issue-template headings inside code fences do not count), DECISIONS 2.
- Context: earlier counters "9 REVIEWER sections" and "19 AGENT_PROMPT sections" did not match real file structure.
- Consequence: first-run and SKILL.md use exact numbers; README fully rewritten (principles, docs map, three-manager install, references).
- Source: template extension session 2026-08-22.

### 2026-08-22: English becomes the canonical template language

- Decision: all `.docs/` templates, AGENTS.md, and first-run.md translated to English; initialization Question 1 reworded to control the language of generated docs and agent communication; non-English choices are translated at generation time. Russian v1.2 archived as git tag `v1.2-ru` (commit dd7d2d6). examples/mini-project intentionally kept Russian as a live translate-at-init demo.
- Context: user goal is wider adoption; skills and README were already English while core templates were Russian - inconsistency grew.
- Consequence: deslop RU word-tag lists stay bilingual by design (they describe Russian-language slop); every future rule edit happens in English first; repo CHANGELOG entries are English from v1.3.0.
- Source: session of EN migration 2026-08-22.

### 2026-08-22: Clarify incomplete understanding before implementing

- Decision: new rule in AGENT_PROMPT section 4 plus AGENTS.md key rules and a CHECKLIST item: when the goal, boundaries, or expected outcome of a task are unclear, the agent restates its interpretation in one sentence and asks before implementing instead of guessing. Junk-question guard kept: clarification required exactly where being wrong changes scope.
- Context: existing protocol only demanded clarification "on conflict", which let plausible-but-wrong readings through.
- Consequence: interpretation restatement becomes part of the standard question flow for every project on the template.
- Source: session of EN migration 2026-08-22.

### 2026-08-22: Initialization guide added to README

- Decision: README gained an "Initialize .docs in Your Project" section explaining that templates ship inside the master skill, so one `npx skills add HullPerse/hp_docs` call suffices; documents both CLI and manual paths, lists the init questions, and shows the resulting file tree.
- Context: user asked how the full .docs package actually initializes in target projects.
- Consequence: onboarding cost for new users drops to one command plus an agent conversation.
- Source: session of EN migration 2026-08-22.

### 2026-08-22: Repository and skill renamed to hp_docs / hp-docs

- Decision: GitHub repository renamed `HullPerse/ai-docs` -> `HullPerse/hp_docs`; local folder renamed to `D:\Projects\hp_docs`; the master skill renamed `ai-docs` -> `hp-docs` (folder, frontmatter name, package.json) with all cross-references updated across README, docs-init, docs-onboard, docs-refactor, first-run and sync scripts. Historical DECISIONS entries keep the old name as records of past state.
- Context: user wants repo naming aligned with the HullPerse branding; full rebrand chosen over half-rename because zero external installs existed yet - cheapest possible moment.
- Consequence: install commands become `npx skills add HullPerse/hp_docs`; skill flag is `--skill hp-docs`; docs-init keeps the legacy "install ai-docs" trigger phrase for continuity; old tags v1.2-ru/v1.4.0 remain pointing at pre-rename commits.
- Source: session of rename 2026-08-22.

### 2026-08-22: docs-init skill for agent-driven installation

- Decision: new skill `skills/docs-init/SKILL.md` installs the package into a clean project through an agent: detects installation state (installed / empty / already initialized), asks one runner question (npx recommended), installs into `.agents/skills/` with git-clone fallback when node is absent and `--copy` retry on Windows symlink failures, verifies all six skills plus templates, then hands off to the first-run flow which owns all initialization questions. README gained an "Install via Your Agent" section with a copy-paste prompt and a pinned-version example via tag tree URL.
- Context: clean projects had no root AGENTS.md to anchor an agent; installation semantics (default-branch snapshot, no auto-update, update via `npx skills update`, pinning via tree URLs) were undocumented.
- Consequence: full agent-driven path exists end to end; main branch must stay working at all times since every install snapshots it; releases are tagged so users can pin.
- Source: session of docs-init 2026-08-22.

### 2026-08-22: Repository language completed to full English

- Decision: all remaining Russian text in the repository translated to English - DECISIONS.md historical entries (each marked "[translated from RU]"), CHANGELOG v1.0.0/v1.1.0 sections, and the examples/mini-project files. This overrides the earlier decision to keep mini-project Russian as a translate-at-init demo. Deliberately kept: Russian trigger phrases in skill descriptions (activation keys for Russian-speaking users) and the bilingual deslop word-tag catalog (functional data for catching Russian machine-text).
- Context: user invoked our own initialization Question 1 rule against this repo and chose English; mixed-language state was an inconsistency left after the v1.3.0 migration.
- Consequence: repo contains no prose Russian outside functional triggers and deslop data; future entries are English-only.
- Source: session of EN completion 2026-08-22.

### 2026-08-22: Backend logging initialization question added

- Decision: first-run gains Question 6 (backend projects only): hp_logger by HullPerse, an ecosystem package, or none yet. Mirrored into the hp-docs SKILL.md question list; "five questions" texts updated to six across README and docs-init; FIXED_DECISIONS placeholder table gained a logging row.
- Context: user owns hp_logger and wants it offered at initialization, but explicitly deferred revising the canonical recommended stack to a later session - therefore the question carries no `(recommended)` marker yet.
- Consequence: answers land in DEVELOPMENT.md fixed decisions via the FIXED_DECISIONS placeholder; recommendation status to be revisited when the user updates the stack.
- Source: session of EN completion 2026-08-22.

### 2026-08-22: Detailed per-skill README descriptions

- Decision: the Bundled Skills one-line table replaced with per-skill subsections covering purpose, trigger conditions, inputs asked, and outputs for all six skills; closing note documents why RU triggers and the bilingual deslop catalog stay.
- Context: user wanted every shipped skill properly described in README.
- Consequence: skill discovery for humans now matches SKILL.md frontmatter depth.
- Source: session of EN completion 2026-08-22.
