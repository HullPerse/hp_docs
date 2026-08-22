# ai-docs

Universal `.docs/` template system and skills for AI coding agents. Generates project documentation, decision journals, review workflows, runs compliance refactoring, and onboards fresh agent sessions - with audit-before-code, disposition gates, anti-slop rules and a mandatory decision log baked in.

Works with any agent that reads files and runs commands: opencode, Claude Code, Cursor, Codex, Zed, and others (via [skills](https://github.com/vercel-labs/skills) or plain file copies).

## Install

```bash
# All bundled skills into your project (recommended)
npx skills add HullPerse/ai-docs

# bunx / pnpm equivalents
bunx skills add HullPerse/ai-docs
pnpm dlx skills add HullPerse/ai-docs

# Pick specific skills
npx skills add HullPerse/ai-docs --skill ai-docs
npx skills add HullPerse/ai-docs --skill deslop
npx skills add HullPerse/ai-docs --skill docs-refactor
npx skills add HullPerse/ai-docs --skill docs-onboard
npx skills add HullPerse/ai-docs --skill docs-init
npx skills add HullPerse/ai-docs --skill scandinavian-design

# Pin a specific version (tag tree URL)
npx skills add https://github.com/HullPerse/ai-docs/tree/v1.4.0/skills/ai-docs
```

Manual install: copy `skills/*` into your project's `.agents/skills/` and `.docs/` next to your code.

Then open your agent in the project: it detects missing `.docs/` placeholders and runs the first-run flow automatically.

## Install via Your Agent

No terminal needed: open any coding agent in a clean project and paste:

```text
Install the ai-docs documentation package from github.com/HullPerse/ai-docs:
run the docs-init skill, or read its SKILL.md from the repo and follow it.
Ask me every question you need.
```

The `docs-init` skill handles everything end to end:

1. Checks whether the package is already installed.
2. Asks which runner to use (npx / bunx / pnpm dlx), installs into `.agents/skills/`; falls back to `git clone` + manual copy when no JS runtime exists; retries with `--copy` on Windows symlink failures.
3. Verifies all six skills landed with readable frontmatter.
4. Hands off to the first-run flow, which asks the five initialization questions and generates `AGENTS.md` + `.docs/`.
5. Reports what was created and how to update later (`npx skills update ai-docs`).

## Initialize .docs in Your Project

The full package initializes through one skill install - templates travel inside the `ai-docs` skill itself (`skills/ai-docs/templates/`), so nothing else needs downloading.

### Path 1: via the skills CLI (recommended)

```bash
cd <your-project>
npx skills add HullPerse/ai-docs     # lands in .agents/skills/
```

Then open any agent in the project. It finds `AGENTS.md` rules missing and runs the first-run flow automatically:

1. Determines the project state (existing code / empty repo / fresh agent in a documented project).
2. Lists available MCP tools.
3. Scans package files, lockfile, directory tree.
4. Asks five questions: documentation language, package manager, lint preset, design preset, optional product spec.
5. Generates the full `.docs/` from bundled templates with real project data.
6. Runs the docs health check and verifies lint/typecheck/test commands.

### Path 2: manual

```bash
git clone https://github.com/HullPerse/ai-docs
cp -r ai-docs/skills/* <your-project>/.agents/skills/
```

Same flow - the agent picks it up on the next session start.

### What you get

```text
<your-project>/
  AGENTS.md                  # entry point for agents
  product-spec.md            # optional: feature source of truth
  .docs/
    AGENT_PROMPT.md          # session contract
    DEVELOPMENT.md           # permanent conventions
    DESIGN.md                # chosen design preset
    CHECKLIST.md             # implementation checklist
    REVIEWER.md              # independent review prompt
    DECISIONS.md             # decision journal
    ROADMAP.md               # optional, 5+ features
    agents-audit.prompt.md   # rule freshness audit
    features/ reviews/ answers/
```

Documentation language follows Question 1: English canonical by default; pick another language and the agent translates every file during initialization (see `examples/mini-project/` for a filled Russian example).

## The Principles

### Core workflow

- **Audit before code.** Every task starts with analysis. Findings are classified Blocker / Risk / Gap / Optimization / Clear; a Blocker stops work until resolved by the user.
- **Disposition gate.** No new feature starts without two decisions: implementation disposition (now / defer / reject) and documentation destination (existing feature file / new one / DECISIONS.md only).
- **Critical mode.** The agent does not agree with bad ideas. A direct verdict comes with the reason, consequences, an alternative, and the condition that would change it. Sharp language about a decision is allowed; attacks on the person are not.
- **Decision journal.** Every significant decision lands in `.docs/DECISIONS.md` (Decision / Context / Consequence / Source). Conflicts stop and ask; nothing is silently overridden.
- **`(recommended)` discipline.** The marker appears only with real justification, never as filler.

### Text quality

- **Anti-slop**: ASCII punctuation only (no em/en dashes), no comment-parrots, no debug logs, no dead code, no placeholder data, no TODO instead of a logged decision.
- **Deslop catalog** (`deslop` skill + DEVELOPMENT.md): EN/RU banned-word tags, structural tells (rule-of-three, parataxis, significance inflation, throat-clearing), voice preservation, draft -> audit -> final loop.
- **Ponytail ladder** (mode full): YAGNI -> reuse project code -> stdlib -> native platform -> installed dependency -> one line -> minimal code. Bug fixes at the root via caller grep. Laziness is forbidden at trust boundaries, error handling against data loss, security, a11y.
- **Grill mode**: relentless one-question-at-a-time interviews for plans, each question with a recommended answer, depth-first through the decision tree.

### Adaptivity

- **Stack-adaptive data flow**: query-library projects get TanStack Query rules; desktop/CLI projects get background-task rules (UI never blocks); anything else gets equivalent rules agreed at init.
- **Typing by language**: TS (no `any`, boundary `unknown` narrowed via Zod), Rust (Option/Result, isolated `unsafe` FFI), Python (strict typing), Go (error values).
- **Design presets**: Scandinavian (default: alpha ink ladder over white, Inter/system sans, 8px rhythm), neo-brutalism (radius 0, hard shadows), Zed dark (native tools). Custom style rewrites the preset section.
- **Initialization questions**: project language, package manager (Bun recommended), lint preset (Ultracite + oxlint/oxfmt recommended), design preset, optional product spec.

### Tools

- **Mandatory MCP check** at session start: agents list available servers and use them - docs tools (context7) for any library/API question before answering from memory, browser tools for UI verification.

## Documentation Map

| File | Purpose |
|------|---------|
| `AGENTS.md` | Entry point: reading list, key rules, quick start |
| `.docs/AGENT_PROMPT.md` | Session contract: audit, questions, grill mode, ponytail ladder, response format |
| `.docs/DEVELOPMENT.md` | Permanent contract: conventions, typing by language, anti-slop + deslop catalog |
| `.docs/DESIGN.md` | Design presets and UI rules |
| `.docs/CHECKLIST.md` | Before/during/after implementation checklist |
| `.docs/REVIEWER.md` | Independent review prompt (read-only, evidence-based findings) |
| `.docs/DECISIONS.md` | Decision journal |
| `.docs/ROADMAP.md` | Optional phased feature roadmap |
| `.docs/answers/` | Long research answers |
| `.docs/features/` | Feature files (Idea / Comment / Pros / Cons) |
| `.docs/reviews/` | Review issue files |
| `product-spec.md` | Optional single source of truth for the feature set |

## Bundled Skills

| Skill | What it does |
|-------|--------------|
| `ai-docs` | First-run analysis, init questions, template generation, deep analysis, health checks |
| `deslop` | Consolidated prose de-slopping catalog merged from ten upstream anti-slop skills |
| `scandinavian-design` | Deep-dive visual system behind the default DESIGN.md preset |
| `docs-refactor` | Brings an existing codebase to compliance with its own `.docs/` rules |
| `docs-onboard` | Connects a fresh agent chat to a project with existing docs |

Canonical skill sources live in `skills/`; `.agents/skills/` holds synced working copies. Run `scripts/sync-templates.ps1` (or `.sh`) after editing live files.

## Example Project

`examples/mini-project/` shows filled docs on a fictional TypeScript/Bun CLI: what templates look like after first-run, including the decision to drop DESIGN.md and CHECKLIST.md as unnecessary for a non-UI micro-tool.

## References

Built from real production usage and these upstream sources:

- Live examples: [risovach](https://github.com/HullPerse/risovach) (TypeScript web app), hpClean (Rust/GPUI desktop tool)
- Anti-slop lineage: [anti-ai-slop-writing](https://github.com/jalaalrd/anti-ai-slop-writing), [soundshuman](https://github.com/aashaexo/soundshuman), [elithrar/dotfiles anti-slop](https://github.com/elithrar/dotfiles), [stephenturner/skills deslop](https://github.com/stephenturner/skills), [humanizer-skill](https://github.com/aboudjem/humanizer-skill), [slopkit](https://github.com/ehmo/slopkit), [cursor/plugins unslop](https://github.com/cursor/plugins), [blader/humanizer](https://github.com/blader/humanizer), [no-ai-slop](https://github.com/petergyang/no-ai-slop), [stop-slop](https://github.com/hardikpandya/stop-slop)
- Design: [scandinavian-design](https://github.com/ericzakariasson/scandinavian-design)
- Interview format: [mattpocock/skills grill-me](https://github.com/mattpocock/skills)
- Minimalism: ponytail (local skill)
- Tooling presets: [ultracite](https://ultracite.ai), oxlint/oxfmt
- Skills distribution: [vercel-labs/skills](https://github.com/vercel-labs/skills)

## CI

`.github/workflows/docs-check.yml` verifies ASCII punctuation (vendor skill exempt), SKILL.md frontmatter integrity, and that `skills/ai-docs/templates/` matches live files byte-for-byte.

`scripts/pre-commit` is a ready-to-use hook for consumer projects: dash check, explicit `any`, component naming.

## License

[Unlicense](LICENSE) - public domain. Use, copy, modify, sell, whatever. No attribution required, no warranties given.
