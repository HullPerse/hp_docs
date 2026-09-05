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

### 2026-08-25: Parallel sessions protocol added

- Decision: template gains a "Parallel sessions" subsection in AGENT_PROMPT section 2 next to the DECISIONS gate. Assumption: several agents may hold sessions in the same repository concurrently; the repository is the coordination layer - documentation is shared memory, current code is ground truth, DECISIONS.md is the message bus between sessions. Four mandatory sync points: on start (check working tree for foreign dirty files), before asking (re-read the DECISIONS.md tail - another session may have recorded the answer), before writing (re-read files loaded earlier; a stale-read edit is a silent overwrite), on finish (append decisions and list changed files before the final report). Collisions stop for the user instead of silent resolution. Mirrored into DEVELOPMENT.md ("Mandatory decision journal"), CHECKLIST.md (git-status check before coding, no stale-read overwrites during coding), and the root AGENTS.md key rule "Agents run in parallel".
- Context: user requested a rule forcing agents to cross-check DECISIONS.md, other docs, and current code so parallel sessions stay consistent.
- Consequence: every project initialized from the template assumes multi-agent work by default. Added as a subsection, not a numbered section, so health-check counters (AGENT_PROMPT 12) stay unchanged.
- Source: parallel-agents rule task, 2026-08-25.

### 2026-08-24: Developer-encyclopedia proposal rejected, kernel adopted as evidence rules

- Decision: the proposed tool encyclopedia (hundreds of pages across docs/dev/security/testing/databases/frontend categories) is rejected: static tool facts rot faster than rules, duplicate the mandatory context7 documentation flow, and would ship into every consumer project's `.agents/skills/`. Adopted instead: a fixed package-comparison schema (purpose fit, activity/support, license, size, transitive dependencies, security surface, performance where relevant, when-not-to-use) in CHECKLIST; a no-invented-numbers rule in AGENT_PROMPT Performance and TESTING.md (metrics only from executed commands and recorded artifacts); a pre-change walk bullet in the AGENT_PROMPT audit checklist (entry points, callers, dependencies, tests, types, configuration, side effects); a suppression-requires-recorded-reason rule in DEVELOPMENT anti-slop. Proposals already covered verbatim by existing rules (ponytail ladder, typing rules, patterns-on-proof, security auto-reporting) were not duplicated.
- Context: user shared an external "Developer Encyclopedia + Engineering Playbook" plan and delegated per-item decisions after audit.
- Consequence: knowledge stays procedural and small; tool facts stay with live documentation sources.
- Source: encyclopedia/playbook evaluation task, 2026-08-24.

### 2026-08-24: Project-documentation generation adopted in reduced form

- Decision: add skill `project-documentation` plus optional root template `DOCUMENTATION_SPEC.md`. The skill derives product documentation from project knowledge (.docs contracts, public exports, tests, benchmark artifacts), builds a manifest-based map, generates against the spec, validates examples compile and links resolve, and reports readiness percentage with named gaps. Rules baked in: numbers only from recorded results; no documenting behavior absent from code/tests; every claim traces to decision, source, test, or command output. Rejected from the original proposal: a parallel `docs-project/` catalog (duplicates `.docs/`), a permanent manifest file (the skill builds it during discovery), docs-site installation (renderers stay an advisory comparison table inside the skill). Activation is on-demand via trigger phrases, like ROADMAP.md - no initialization question added.
- Context: user wants to generate coherent product documentation for projects such as hp_logger from existing knowledge rather than free-form writing.
- Consequence: bundled skills grow to ten; sync scripts carry DOCUMENTATION_SPEC.md; first-run optional files list mentions it.
- Source: documentation-generation task, 2026-08-24.

### 2026-08-24: Light cleanup now, structural dedup deferred

- Decision: fix stale content found by audit immediately (hp-docs skill: leftover "Russian language" strict rule, drifted protocol item count, Q2 missing non-JS manager options; docs-onboard minimum reading missing TESTING/SECURITY contracts; docs-refactor compliance table missing Security row; mini-project reading list missing SECURITY.md). Deferred as a separate dispositioned package: rewriting the hp-docs skill to single-source the initialization questions and template outlines (currently duplicated across first-run.md, the skill, and README) because it is the installer-critical master skill. Return condition: next drift incident in that skill or a dedicated cleanup session.
- Context: user asked for repo cleanup ("фигня всякая"); triple duplication has caused drift twice already.
- Consequence: drift sources documented; the risky rewrite is not silently mixed into feature work.
- Source: documentation-generation task, 2026-08-24.

### 2026-08-24: One security skill plus always-on reporting instead of a skill family

- Decision: expose one security skill, `security-audit`, with all specialist domains (dependency supply chain, secrets, injection, prototype pollution, path traversal, filesystem, process execution, SSRF, auth, input validation, output sanitization, logging security, crypto, races, DoS, serialization, config, build, CI, git, privacy, threat modeling) as modes. The proposed thirty-four-skill and five-skill splits are rejected for the same reason fourteen testing skills were consolidated: overlapping triggers and repeated repository analysis. Independently of the skill, every session must report security problems whenever found, even outside task scope; undeclared outbound channels and exposed live secrets are Blockers.
- Context: user asked for security checking integrated like the testing extension; user chose one review skill plus always-important rules over multiple skills.
- Consequence: `skills/security-audit/SKILL.md` added; AGENT_PROMPT gained the always-on reporting rule; AGENTS.md key rules gained the "Security is always on" bullet.
- Source: security extension task, 2026-08-24.

### 2026-08-24: Mandatory SECURITY.md template with capability budget

- Decision: `.docs/SECURITY.md` joins the mandatory template set: security setup with recorded commands (unavailable-with-reason), trust boundaries, capability budget where every outbound channel is declared and justified, twenty-one audit axes with covered/not-applicable/deferred/unavailable statuses, static evidence protocol, exfiltration proof for published packages, npm-package/logger profile, lightweight threat model, findings and fix flow, regression discipline, three review passes, report format closing on "What data could leave this project without anyone noticing?".
- Context: security needed its own contract file with placeholders like TESTING.md, not a section in DEVELOPMENT.md; the central requirement is proving an npm package cannot silently exfiltrate user data.
- Consequence: health check gains SECURITY.md [11/11]; sync scripts carry the new pair; REVIEWER and agents-audit reference it; examples/mini-project demonstrates the reduced internal-tool profile.
- Source: security extension task, 2026-08-24.

### 2026-08-24: Initialization Question 7 sets the security profile

- Decision: first-run asks question 7: which profile fits what the project ships - published npm package, backend with external input, internal tool / CLI, or minimal. No `(recommended)` marker because the answer follows from what the project publishes; unclear cases default to backend for servers and internal-tool otherwise. The duty to report findings never depends on the profile.
- Context: depth must adapt like DESIGN.md adapts to non-UI projects, without letting projects skip the reporting duty.
- Consequence: question counts updated to seven across README, docs-init, hp-docs SKILL.md; placeholder table and per-file actions cover security fields.
- Source: security extension task, 2026-08-24.

### 2026-08-24: Exfiltration evidence standard and logger specifics as embedded profile

- Decision: the proof standard is static analysis plus mandatory recorded commands: channel inventory from the static sweep resolved against the budget, transitive dependency reachability check, manifest lifecycle-script audit, telemetry decision traceable to DECISIONS.md, and command output at the audited revision; dynamic sandbox probing stays optional and is not required by the contract. Logger-specific requirements (secret redaction before write, log-injection resistance, telemetry ban, least-privilege package boundary) live inside SECURITY.md section 6 and the `logger-package-boundary` mode rather than separate skills.
- Context: user fixed "static + mandatory commands" as the evidence bar and chose the embedded profile over a dedicated logger skill.
- Consequence: a claim without inventory and command output must not be reported as proof; six proposed logger-* skills collapse into one profile section and one mode.
- Source: security extension task, 2026-08-24.

### 2026-08-24: Add a full testing strategy and existing-suite migration flow

- Decision: implement the testing extension now. Add a dedicated `.docs/TESTING.md`, a `test-architect` skill with specialist modes, and an independent `test-reviewer` skill. Require every testing axis to be evaluated and reported: behavior contract, unit, integration, edge cases, errors, determinism, async/concurrency, performance, property testing, mutation testing, regression, fuzzing, coverage, mocking, flakiness, and maintenance. Non-applicable or unavailable checks must carry an explicit reason instead of generating meaningless tests.
- Context: the current template only requires unit tests for domain rules and integration tests for persistence. The user also needs a safe way to improve projects that already contain tests.
- Consequence: new features receive a complete test-strategy pass, while existing suites migrate in stages: baseline, inventory, strengthen or replace, remove duplicates only after behavior coverage is preserved, and re-verify. The test contract is centralized in `TESTING.md`; other docs link to it.
- Source: testing strategy task, 2026-08-24.

### 2026-08-24: Use two testing skills instead of fourteen independent skills

- Decision: expose two skills. `test-architect` owns test strategy and specialist modes; `test-reviewer` independently attacks the resulting tests. The proposed fourteen specialist names remain modes and triggers inside the architect skill rather than separate installed skills.
- Context: fourteen overlapping skills would repeat repository analysis and create unclear ownership for a generic request to write tests.
- Consequence: installation and activation stay small, while the requested capabilities remain available by explicit mode: unit, integration, edge-case, property, mutation, regression, flaky, concurrency, performance, fuzz, coverage, mocking, and maintenance.
- Source: testing strategy task, 2026-08-24.

### 2026-08-24: No second documentation task was provided

- Decision: treat the current request as one testing documentation task. The user will provide no second task for this change.
- Context: the user introduced the message as two tasks but supplied only the testing-plan text.
- Consequence: implementation scope is limited to the testing extension and its template integration.
- Source: testing strategy task, 2026-08-24.

### 2026-08-24: Include hp-docs templates in package metadata

- Decision: include the `templates/` directory in `skills/hp-docs/package.json` files so distribution metadata covers the generated documentation templates as well as `SKILL.md`.
- Context: the testing extension adds a required template, while the package metadata previously listed only the skill prompt.
- Consequence: package-based consumers can receive the template set required by hp-docs initialization.
- Source: testing strategy task, 2026-08-24.

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

### 2026-08-24: History rewrite - Codebuff co-author trailers stripped

- Decision: rewrote the full commit history with git-filter-repo to remove Co-Authored-By: Codebuff <noreply@codebuff.com> and ?? Generated with Codebuff trailers from the first six commits, because GitHub counted Codebuff as a repository contributor through co-authorship. All 14 commits rehashed (HEAD 9c63908 -> 94f7414); tree hash unchanged (5762a4e), so no file content changed. Force-pushed to origin/main.
- Context: user asked to find any codebuff/codebuff-team traces after seeing it listed in contributors; file content, authors, issues, and code search were already clean - only commit-message trailers remained.
- Consequence: contributor graph on GitHub updates asynchronously (cache may lag hours). Old SHAs stay reachable by direct link until GitHub garbage-collects; forks would keep them alive (none known). Pre-rewrite backup: %TEMP%\hp_docs-backup.bundle.
- Source: 2026-08-24 cleanup session.

### 2026-08-26: Three new rules added from hp_logger experience

- Decision: (1) "No bare catch {}" in DEVELOPMENT.md anti-slop: every catch must use Result helpers, log with prefix, record observable state, or carry a comment naming the protected invariant. (2) "Prefer lookup maps over switch/if-else chains" where the value set is stable. Both rules ported from hp_logger's DEVELOPMENT.md where they proved useful during the redaction and performance optimization work. (3) "No AI agent co-author" rule in DEVELOPMENT.md ("must not" section) and CHECKLIST.md (verification pass): the agent never adds AI credits, co-author trailers, or any mention of itself in git commit messages, push annotations, or GitHub PR descriptions.
- Context: user asked to (a) find unique rules in hp_logger and hp_logger_site that the hp_docs template lacks, and (b) add a universal rule forbidding AI co-author attribution in commits, motivated by the earlier Codebuff history rewrite.
- Consequence: template consumers get the catch-safety and lookup-map rules automatically; the co-author ban prevents GitHub contributor graph contamination from any AI agent.
- Source: template rule additions task, 2026-08-26.

### 2026-08-26: Lint toolchain installation step added to first-run flow

- Decision: added Step 3.1 "Install lint/format toolchain" to the first-run flow and the hp-docs SKILL.md. Ships four config templates (`templates/lint/oxlint.library.config.ts`, `oxlint.frontend.config.ts`, `oxfmt.library.config.ts`, `oxfmt.frontend.config.ts`) with full rule sets from hp_logger and hp_logger_site. Covers all lint presets: Ultracite + oxlint/oxfmt (with library/frontend split), Ultracite + Biome, plain oxlint + oxfmt, ESLint + Prettier, and non-JS stacks.
- Context: Q3 in the first-run flow recommended Ultracite + oxlint/oxfmt and documented what configs should exist, but never actually installed packages or created config files for existing projects. The user wanted their hp_logger configs shipped as defaults.
- Consequence: initialization now installs and configures the lint toolchain end-to-end; new projects get working lint/format out of the box instead of documentation-only guidance.
- Source: hp_docs template update, 2026-08-26.

### 2026-08-26: Benchmark-first package comparison rule

- Decision: added "Benchmark-first package comparison" section to DEVELOPMENT.md (section 11) and SKILL.md dependency analysis. When comparing 2+ packages in a performance-sensitive category, the agent writes and runs a minimal micro-benchmark instead of relying solely on documentation claims. Covers HTTP frameworks, parsers, serialization, ORM, bundlers, test runners. Skips for utility libraries where perf is not the differentiator.
- Context: user wanted package recommendations backed by real numbers from the project's own runtime, not external benchmarks that may be outdated or measured on different hardware/workloads.
- Consequence: deep analysis and ad-hoc package comparisons now include actual benchmark results alongside size/support/license metrics; section count in DEVELOPMENT.md increases from 14 to 15.
- Source: hp_docs template update, 2026-08-26.

### 2026-08-27: External skills review - Superpowers and Agent Skills integrated, agency bundles rejected

- Decision: integrate borrowed patterns without dependencies from two senior-engineer packs; reject marketing/social/motion/researcher/operator packs for hp_docs. P0 integrated: (1) Superpowers - socratic brainstorm gate, bite-sized plan format (file + change + verification + rollback), verification-before-completion, two-stage review (spec compliance then quality) into AGENT_PROMPT.md section 5 and CHECKLIST.md, plus anti-rationalization table into AGENT_PROMPT.md section 3; (2) Agent Skills - reference checklists condensed as appendices into TESTING.md (DAMP over DRY, Beyonce Rule, definition of done, anti-patterns, pyramid), SECURITY.md (headers/CORS/auth/input/lockfile supplement), DEVELOPMENT.md (performance and observability checklists), DESIGN.md (review rubric), SECURITY.md capability-budget annotated examples (GitHub MCP, Notion MCP, Playwright), CHECKLIST.md gates, and skill-anatomy guidance into hp-docs SKILL.md. P1 integrated: design review rubric into scandinavian-design SKILL.md and DESIGN.md section 5, browser-verification mode into test-architect SKILL.md, legacy docs ingestion (MarkItDown as optional local tool, encoding caution) into project-documentation SKILL.md, memory tail consolidation into docs-onboard SKILL.md, and when-to-split guidance (wshobson-inspired, deferred split beyond 12 skills) into hp-docs SKILL.md. Explicitly rejected: Karpathy Skills, GStack, all Marketer/Social/Motion packs, Frontend Slides, and whole-agency catalogs as product scope violations (YAGNI, ponytail ladder); documented as paraphrasing only - no verbatim copy per DEVELOPMENT anti-slop rule. No runtime dependencies added; all tools remain optional capability-budget entries.
- Context: user provided 30+ external skill/repo listings across 10 roles and asked what can be integrated without original dependencies, purely in-house.
- Consequence: template contracts gain concrete review gates and checklists without new deps or skill count bloat; hp_docs stays a docs template for coding agents, not an agency bundle. Health check counts unchanged (AGENT_PROMPT 12, DEVELOPMENT 15, TESTING 14, SECURITY 11, DESIGN 7, CHECKLIST 5, REVIEWER 8) because additions are subsections. Sync script run: templates and .agents/skills mirrors rebuilt and hash-verified.
- Source: external-skills integration task, plan at C:/Users/Kocherga/.opencode/plan/hp_docs-external-skills-integration.plan.md, 2026-08-27.

### 2026-08-27: Design references from 10 UI sites condensed into DESIGN.md

- Decision: integrate 10 design references without dependencies as condensed guidance. DESIGN.md section 4 gains shadcn-style variant API, 44x44 touch targets, tabular-nums, text-balance/pretty, aspect-ratio reserve. Section 6 gains three subsections: system completeness checklist (tokens, components, patterns, docs, governance) from designsystemchecklist.com; component sources note (shadcn, coss/Base UI, beautifului/beui/rareui/reui as inspiration only, packages-first evaluation); purposeful motion policy (purpose/frequency/speed, prefers-reduced-motion, transitions.dev vocabulary) from transitions.dev + emilkowal.ski/you-dont-need-animations. scandinavian-design SKILL.md motion section extended with why/when not to animate, Raycast frequency example, tooltip delay/instant-switch, and transitions.dev catalog reference. hp-docs SKILL.md DESIGN template description updated to reflect new subsections. No component code copied, no new dependency; references remain optional inspiration.
- Context: user supplied 10 URLs (beautifului.dev, beui.dev, rareui.com, transitions.dev, ui.shadcn.com, ui-skills.com, coss.com/ui, designsystemchecklist.com, reui.io, emilkowal.ski) and asked to review for design improvements.
- Consequence: DESIGN.md stays 7 top-level sections (additions are subsections); health checks stable; templates and mirrors synced via scripts/sync-templates.ps1. Background/remaining: ui-skills.com and ui.shadcn broader playbooks available for future deep dive when UI work is active; beautifulUI/beui/docs marginalia remain as visual inspiration, not contract.
- Source: design-references task, plan at C:/Users/Kocherga/.opencode/plan/hp_docs-design-references.plan.md, 2026-08-27.

### 2026-09-05: luhaanime naming evidence collected

- Decision: the audit comparison against D:\Projects\dev\iluhaAnime is done from its real files (allowed by the user). Its conventions: `{name}.{category}.{ext}` camelCase without hyphens, max two dots in a source basename, single-word lowercase stems inside domain folders (`search/score.utils.ts`), domain folders under `src/lib/` and `src/config/`, `src/types/*.d.ts` for shared types, tests mirroring sources as `{source}.test.ts`, no barrel files.
- Context: the user pointed at luhaanime as the reference for strict folder and naming discipline during the audit.
- Consequence: luhaanime confirms the folder/role naming model and adds the max-two-dots rule; it also shows that module types currently live in `*.d.ts` files there, which the `.types.ts` decision below will change in the template and later in consumers.
- Source: hp_docs audit session 2026-09-05.

### 2026-09-05: File naming and folder ownership rules revised

- Decision: (1) naming rule is "directory carries the domain, basename carries one concept (camelCase, no hyphens), suffix carries the role" (`button.component.tsx`, `user.api.ts`, `api.config.ts`), not literal single-word enforcement; (2) shared-folder model becomes owner-first: local types/helpers/constants stay next to their owner until a second real consumer appears, then move to `types/`, `lib/`, `config/`, `hooks/`, `api/`; (3) module types move from `types/*.d.ts` to `types/*.types.ts`; `.d.ts` stays reserved for ambient declarations.
- Context: user accepted the audit recommendation over the current strict always-global placement and over the `*.d.ts` convention for ordinary exported types.
- Consequence: DEVELOPMENT.md, AGENT_PROMPT.md directory-boundary text, CHECKLIST.md checks, hp-docs SKILL naming table, and docs-refactor compliance rows need updating in a later implementation pass; luhaanime and risovach-style consumers inherit the change on their next template update.
- Source: hp_docs audit session 2026-09-05, questions 1-3.

### 2026-09-05: slopo adopted as docs-refactor mode, not a bundle

- Decision: slopo itself is not added to hp_docs (AGPL-3.0-or-later, sends source to external embedding APIs on non-local providers). Its idea enters as a duplication-check mode inside the docs-refactor skill: when a real project wants semantic-duplicate review, the mode runs an installed slopo CLI and produces a short decision report (files, symbols, the actual problem, no premature refactor design), with ignore handling for false positives. Unavailable tool is reported as unavailable.
- Context: user chose "mode in docs-refactor" plus the short decision-report format over a separate duplication-audit skill.
- Consequence: no new bundled skill and no slopo dependency now; capability and AGPL/data-boundary caveats are recorded in the feature file.
- Source: hp_docs audit session 2026-09-05, questions 4-5.

### 2026-09-05: deslop extended with anti-slop structure

- Decision: extend the single deslop skill (not new skills) with: three rule tiers (hard gate / purpose gate / quality lock), During and After usage modes, a Delivery Gate evidence report, a code-comment audit mode, and provenance checks for numbers, testimonials, names, and security or performance claims (no fabrication; placeholders marked). The Python contrast checker from anti-slop is rejected.
- Context: user accepted the anti-slop borrowings by multi-select and chose to keep everything inside the deslop skill with brief excerpts in DEVELOPMENT.md.
- Consequence: deslop SKILL.md and the deslop sections of DEVELOPMENT.md/AGENT_PROMPT.md get updated in the implementation pass; UI landing-page patterns from anti-slop stay out of the universal contract.
- Source: hp_docs audit session 2026-09-05, questions 6-7.

### 2026-09-05: UX and performance numbers classified in three levels

- Decision: UX/WCAG numbers enter documentation in three levels: normative (WCAG 2.2: 4.5:1 normal text, 3:1 large text, 24x24 px minimum target where applicable; 44x44 px documented as the comfort target, not the WCAG minimum), heuristics (about 100 ms, 1 s and 10 s response boundaries; 45-90 characters line length; transition timings), and reference (frame envelopes 8.3 ms at 120 Hz and 16.7 ms at 60 Hz with a note that they are not guaranteed JS budgets). Jeff Dean's latency table is kept only as a dated educational reference with a disclaimer, never as a project threshold.
- Context: user chose the three-level split and the reference-with-disclaimer for the Jeff Dean numbers.
- Consequence: DESIGN.md and the performance notes in AGENT_PROMPT/TESTING gain the split; no number becomes a pass/fail acceptance metric without an executed measurement.
- Source: hp_docs audit session 2026-09-05, questions 8-9.

### 2026-09-05: hp-docs-update skill approved

- Decision: add a separate skill `hp-docs-update` that only migrates generated template files in an initialized project to a newer hp_docs template: it reads project metadata, produces a dry-run ADD/KEEP/CONFLICT plan, applies changes only after approval, and never edits DECISIONS.md entries, feature files, reviews, README, or source code. Initialization writes a small metadata file (`.docs/hp-docs.meta.json`: package version, language, preset, generated file list) so the update can compare old template, current file, and new template.
- Context: user approved a new skill with project metadata and a dry-run plus approval flow, scoped to template `.docs` files only.
- Consequence: hp-docs first-run flow and skill list gain the metadata write; update documentation and this feature file become the migration contract.
- Source: hp_docs audit session 2026-09-05, questions 10-13.

### 2026-09-05: Documentation destination for audit decisions

- Decision: accepted audit changes are documented in new `.docs/features/*.md` files (file-organization, deslop-modes, duplication-audit, hp-docs-update, ux-performance-numbers) and mirrored as short entries in this journal; implementation itself is deferred until the user approves the work packages.
- Context: user chose DECISIONS plus feature files over journal-only recording.
- Consequence: five feature files now carry the accepted scope and open the implementation disposition.
- Source: hp_docs audit session 2026-09-05, question 14.

### 2026-09-05: slopo decision overridden - pure doc rule replaces the docs-refactor mode

- Decision: the earlier decision to run duplication review as a docs-refactor mode over an installed slopo CLI is superseded. slopo now enters hp_docs as a plain documentation rule with no scripts and no tooling: before writing any new logic, the agent searches the whole project by concept, reuses an existing implementation when one fits, or records why not; during and after changes it reports semantic duplicates in the code it touched (files, symbols, the actual problem, no refactor sketch).
- Context: the user asked to add "just the slopo principle" to the documentation, without scripts or tooling, overriding the previously chosen mode. This removes the AGPL and external-embedding-API concerns that motivated the tooling-mode guards.
- Consequence: the duplication-audit feature file was rewritten; the rule text landed in AGENT_PROMPT.md, DEVELOPMENT.md, and CHECKLIST.md; no docs-refactor mode and no slopo dependency exists.
- Source: hp_docs audit session 2026-09-05, follow-up on slopo.

### 2026-09-05: Terse chat answer style (caveman adapted)

- Decision: agent chat replies gain a terse style layer, adapted from caveman-style prompts: answer first, no polite openers or closers, no filler words, no recaps and re-statements, every reply as short as the content allows. It layers on top of the required response structure for tasks (Audit / Decisions needed / Scope+Plan / Progress / Verification / Final state) and never replaces it; it never shortens warnings, security findings, hard rules, test evidence, or explicitly requested depth. Documented in AGENT_PROMPT.md section 11 (Response format) only.
- Context: the user proposed caveman-style response rules on top of the existing agent rules and chose the terse-on-structure variant over full telegraphic speech.
- Consequence: chat turns shorten; structured task reports keep their required shape. No new skill and no AGENTS.md rule change beyond the existing format.
- Source: hp_docs audit session 2026-09-05, follow-up on response style.

### 2026-09-05: Audit batch implemented

- Decision: implemented the accepted 2026-09-05 work packages in one pass: naming and folder-ownership rules (owner-first, `types/*.types.ts` for module types) into the contract docs and the hp-docs skill naming table; the slopo pure duplication rule and the terse chat style into AGENT_PROMPT/DEVELOPMENT/CHECKLIST; deslop extended with tiers, During/After modes, Delivery Gate, comment mode, and provenance checks; WCAG/UX/reference number classification into DESIGN.md; new skill `hp-docs-update` plus the `.docs/hp-docs.meta.json` template written by first-run; first-run, docs-init, README, and sync pairs updated for the eleven-skill set and the meta file; six feature files mark the scope implemented (file-organization, deslop-modes, duplication-audit rewritten as the pure rule, hp-docs-update, ux-performance-numbers, chat-answer-style); changelog updated.
- Context: the user answered the follow-up questions and chose "everything now".
- Consequence: sync script run and verified; health check counters unchanged (AGENT_PROMPT 12, DEVELOPMENT 15, TESTING 14, SECURITY 11, DESIGN 7, CHECKLIST 5, REVIEWER 8); DEVELOPMENT count in first-run corrected from 14 to 15.
- Source: hp_docs audit session 2026-09-05, implementation pass.

### 2026-09-05: hp-docs 1.5.0 released

- Decision: the 2026-09-05 batch ships as version 1.5.0: hp-docs skill and package.json bumped from 1.4.2, the meta template example updated, Unreleased changelog content moved to the `[1.5.0] - 2026-09-05` section, commit tagged `v1.5.0`.
- Context: the user asked to release the implemented audit batch as a versioned tag.
- Consequence: installs of main and tag-pinned consumers get the naming/ownership rules, the slopo duplication rule, the terse chat style, the extended deslop, and the hp-docs-update skill.
- Source: release task, 2026-09-05.
