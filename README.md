# ai-docs

Universal `.docs/` template system for AI agents. Generates comprehensive project documentation, decision journals, review workflows, and performs deep analysis including rule compliance auditing.

## Quick Start

```bash
# Copy templates to your project
cp -r .agents/skills/ai-docs <your-project>/.agents/skills/
cp AGENTS.md <your-project>/
cp -r .docs/ <your-project>/.docs/

# Or just add the skill to your agent
# The agent will detect missing .docs/ and generate them on first run
```

## What It Does

1. **First run**: Analyzes project stack, compares with canonical baseline, generates full `.docs/`
2. **Deep analysis**: Code review + dependency audit + rule compliance checking with refactoring suggestions
3. **Every session**: Enforces audit-before-code, disposition gates, anti-slop rules, decision logging

## Rules

### Core Workflow

- **Audit before code** -- every task starts with analysis, not editing
- **Disposition gate** -- new features require two decisions: implementation (now/defer/reject) + documentation (feature file/DECISIONS.md only)
- **Decision logging** -- every significant decision goes to `DECISIONS.md` with Decision/Context/Consequence/Source
- **Critical mode** -- don't agree with bad ideas; direct verdict with reason, consequence, and alternative

### Anti-Slop

- **ASCII punctuation only** -- no em dash (`---`), no en dash (`--`); use hyphens and commas
- **No comment-parrots** -- comments explain why, not what
- **No debug logs** -- remove before finishing
- **No dead code** -- no unused functions, imports, or variables
- **No placeholder data** -- no fake data in production code
- **No TODO** -- log decisions in DECISIONS.md instead
- **No template intros** -- skip "Here's what I'll do" preambles
- **No marketing language** -- no "seamless", "better experience", "robust solution"

### Code Quality

- **No explicit `any`** -- in written code; `unknown` only in boundary code (JSON parsing, `catch`, external libs)
- **Narrow `unknown`** -- before leaving boundary code, narrow to concrete type via Zod or type guard
- **File naming** -- camelCase basenames with service suffix (`.component.tsx`, `.utils.ts`, `.config.ts`)
- **Directory boundaries** -- types in `types/`, helpers in `lib/`, configs in `config/`, hooks in `hooks/`, API clients in `api/`

### Query/Data Patterns (TanStack Query)

- **One query per file** -- one `useQuery`/`useSuspenseQuery` per file; justify exceptions
- **`data` naming** -- don't rename without reason; use `data?.field` access
- **Explicit states** -- handle `isLoading`, `isError`, `isFetching` separately
- **Server state via Query** -- don't replace query with manual `useEffect`/`useState`

### State Management

- **Single source of truth** -- one store per piece of state
- **No duplicate state** -- server state in Query, client state in Zustand/store
- **No speculative abstractions** -- no empty extension points, no unused interfaces

### UI/UX

- **Focus indicators** -- all interactive elements must have visible focus
- **Required states** -- implement loading, empty, error, disabled, dirty, stale, recovery
- **Design tokens** -- use CSS variables, no hardcoded colors/radii
- **No duplicate components** -- reuse existing ones from `ui/`/`shared/`
- **Accessibility** -- `sr-only` labels for icon-only buttons, keyboard navigation

### Questions & Communication

- **Russian language** -- questions in simple Russian, no mixed English phrases
- **Short labels** -- one thought per option, no marketing filler
- **`(recommended)` marker** -- only with real justification; never when options are equivalent
- **`реши сам` = delegation** -- agent picks the recommended option and logs it
- **Don't ask what docs answer** -- read the code and documentation first

### Testing

- **Tests with features** -- every new feature includes tests in the same change
- **Unit for domain rules** -- pure functions and business logic
- **Integration for persistence** -- database, filesystem, network
- **Fake services** -- mock external dependencies
- **Typecheck + lint + test** -- run all three before marking done

### Documentation

- **DECISIONS.md is mandatory** -- log every significant decision before finishing
- **Feature files** -- plain text style, Idea/Comment/Pros/Cons, no decorative tables
- **Conflict resolution** -- if new decision conflicts with existing, stop and ask user
- **No silent overrides** -- never change behavior without a task

### Reviewer Rules

- **Read-only** -- reviewer doesn't fix code, only reports findings
- **No .docs/ changes** -- except creating `reviews/` issue files
- **Severity levels** -- Blocker/Critical/High/Medium/Low/Gap/Optimization/Cleanup
- **Evidence required** -- every finding needs file path, line number, and proof
- **No fake verification** -- don't claim tests passed without output

## Features

### Stack Analysis

Compares detected project stack against canonical baseline:
- **Backend**: Bun + Elysia + Drizzle + SQLite
- **Frontend**: React 19 + Vite + TanStack Router/Query + Zustand
- **Tooling**: oxlint/oxfmt, Vitest, TypeScript strict

Suggests alternatives only when there's a real, measurable benefit.

### Docs Health Check

After generating `.docs/`, verifies every file has all required sections:
- AGENT_PROMPT.md: 18 sections
- DEVELOPMENT.md: 10 sections
- DESIGN.md: 8 sections
- CHECKLIST.md: 5 sections
- REVIEWER.md: 9 sections

### Rule Compliance Analysis

During deep analysis, checks codebase against `.docs/` rules:
- File organization (types, helpers, configs, hooks, API clients)
- Code quality (no `any`, no debug logs, no dead code)
- Query patterns (one query per file, explicit states)
- State management (single source of truth)
- UI/UX (focus indicators, required states, design tokens)

Outputs a compliance table with PASS/FAIL/WARN per rule.

### Docs Migration

When the skill is updated:
- Compares current `.docs/` with new template
- Reports ADD/UPDATE/KEEP per section
- Never deletes existing decisions
- Re-runs health check after migration

### Git Hooks

Suggests pre-commit hooks for:
- ASCII punctuation check (no em/en dash)
- No `any` in TypeScript files
- File naming conventions

Does not install without user permission.

### Multi-Agent Rules

For parallel agent work:
- DECISIONS.md as single source of truth
- Session source in every decision entry
- Conflict detection protocol (read -> check -> stop)
- Never silently override existing decisions

## Template Files

### Universal (copy as-is)
- `AGENTS.md` -- agent entry point
- `.docs/DECISIONS.md` -- decision journal
- `.docs/REVIEWER.md` -- reviewer prompt
- `.docs/agents-audit.prompt.md` -- rules audit
- `.docs/features/README.md` -- feature file instructions
- `.docs/reviews/README.md` -- review issues folder

### Adapted to project (generated by agent)
- `.docs/AGENT_PROMPT.md` -- session contract with 18 required sections
- `.docs/DEVELOPMENT.md` -- permanent contract with 10 required sections
- `.docs/DESIGN.md` -- design system with 8 required sections
- `.docs/CHECKLIST.md` -- implementation checklist with 5 required sections

## Supported Agents

Works with any AI agent that reads files, runs commands, and writes files:
- opencode (OpenAI)
- freebuff (Buffy/mimo)
- grok build (xAI)
- Any agent with file access

## License

MIT
