---
name: ai-docs
description: Universal .docs template system for AI agents. Handles first-run project analysis, stack comparison, template setup, deep code/dependency/architecture analysis with refactoring compliance, and new project initialization.
---

# AI-Docs Skill

Universal `.docs/` template system for AI agents. Generates comprehensive project documentation, decision journals, review workflows, and performs deep analysis including rule compliance auditing.

## When to Use

- **First run**: Agent encounters a project without `.docs/` or with incomplete `.docs/`
- **New project**: User wants to initialize `.docs/` for a fresh project
- **Deep analysis**: User wants comprehensive code/dependency/architecture review with refactoring suggestions
- **Repeated access**: Agent needs to read `.docs/` rules before working

## Canonical Stack Reference

The reference stack for comparison (risovach-style TypeScript projects):

**Backend**: Bun + Elysia + Drizzle ORM + SQLite (bun:sqlite)
**Frontend**: React 19 + Vite + TanStack Router/Query + Zustand
**Tooling**: oxlint/oxfmt or eslint/prettier, Vitest, TypeScript strict
**Package manager**: Bun

This is NOT a requirement. It is a baseline for detecting mismatches and suggesting alternatives. The agent must adapt rules to the actual stack.

## First-Run Flow

When `.docs/` is missing or incomplete:

### 1. Scan Project

Read these files and directories:
- `package.json` (or `Cargo.toml`, `pyproject.toml`, `go.mod`)
- `tsconfig.json` (or equivalent)
- `bun.lock` / `package-lock.json` / `yarn.lock` / `pnpm-lock.yaml`
- Directory structure (top 2-3 levels)
- `README.md`
- `.gitignore`
- Existing config files (eslint, prettier, vite, webpack, etc.)
- `backend/` and `frontend/` if monorepo

### 2. Determine Stack

Identify:
- **Language**: TypeScript, Rust, Python, Go, etc.
- **Runtime**: Bun, Node.js, Deno
- **Backend framework**: Elysia, Express, Fastify, Axum, FastAPI, etc.
- **ORM/DB**: Drizzle + SQLite, Prisma + Postgres, SQLx, SQLAlchemy, etc.
- **Frontend framework**: React, Vue, Svelte, Solid
- **Styling**: Tailwind, CSS modules, styled-components, etc.
- **State management**: Zustand, Redux, Jotai, Pinia, etc.
- **Data fetching**: TanStack Query, SWR, useEffect, etc.
- **Routing**: TanStack Router, React Router, file-based, etc.
- **Testing**: Vitest, Jest, pytest, cargo test, etc.
- **Linting**: oxlint, eslint, biome, clippy, ruff, etc.
- **Package manager**: Bun, npm, yarn, pnpm, cargo, pip

### 3. Stack Comparison

Compare detected stack against canonical stack. For each deviation, analyze:

- Is the alternative **better** for this use case? (mark as `(recommended)` if so)
- Is it **equivalent**? (note but no action)
- Is it **worse**? (suggest alternative with justification)

Present findings as a table:

```
| Component | Detected | Canonical | Verdict | Notes |
|-----------|----------|-----------|---------|-------|
| Runtime | Node.js | Bun | equivalent | Node works fine |
| ORM | Prisma | Drizzle | suggestion | Drizzle is lighter, see alternatives |
| State | Redux | Zustand | suggestion | Zustand is simpler for this scale |
```

Only suggest changes where there is a real, measurable benefit. Do not suggest changes just because the canonical stack is different.

### 4. File Naming Analysis

Analyze existing file naming conventions in the project:

**For existing projects:**
1. Scan file names across `src/`, `lib/`, `components/`, `hooks/`, `api/`, `types/`, `config/`
2. Detect patterns:
   - **Casing**: camelCase, PascalCase, kebab-case, snake_case, dot.notation
   - **Suffixes**: `.component.tsx`, `.service.ts`, `.hook.ts`, `.utils.ts`, `.config.ts`, or none
   - **Prefixes**: `use*` for hooks, `I*` for interfaces, or none
   - **Index files**: `index.ts` barrel exports or direct imports
3. Check consistency -- are there conflicting patterns?
4. Adopt the dominant pattern as the project convention

**For new projects:**
1. Detect language and ecosystem
2. Present 4 options to user:

| # | Option | Description |
|---|--------|-------------|
| 1 | **Industry standard** | Standard convention for the language/ecosystem (see table below) |
| 2 | **HullPerse** | `<domain>.<suffix>.<ext>` camelCase with dot separator (see table below) |
| 3 | **Custom** | User describes their own convention |
| 4 | **Decide yourself** | Agent picks based on project type, team size, and ecosystem norms |

3. Mark one option `(recommended)` based on project context:
   - Solo/small project, TypeScript: HullPerse `(recommended)`
   - Large team, ecosystem interop needed: Industry standard `(recommended)`
   - Non-TypeScript: Industry standard `(recommended)`
4. Ask user which to use

**Option 1: Industry standard**

| Language | Convention | Example |
|----------|------------|---------|
| TypeScript/React | PascalCase components, camelCase utils | `Button.tsx`, `useAuth.ts`, `formatDate.ts` |
| Vue | PascalCase SFCs, camelCase composables | `Button.vue`, `useAuth.ts` |
| Rust | snake_case files | `my_module.rs`, `my_struct.rs` |
| Python | snake_case files | `my_module.py`, `my_class.py` |
| Go | snake_case files | `my_package.go` |

**Option 2: HullPerse** (risovach-style)

Pattern: `<domain>.<suffix>.<ext>` (camelCase basename, dot separator)

| Category | Suffix | Example |
|----------|--------|---------|
| UI components | `.component.tsx` | `button.component.tsx` |
| Canvas/Specialized | `.canvas.tsx` | `editor.canvas.tsx` |
| Icons | `.icon.tsx` | `github.icon.tsx` |
| Variants | `.variants.ts` | `button.variants.ts` |
| Routes | `.route.tsx` | `auth.route.tsx` |
| Route pages | `.auth.tsx`, `.menu.tsx`, etc. | `login.auth.tsx` |
| Hooks | `.hook.ts` | `dots.hook.ts` |
| Utils | `.utils.ts` | `color.utils.ts` |
| Contracts | `.contract.ts` | `replay.contract.ts` |
| Configs | `.config.ts` | `api.config.ts` |
| API clients | `.api.ts` | `user.api.ts` |
| Types | `.d.ts` | `auth.d.ts` |
| Tests | `.test.ts` | `canvas.test.ts` |
| Backend services | `.service.ts` | `user.service.ts` |
| Backend plugins | `.plugin.ts` | `auth.plugin.ts` |
| Backend DB | `.db.ts` | `schema.db.ts` |
| Backend entry | `.server.ts` | `app.server.ts` |

**Option 3: Custom**

User describes their convention. Agent documents it in `.docs/DEVELOPMENT.md` and enforces it.

**Option 4: Decide yourself**

Agent logic:
- TypeScript + solo/small team + component-heavy -> HullPerse
- TypeScript + large team + library/plugin ecosystem -> Industry standard
- Non-TypeScript -> Industry standard for that language
- Unclear -> ask user, don't guess

Present findings:

```
File Naming Convention:
  Detected: camelCase files, .component.tsx suffix, use* prefix for hooks
  Consistent: YES (98% compliance)
  Convention adopted: [chosen pattern]
  Exceptions: [list inconsistencies if any]
```

If inconsistencies exist, list them and ask user whether to fix now or defer.

### 5. Generate .docs/ Files

Generate ALL of the following files with full content adapted to the detected stack. Do NOT use placeholders like `{{...}}` -- fill everything with real data from the project.

### 6. Docs Health Check

After generating all files, verify completeness. For EACH file, check that ALL required sections from "Template Files" below are present. Report missing sections:

```
Docs Health Check:
  AGENT_PROMPT.md    [18/18 sections] OK
  DEVELOPMENT.md     [8/10 sections]  MISSING: Critical mode, Anti-slop
  DESIGN.md          [8/8 sections]   OK
  CHECKLIST.md       [5/5 sections]   OK
  REVIEWER.md        [9/9 sections]   OK
  DECISIONS.md       [2/2 sections]   OK
```

If sections are missing, generate them before proceeding. Do not skip health check.

### 7. Verify

Run these commands to confirm they work:
- `bun run dev` (or equivalent)
- `bun run typecheck` (or equivalent)
- `bun run lint` (or equivalent)
- `bun run test` (or equivalent)

Report which commands work, which fail, and why.

### 8. Ask User

After generating `.docs/`, health check, stack comparison, and file naming analysis:

```
Проект обнаружен и .docs/ заполнен.

Стек: [detected stack]
Нейминг файлов: [detected convention or chosen convention for new project]

Несоответствия с каноническим стеком:
[stack comparison table, if any]

Нарушения ней밍а:
[list inconsistencies if any, or "нет"]

Выбери:
1. Глубокий анализ существующего проекта -- детальная проверка кода,
   зависимостей, архитектуры + проверка соответствия правилам
   из .docs/ с предложениями рефакторинга.
2. Пропустить анализ -- перейти к обычной работе.
```

## Template Files (Full Content)

Each file must be generated with COMPLETE content, adapted to the project's actual stack. Below are the required sections for each file. The agent must write full prose, not abbreviated bullet points.

### AGENTS.md (root)

Entry point for agents. Must contain:
- Project name and one-line description
- Quick start commands
- Mandatory reading list pointing to `.docs/` files
- Key rules summary (audit before code, anti-slop, disposition gate, critical mode)
- Available MCP tools if any

### .docs/AGENT_PROMPT.md

The main session contract. Must contain ALL of these sections:

1. **Project context**: backend stack, frontend stack, DB, directory layout
2. **Mandatory reading list**: ordered list of files to read before work
3. **DECISIONS.md gate**: must read before audit, must write after decisions
4. **Disposition gate**: two separate questions before each new feature (implementation disposition + documentation destination)
5. **`(recommended)` rules**: when to use, single-select vs multi-select, when NOT to use
6. **Mandatory first stage: audit**: what to check, classification (Blocker/Risk/Gap/Optimization/Clear), when to stop
7. **Critical mode**: don't agree with bad ideas, direct verdict format, allowed sharp language
8. **Questions and decisions**: hierarchy of truth sources, when to ask, question lifecycle (10 steps)
9. **Planning and implementation**: scope, plan, affected files, test strategy, minimal changes, no speculative abstractions, existing code reuse
10. **Query rules** (if TanStack Query used): one query per file, `data` naming, `isLoading`/`isError` handling
11. **Type rules**: no `any`, `unknown` only in boundary code, narrow before use
12. **Directory boundaries**: where types, helpers, configs, hooks, API clients go
13. **File naming**: project convention detected during first-run (see file naming analysis); preserve established patterns, service suffixes, and casing
14. **Testing contract**: unit for domain rules, integration for persistence, fake services, typecheck + lint + test
15. **Documentation**: update DECISIONS.md, features, DESIGN.md, README
16. **Anti-slop rules**: ASCII punctuation only (no em/en dash), no template intros, no comment-parrots, no debug logs, no dead code, no placeholder data, no TODO instead of decision logging
17. **Response format**: Audit, Decisions needed, Scope+Plan, Progress, Verification, Final state
18. **Available tools**: MCP servers if any

### .docs/DEVELOPMENT.md

Permanent project contract. Must contain ALL of these sections:

1. **Source of truth hierarchy**: explicit user decision > this file > DECISIONS.md > design docs > existing code
2. **Project description**: backend, frontend, DB schema location, docs location
3. **Fixed decisions**: concrete technical choices already made (migrations, roles, rejected approaches)
4. **Communication protocol**: 15-item list of what agent must/mustn't do
5. **Critical mode**: rules for disagreeing with user
6. **Disposition and destination**: full rules for feature disposition flow
7. **Feature file format**: style rules (plain text, Idea/Comment/Pros/Cons, no decorative tables)
8. **Decision journal rules**: mandatory logging, conflict resolution
9. **Anti-slop rules**: text/punctuation, code/architecture, UI/UX subsections
10. **File naming convention**: detected or chosen pattern with examples (casing, suffixes, prefix rules, exceptions)
11. **Documentation index**: what each .docs/ file contains

### .docs/DESIGN.md

Design system documentation. Must contain ALL of these sections:

1. **Atmosphere and identity**: visual style name and principles
2. **Color tokens**: table of `:root` CSS variables with token name, value, purpose
3. **Typography**: font family, weights, sizes, rendering
4. **Spacing, borders, shadows**: border-radius rules, border widths, shadow tokens, spacing scale
5. **Components**: for each major component (Button, Input, Modal, Switch, etc.):
   - Variants with descriptions
   - Sizes
   - Props
   - States (hover, active, disabled)
6. **Motion and interaction**: animation rules, transitions
7. **A11y and required states**: focus indicators, sr-only labels, keyboard navigation
8. **Rules**: what NOT to do (no duplicate components, no hardcoded colors, no changing global rules)

### .docs/CHECKLIST.md

Implementation checklist. Must contain ALL of these sections with specific items:

1. **Before coding**: read docs, check decisions, verify env, search existing code, check packages, compare alternatives, disposition gate, question formatting, scope check
2. **During coding**: single source of truth, directory boundaries, file naming, query rules, minimal changes, no dead code, states implementation, reuse existing components, design compliance, security, tests with features
3. **Verification**: lint, typecheck, test, exception documentation, diff review, anti-slop check, type check, unknown boundary check, file location check, dash check
4. **Feature files**: plain text style, idea/comment/pros/cons, no decorative formatting, code examples only when needed
5. **Documentation**: disposition+destination logging, DECISIONS.md updates, DESIGN.md updates, README updates, review suggestion

### .docs/REVIEWER.md

Independent reviewer prompt. Must contain ALL of these sections:

1. **Reviewer roles**: list of hats (Senior Engineer, Backend, Frontend, Performance, UX, A11y, Security, Test, Code Reviewer)
2. **Mandatory behavior**: 13 rules (no code changes, no .docs/ changes except reviews/, no checkboxes, no claiming tests ran without output, etc.)
3. **Source of truth**: ordered reading list
4. **Review scope selection**: ask user what to review
5. **Review workflow**: 6 steps (record, audit claims, inspect implementation, run checks, performance analysis, code cleanliness)
6. **Finding classification**: severity levels (Blocker/Critical/High/Medium/Low/Gap/Optimization/Cleanup), categories (15 categories)
7. **Remediation policy**: reviewer doesn't fix, provides plan with containment, minimal fix, affected files, tests, alternatives
8. **Issue file rules**: create only when findings exist, single file per run, structure template
9. **Chat response format**: scope, audit summary, verification, findings, performance, decisions needed, conclusion

### .docs/DECISIONS.md

Decision journal. Must contain:
- Extended format template:
  ```
  ### YYYY-MM-DD: Short header
  - Decision: what was decided
  - Context: why this decision was needed
  - Consequence: what changes as a result
  - Source: link to session/task
  ```
- Initial empty state with header
- Conflict rule: when a new decision conflicts with an existing one, stop and ask the user

### .docs/agents-audit.prompt.md

Audit prompt for checking rule freshness. Must contain:
- Audit checklist (all docs consistent, commands correct, structure matches, stack accurate)
- Process (read all .docs/, verify against code, report discrepancies)

### .docs/features/README.md

Feature file instructions. Must contain:
- Structure (one file per feature)
- Feature file template (Status, Description, Requirements, Implementation Notes, Disposition)
- Style rules (plain text, Idea/Comment/Pros/Cons format)

### .docs/reviews/README.md

Review issues folder. Must contain:
- Structure (one file per review issue)
- Review file template (Status, Description, Findings, Recommendation)

## Deep Analysis

When user selects deep analysis, perform ALL of these checks:

### 1. Code Analysis

- Architecture: responsibility mixing, logic duplication, speculative abstractions
- Typing: `any`, hidden `unknown`, weak types
- Error handling: boundaries, typed errors, graceful degradation
- States: loading, error, empty, disabled, dirty, stale, recovery
- Tests: domain rule coverage, integration tests
- Security: secrets in code, XSS, injections
- Performance: memory leaks, unoptimized renders, missing memoization

### 2. Dependency Analysis

- Outdated packages with modern alternatives
- Duplicate functionality (multiple HTTP clients, etc.)
- Security vulnerabilities
- Heavy packages that can be replaced
- Unused dependencies

For each package: current status, alternative (if exists), comparison (size, speed, support, license), `(recommended)` only with real justification.

### 3. Tooling Analysis

- Linters and formatters: config freshness, conflicts
- TypeScript: strictness, unnecessary `@ts-ignore`
- Build system: version, optimization
- Test framework: coverage, speed, config

### 4. Rule Compliance Analysis (Refactoring)

Check the codebase against the rules defined in `.docs/DEVELOPMENT.md` and `.docs/AGENT_PROMPT.md`. For each rule, verify compliance:

**File organization:**
- Are common types in `types/*.d.ts`?
- Are helpers in `lib/*.utils.ts`?
- Are configs in `config/*.config.ts`?
- Are hooks in `hooks/**/*.hook.ts` (or equivalent)?
- Are API clients in `api/**/*.api.ts` (or equivalent)?
- Do files follow the project's detected naming convention (casing, suffixes, prefixes)?

**Code quality:**
- No explicit `any` in written code
- `unknown` only in boundary code, narrowed before use
- No debug logs, dead code, placeholder data
- No comment-parrots (comments that restate code)
- No em/en dash (ASCII punctuation only)
- No TODO instead of decision logging

**Query/data patterns (if TanStack Query):**
- One `useQuery`/`useSuspenseQuery` per file (with justification for exceptions)
- `data` variable not renamed without reason
- `isLoading`/`isError` explicitly handled
- `isFetching` used separately for background refresh

**State management:**
- Single source of truth for each piece of state
- No duplicate state across stores
- Server state via Query, client state via Zustand/store

**UI/UX:**
- All interactive elements have focus indicators
- Loading, empty, error, disabled states implemented
- Design tokens used (no hardcoded colors/radii)
- No duplicate components when existing ones suffice

Present compliance as a table:

```
| Rule | Status | Violations | Files |
|------|--------|------------|-------|
| No `any` | PASS | 0 | -- |
| File naming | FAIL | 3 | foo-bar.tsx, baz-qux.tsx |
| One query per file | WARN | 1 | component.tsx (justified) |
```

### 5. Report Format

```
## Deep Analysis: [PROJECT_NAME]

### Structure
Architecture and code organization summary.

### Stack Comparison
| Component | Detected | Canonical | Verdict | Notes |
|-----------|----------|-----------|---------|-------|

### Findings

#### Code
| # | Type | File/Module | Issue | Recommendation |
|---|------|-------------|-------|----------------|

#### Dependencies
| # | Package | Version | Status | Alternative | Recommendation |
|---|---------|---------|--------|-------------|----------------|

#### Tooling
| # | Tool | Status | Issue | Recommendation |
|---|------|--------|-------|----------------|

#### Rule Compliance
| Rule | Status | Violations | Files |
|------|--------|------------|-------|

### Summary
- Project health: X/10
- Critical issues: N
- Rule violations: N
- Improvement recommendations: N
- Next step: specific action

### Disposition
For each suggestion:
- Implementation: [now / defer / reject]
- Documentation: [existing feature file / new / DECISIONS.md]
```

### 6. Log Decisions

Every improvement suggestion gets disposition from user:
- **now** -- implement immediately
- **defer** -- write to feature file with return conditions
- **reject** -- write to DECISIONS.md with reason

All decisions go to `.docs/DECISIONS.md` and feature files.

## New Project Initialization

If project doesn't exist (empty repo):

### 1. Ask User

```
Проект не обнаружен. Выбери:
1. Предложить стек и инициализировать проект
2. Только заполнить .docs/ -- стек определит пользователь позже
```

### 2. Determine Requirements

Ask about:
- Project purpose (web app, CLI, API, library, bot)
- Stack preferences (or trust agent's choice)
- Required platforms (desktop, mobile, web, server)
- References or examples

### 3. Propose Stack

Compare 2-3 options against canonical stack. For each:
- Language and runtime
- Backend framework
- Database/ORM
- Frontend framework
- State management
- Data fetching
- Testing
- Package manager

Mark `(recommended)` only with real justification (performance benchmarks, ecosystem maturity, team familiarity, project requirements).

### 4. Initialize

After stack selection:
1. Create directory structure matching `.docs/` conventions
2. Initialize dependencies
3. Configure TypeScript, linter, formatter, test framework
4. Add base scripts (dev, test, lint, typecheck, build)
5. Create `.gitignore`
6. Generate full `.docs/` templates with real data
7. Log all decisions to `.docs/DECISIONS.md`

### 5. Verify

1. Run `dev` -- confirm project starts
2. Run `test` -- confirm tests work (even if empty)
3. Run `lint`/`typecheck` -- confirm configs correct

## Repeated Access

When `.docs/` is already filled:

1. Read `AGENTS.md` for entry point
2. Read `.docs/AGENT_PROMPT.md` for session contract
3. Read `.docs/DECISIONS.md` before audit
4. Read relevant `.docs/features/*.md` for context
5. Follow all rules from `AGENT_PROMPT.md`

## Docs Migration

When the skill is updated and existing `.docs/` files need to align with the new template:

### 1. Detect Migration Need

Compare current `.docs/` files against the template sections listed in "Template Files". If any file has sections that:
- exist in the current file but not in the new template (potentially obsolete)
- are required by the new template but missing from the current file
- have changed format (e.g., DECISIONS.md format update)

### 2. Migration Report

Present a migration plan:

```
Docs Migration Plan:

AGENT_PROMPT.md:
  + ADD: Section 10 "Query rules" (new)
  ~ UPDATE: Section 6 "Audit" format (changed)
  - KEEP: All existing sections

DECISIONS.md:
  ~ UPDATE: Format from table to extended (Decision/Context/Consequence/Source)
  - KEEP: All existing decision entries (reformat in place)

DEVELOPMENT.md:
  + ADD: Multi-agent rules section (new)
  - KEEP: All existing decisions and rules
```

### 3. Execute Migration

- NEVER delete existing decisions or accepted rules
- ADD missing sections with content adapted to the project
- UPDATE format of existing sections, preserving their content
- Log the migration itself as a decision in DECISIONS.md

### 4. Verify

Re-run docs health check after migration to confirm all sections are present.

## Git Hooks Integration

During first-run, if the project uses git, suggest pre-commit hooks for automated anti-slop checking:

### Suggested Hooks

1. **ASCII punctuation check**: grep for em dash (`---`) and en dash (`--`) in staged `.md` and `.ts`/`.tsx` files
2. **No `any` check**: grep for `: any` and `as any` in staged `.ts`/`.tsx` files
3. **File naming check**: verify new component files use camelCase basenames

### Implementation

If user agrees, create a simple pre-commit script or husky hook:

```bash
#!/bin/bash
# .git/hooks/pre-commit or husky hook

# Check for em/en dash in staged files
if git diff --cached --name-only | xargs grep -Pn '[\x{2013}\x{2014}]' 2>/dev/null; then
  echo "ERROR: em/en dash found in staged files. Use ASCII punctuation only."
  exit 1
fi

# Check for explicit any in staged TS files
if git diff --cached --name-only -- '*.ts' '*.tsx' | xargs grep -Pn ':\s*any\b|as\s+any\b' 2>/dev/null; then
  echo "ERROR: explicit 'any' found in staged TypeScript files."
  exit 1
fi
```

Do NOT install hooks without user permission. Present as a suggestion with the exact script.

## Multi-Agent Rules

When multiple agents may work on the same project (parallel sessions, CI, different contributors):

### Decision Ownership

- DECISIONS.md is the single source of truth for all agents
- Each decision entry must include a Source field identifying the session/task
- When two agents propose conflicting decisions, the later agent must check DECISIONS.md first and flag the conflict
- Conflicts must be resolved by the user, not by agents overriding each other

### File Locking (Soft)

- Agents should not modify `.docs/` files that another agent is actively editing
- If a conflict is detected (file changed since last read), re-read the file and check if the change is relevant to the current task
- For code files: prefer small, focused changes that are less likely to conflict

### Session Identification

When writing to DECISIONS.md, include session context:
```
### 2026-08-20: Decision header
- Decision: ...
- Context: ...
- Consequence: ...
- Source: [task description or session id]
```

### Conflict Resolution Protocol

1. Agent reads DECISIONS.md before starting work
2. Agent checks for decisions that conflict with the planned approach
3. If conflict found: stop, report to user, wait for resolution
4. If no conflict: proceed, and log any new decisions before finishing
5. Never silently override an existing decision

## Strict Rules

All rules from the template system apply at all times:
- Audit before code
- Disposition gate for new features
- Anti-slop rules (ASCII punctuation, no comment-parrots, no debug logs)
- Critical mode (don't agree with bad ideas)
- Decision logging in DECISIONS.md
- `(recommended)` only with real justification
- Russian language for questions, ASCII punctuation only
- Rule compliance checking during deep analysis
