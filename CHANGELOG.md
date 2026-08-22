# Changelog

All notable changes to the documentation template and skills. Keep a Changelog format; semantic versioning: major - breaking contract changes, minor - new rules/files/skills, patch - wording and fixes.

## [1.4.2] - 2026-08-22

### Added

- Initialization Question 6: backend logging (hp_logger by HullPerse for Bun/Elysia backends, an ecosystem package, or none); recommendation status intentionally neutral until the canonical stack recommendation is revised
- Detailed per-skill descriptions in README (purpose, triggers, inputs for all six skills)

### Changed

- Repository language completed to full English: DECISIONS.md historical entries, CHANGELOG v1.0.0/v1.1.0 sections, and examples/mini-project translated; this overrides the earlier decision to keep the example in Russian as a translate-at-init demo
- Kept deliberately: Russian trigger phrases in skill descriptions and the bilingual deslop word-tag catalog

## [1.4.1] - 2026-08-22

### Changed

- Repository renamed `HullPerse/ai-docs` -> `HullPerse/hp_docs`; local folder renamed accordingly
- Skill `ai-docs` renamed to `hp-docs` (folder, frontmatter name, package.json); all cross-references in README, docs-init, docs-onboard, docs-refactor, first-run and sync scripts updated
- docs-init trigger list now includes both "install hp_docs" and legacy "install ai-docs"
- Pinned-version install example switched from a frozen tag to a `<tag>` placeholder

### Fixed

- skills/hp-docs/package.json: stale license field MIT -> Unlicense, version aligned to 1.4.1, files entry points to SKILL.md

## [1.4.0] - 2026-08-22

### Added

- Skill `docs-init`: agent-driven package installation for clean projects - installation state detection, runner question (npx/bunx/pnpm dlx), git-clone fallback without node, Windows `--copy` symlink fallback, verification of all six skills, handoff to first-run without duplicate questions
- README "Install via Your Agent" section with a copy-paste prompt for users
- Pinned-version install example via tag tree URL in README

### Documented

- Install semantics: CLI installs a snapshot of default branch at run time; updates via `npx skills update`; version pinning only through tag tree URLs

## [1.3.0] - 2026-08-22

### Added

- Clarification rule: the agent must restate its interpretation and ask before implementing when the goal, boundaries, or expected outcome are unclear (AGENT_PROMPT section 4, AGENTS.md key rules, CHECKLIST item)
- "Initialize .docs in Your Project" guide in README: both install paths, first-run steps, resulting file tree

### Changed

- Canonical template language switched from Russian to English: all `.docs/` templates, AGENTS.md, first-run.md translated
- Initialization Question 1 reworded: now controls the language of generated docs and agent communication; non-English choices are translated at generation time (deslop RU word tags stay bilingual by design)
- Russian v1.2 archived as git tag `v1.2-ru`
- examples/mini-project intentionally kept in Russian as a live demonstration of translate-at-init

## [1.1.0] - 2026-08-22

### Added

- Mandatory MCP tool check at session start (AGENT_PROMPT, CHECKLIST, AGENTS.md)
- Stack-adaptive data-flow rules: query library or background tasks, fixed at initialization
- Typing by language: TS / Rust / Python / Go variants in DEVELOPMENT.md
- Optional `product-spec.md` - feature-set source of truth (hpClean pattern)
- Initialization question N5 about the product spec in first-run
- Skill `docs-refactor` - bring a project to compliance with its own `.docs/`
- Skill `docs-onboard` - connect a new agent to a project with existing docs
- Sync scripts `scripts/sync-templates.ps1` / `.sh` with hash verification
- CI workflow `.github/workflows/docs-check.yml`: dashes, skill frontmatter, templates freshness
- Pre-commit hook `scripts/pre-commit`: dashes + any + component naming
- Filled docs example `examples/mini-project/`
- LICENSE (Unlicense) and skill versions in frontmatter

### Changed

- Skill canon moved from `.docs/skills/` to root `skills/` for `npx skills add` compatibility; distribution unchanged - copying into the target project
- first-run.md rewritten as one flow: MCP check, questions, skill installation, DESIGN presets, health check, deep analysis or new project
- Health check switched to real top-level section counters: AGENT_PROMPT 12, DEVELOPMENT 13, DESIGN 7, CHECKLIST 5, REVIEWER 9

## [1.0.0] - 2026-08-22

### Added

- Ponytail ladder (mode full) as an AGENT_PROMPT section; items in CHECKLIST
- Grill mode in the AGENT_PROMPT question protocol
- Deslop catalog: EN/RU word tags, structural patterns, voice preservation, self-check (DEVELOPMENT.md + `deslop` skill from 10 upstream sources)
- DESIGN.md design presets: Scandinavian (default), neo-brutalism, Zed dark
- Initialization questions: documentation language, package manager (Bun recommended), lint preset (ultracite+oxc recommended), design preset
- Optional ROADMAP.md and answers/ templates
- ASCII punctuation brought to its own rule across all files (em/en dash -> hyphen); vendor scandinavian-design kept verbatim
