# hp-docs-update skill

## Status

- Implementation: implemented.
- Documentation: this feature file and DECISIONS.md.
- Source: hp_docs audit session 2026-09-05.

## Idea

Add a separate skill `hp-docs-update` that migrates the generated template files of an initialized project to a newer hp_docs template version. It only updates `.docs/` files that came from the template (AGENT_PROMPT, DEVELOPMENT, TESTING, SECURITY, DESIGN, CHECKLIST, REVIEWER, ROADMAP). It never edits DECISIONS.md entries, features/, reviews/, README, or source code; it only appends a short entry about the update itself to DECISIONS.md.

## Comment

The current update path lives as a vague "Docs Migration" section inside hp-docs/SKILL.md and cannot tell a template change from a user edit. To make that possible, initialization writes a small metadata file, `.docs/hp-docs.meta.json`, with the package version, template revision, language, design preset, and the list of generated files. The update then compares three sides (old template, current file, new template) and produces a dry-run plan: ADD, KEEP, CONFLICT per file. Nothing is written until the user approves the plan. This design matches the earlier decision that DECISIONS.md must never be a sync source.

## Pros

- Safe updates without silently overwriting project decisions.
- Dry-run plus approval keeps control with the user.
- Metadata makes template provenance and the three-way comparison possible.
- Clear scope boundary protects the decision journal and user content.

## Cons

- New skill plus a metadata write during first-run and install verification.
- Existing initialized projects have no metadata file; the skill must detect that and ask before updating.
- New template sections must be applied without re-running the whole first-run flow.

## Approved decisions

- New skill named `hp-docs-update`.
- Project metadata file `.docs/hp-docs.meta.json` written at initialization.
- Dry-run ADD/KEEP/CONFLICT plan, changes applied only after approval.
- Scope: template `.docs` files only; DECISIONS.md, features/, reviews/, README, and code untouched.
