---
name: ai-docs
description: Universal .docs template system for AI agents. Handles first-run project analysis, template setup, deep code/dependency analysis, and new project initialization. Use when encountering AGENTS.md with {{...}} placeholders or when setting up .docs/ for a new project.
---

# AI-Docs Skill

Universal `.docs/` template system for AI agents. Provides structured documentation, decision journals, review workflows, and project analysis.

## When to Use

- **First run**: Agent finds `AGENTS.md` with `{{...}}` placeholders in `.docs/`
- **New project**: User wants to initialize `.docs/` for a fresh project
- **Deep analysis**: User wants comprehensive code/dependency/architecture review
- **Repeated access**: Agent needs to read `.docs/` rules before working

## Template Location

Templates live in `github.com/HullPerse/ai-docs`:
```
AGENTS.md              -- agent entry point
first-run.md           -- first-run analysis prompt
README.md              -- documentation
.docs/
  AGENT_PROMPT.md      -- session contract
  DEVELOPMENT.md       -- project conventions
  DESIGN.md            -- design system
  DECISIONS.md         -- decision journal
  CHECKLIST.md         -- implementation checklist
  REVIEWER.md          -- reviewer prompt
  agents-audit.prompt.md -- rules audit
  features/README.md   -- feature file instructions
  reviews/README.md    -- review issues folder
```

## First-Run Flow

When `.docs/` contains `{{...}}` placeholders:

### 1. Scan Project
Read: `package.json`, `Cargo.toml`, `pyproject.toml`, `tsconfig.json`, directory structure, README.

### 2. Determine Stack
- Language and frameworks
- Frontend/Backend
- Database
- Package manager
- Available commands (dev/test/lint/typecheck/build)

### 3. Fill Placeholders
Replace all `{{...}}` with real project data:
- `{{PROJECT_NAME}}` -- from package.json or README
- `{{PROJECT_CONTEXT}}` -- stack + description
- `{{COMMANDS}}` -- scripts from package.json
- `{{DIRECTORY_STRUCTURE}}` -- analyzed dirs
- `{{LINT_COMMAND}}`, `{{TYPECHECK_COMMAND}}`, `{{TEST_COMMAND}}`

### 4. Verify
Run commands to confirm they work. Check directory structure matches.

### 5. Ask User
**Required question after filling templates:**

```
Проект обнаружен и .docs/ заполнен. Выбери:

1. Глубокий анализ существующего проекта -- детальная проверка кода,
   зависимостей, архитектуры с предложениями улучшений.
2. Пропустить анализ -- перейти к обычной работе.
```

### 6. Deep Analysis (if selected)

All strict rules apply: audit, anti-slop, critical mode, decision logging.

#### Code Analysis
- Architecture: responsibility mixing, logic duplication, speculative abstractions
- Typing: `any`, hidden `unknown`, weak types
- Error handling: boundaries, typed errors, graceful degradation
- States: loading, error, empty, disabled, dirty, stale
- Tests: domain rule coverage, integration tests
- Security: secrets in code, XSS, injections
- Performance: memory leaks, unoptimized renders, missing memoization
- Anti-slop: comment-parrots, debug logs, dead code, placeholder data

#### Dependency Analysis
- Outdated packages with modern alternatives
- Duplicate functionality (multiple HTTP clients, etc.)
- Security vulnerabilities
- Heavy packages that can be replaced
- Unused dependencies

For each package: current status, alternative (if exists), comparison (size, speed, support, license), `(recommended)` only with real justification.

#### Tooling Analysis
- Linters and formatters: config freshness, conflicts
- TypeScript: strictness, unnecessary `@ts-ignore`
- Build system: version, optimization
- Test framework: coverage, speed, config

#### Report Format
```
## Deep Analysis: {{PROJECT_NAME}}

### Structure
Architecture and code organization summary.

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

### Summary
- Project health: X/10
- Critical issues: N
- Improvement recommendations: N
- Next step: specific action

### Disposition
- Implementation: [now / defer / reject] for each suggestion
- Documentation: [existing feature file / new / DECISIONS.md]
```

### 7. Log Decisions
Every improvement suggestion gets `disposition` from user:
- **now** -- implement immediately
- **defer** -- write to feature file with return conditions
- **reject** -- write to DECISIONS.md with reason

All decisions go to `.docs/DECISIONS.md` and feature files.

## New Project Initialization

If project doesn't exist (empty repo):

### 1. Ask User
```
Проект не обнаружен. Выбери:

1. Предложить стек и инициализировать проект -- агент предложит
   оптимальный стек и создаст базовую структуру.
2. Только заполнить .docs/ -- минимальные данные, стек определит
   пользователь позже.
```

### 2. Determine Requirements
Ask about:
- Project purpose (web app, CLI, API, library, bot)
- Stack preferences (or trust agent's choice)
- Required platforms (desktop, mobile, web, server)
- References or examples

### 3. Propose Stack
2-3 options with comparison:

| Criteria | Option A | Option B | Option C |
|----------|----------|----------|----------|
| Language | TypeScript | Rust | Python |
| Frameworks | Bun + Elysia | Axum + SQLx | FastAPI + SQLAlchemy |
| Speed | Fast | Very fast | Medium |
| Ecosystem | Wide | Growing | Wide |

Mark `(recommended)` only with real justification.

### 4. Initialize
After stack selection:
1. Create directory structure
2. Initialize dependencies
3. Configure (tsconfig, Cargo.toml, pyproject.toml)
4. Add base scripts (dev, test, lint, build)
5. Create `.gitignore`
6. Fill `.docs/` templates with real data
7. Log all decisions to `.docs/DECISIONS.md`

### 5. Verify
1. Run `dev` -- confirm project starts
2. Run `test` -- confirm tests work (even if empty)
3. Run `lint`/`typecheck` -- confirm configs correct

## Repeated Access

When `.docs/` is already filled (no `{{...}}`):

1. Read `AGENTS.md` for entry point
2. Read `.docs/DECISIONS.md` before audit
3. Read relevant `.docs/features/*.md` for context
4. Follow all rules from `AGENT_PROMPT.md`

## Strict Rules

All rules from the template system apply at all times:
- Audit before code
- Disposition gate for new features
- Anti-slop rules
- Critical mode (don't agree with bad ideas)
- Decision logging in DECISIONS.md
- `(recommended)` only with real justification
- Russian language for questions, ASCII punctuation only
