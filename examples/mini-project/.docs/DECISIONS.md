# todo-cli Decisions

Decision journal. The agent reads the file before the audit and appends decisions after user answers.

## Entry format

```markdown
### YYYY-MM-DD: Short heading

- Decision: ...
- Context: ...
- Consequence: ...
- Source: session/task reference
```

## Entries

### 2026-08-22: JSON storage without a database

- Decision: a single JSON file `~/.todo-cli/data.json`, no SQLite, no migrations.
- Context: micro-utility holding dozens of records; a database would add a dependency and install steps for zero benefit.
- Consequence: on file corruption show a clear error with the path; parallel access is consciously unsupported.
- Source: project initialization.

### 2026-08-22: CHECKLIST.md omitted

- Decision: of the five template files, `.docs/` does not create CHECKLIST.md.
- Context: for a micro-CLI the checklist duplicates AGENT_PROMPT and raises contract reading cost.
- Consequence: revisit via disposition when the project grows past ~10 commands.
- Source: project initialization.
