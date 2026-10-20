# {{PROJECT_NAME}} reviews

Issue files for independent review runs and for any finding set too long for the chat. One file per run: `{scope}-{date}.md`. Created only when findings exist; an empty review creates nothing.

## Format

- Statuses: open, awaiting user decision, ready for implementation, resolved after re-review.
- Every finding carries a stable ID (`R-{date}-{number}`), severity, category, evidence with file paths, and remediation options.
- The reviewer never fixes code and never edits `.docs/` outside `reviews/`.
- A fix task may update issue status only after user approval; a re-review verifies the fix and appends the result.
- Findings longer than about 40 lines from a session audit (`review-audit`, `security-audit`, `code-cleanup`, `.docs/agents-audit.prompt.md`) land here too, with the verdict, the top findings, and this path reported in the chat. Only an independent reviewer run carries the no-fix rule; a session audit file is a working artifact of that session.

Structure template lives in `.docs/REVIEWER.md`, section "Issue file rules".
