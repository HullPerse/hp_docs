---
name: docs-onboard
version: 1.0.0
description: >
  Connect a fresh agent chat to a project that already has AGENTS.md and a filled
  .docs/ directory. Reads the entry point, follows its mandatory reading list, checks
  available MCP tools, and returns a compact session contract summary so the agent
  immediately works by the project rules instead of guessing them. Use at the start of
  any session in such a project, when the user says "прочитай доки", "онбордь",
  "загрузи правила проекта", or when AGENTS.md exists with references to .docs/.
  Not for projects with placeholder .docs/ - use the hp-docs first-run flow there.
---

# Docs Onboard

Connects a fresh agent to a project with existing documentation. Outcome: the agent in the current chat works strictly by the project rules and visibly proves it has read them.

## Precondition

A root `AGENTS.md` (or equivalent: CLAUDE.md) references a filled `.docs/`. When files contain `{{...}}` placeholders - do not onboard; suggest the first-run flow from the `hp-docs` skill.

## Procedure

1. **Entry point**: read root `AGENTS.md` fully. Extract: mandatory reading list, key rules, quick-start commands.
2. **Mandatory reading, section-first**: build the heading index of `.docs/*.md` in one action, then read:
   - `.docs/AGENT_PROMPT.md` fully - it is the session contract;
   - `.docs/DEVELOPMENT.md`, `.docs/TESTING.md`, `.docs/SECURITY.md` by section: the ones that constrain the task's stack, tests, or trust boundaries;
   - `.docs/DECISIONS.md` as a tail plus a topic search: last entries verbatim, then a search by module, feature, or error name;
   - `.docs/CHECKLIST.md` before implementation, `.docs/DESIGN.md` before UI work, feature files relevant to the task.

   Sections the task does not touch are read when the task reaches them; name them as not yet read in the summary instead of implying full coverage. Never defer a section the current task depends on.
3. **MCP tools**: enumerate available servers in one action (mandatory check from AGENT_PROMPT).
4. **Contract summary** - output compactly into the current chat:

```markdown
## Project contract: {{NAME}}

Stack: ...
Commands: lint/typecheck/test via ...

Hard rules (top level):
- ...
- ... (7-10 items max)

Source-of-truth hierarchy: user > DEVELOPMENT > DECISIONS > design/README > code.

Recent decisions from DECISIONS.md (date + heading):
- ...
- ...

Open dispositions / roadmap tails: ... or "none".

Unverified areas: ... or "everything in scope read".
Not yet read (outside this task's scope): ... or "none".
```

4.5 **Memory tail** - when DECISIONS.md is long, keep active decisions verbatim in the summary and compress closed phases to one line each (title + date + consequence). Do not drop the tail of the file without reading it; the parallel-sessions protocol requires a fresh tail read before asking or writing. This consolidation is borrowed from Mem0/Pensyve-style memory, but stays as plain text summarization with no vector DB dependency.

5. **Ready**: ask for the task if the user has not named one yet. From now on work by the full contract without re-reading in this session.

## Constraints

- Onboarding changes nothing: no code, no `.docs/`, no settings.
- Never retell documents in full: only the summary above. Long retellings are slop too.
- When documents contradict each other - surface the contradiction as a finding and ask; never choose silently.
- When a mandatory file is missing or empty - say so plainly and suggest restoring from the `hp-docs` templates.
