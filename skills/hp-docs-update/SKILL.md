---
name: hp-docs-update
version: 1.0.0
description: >
  Update-only migration of an initialized project's template-generated `.docs/`
  files to a newer hp_docs template version. Reads `.docs/hp-docs.meta.json`,
  compares current files with the new template, and produces a dry-run
  ADD/KEEP/CONFLICT plan that is applied only after approval. Never edits
  DECISIONS.md entries, features/, reviews/, README, or source code. Use when
  the user says "update docs to the new hp_docs version", "migrate .docs to the
  new template", "обнови документацию hp_docs", or after `npx skills update hp-docs`
  left the generated files on the old template.
---

# HP-Docs Update

Brings the generated documentation of an initialized project in line with a newer hp_docs template version, without destroying what the project changed since initialization.

Scope boundary, always:

- May touch: `.docs/AGENT_PROMPT.md`, `.docs/DEVELOPMENT.md`, `.docs/TESTING.md`, `.docs/SECURITY.md`, `.docs/DESIGN.md`, `.docs/CHECKLIST.md`, `.docs/REVIEWER.md`, `.docs/ROADMAP.md` (template-generated files only).
- May append to `.docs/DECISIONS.md`: one short entry recording the update itself.
- Never touches: existing DECISIONS.md entries, `.docs/features/`, `.docs/reviews/`, `.docs/answers/`, README, AGENTS.md, product-spec.md, or any source code.

## Step 1: Confirm the new template is available

The comparison needs the new template files. Sources, in order:

1. The freshly installed hp-docs skill in this project (`.agents/skills/hp-docs/templates/`). If the user already ran `npx skills update hp-docs` (or the equivalent), this is current.
2. The repository clone or a fetched copy of `HullPerse/hp_docs` at the target version.

If neither is present, tell the user to run the skills update first (`npx skills update hp-docs`) and stop. Never download from the network without asking.

Read `.agents/skills/hp-docs/SKILL.md` and the bundled templates to learn the target template version and the current section outline for each file.

## Step 2: Read the project metadata

Read `.docs/hp-docs.meta.json`. It records: package name and version, template revision, documentation language, design preset, and the list of generated template files.

If the file is missing (projects initialized before hp-docs.meta.json existed):

- Report that there is no metadata.
- Ask the user how to proceed: (a) adopt the current `.docs/` files as the baseline, write the metadata file, and run the update from there; or (b) abort and run the manual Docs Migration procedure from the hp-docs skill instead.
- Do not guess. Without a baseline the dry-run classification has nothing to compare against.

## Step 3: Classify every generated file

For each file listed in the metadata (plus the default template set), compare the current project file with the new template file:

- ADD: the file exists in the new template but not in the project. Proposal: create it from the template.
- KEEP: the current file matches the new template byte-for-byte, or the only differences are project-filled values (stack, commands, preset, language). Proposal: no change.
- CONFLICT: the current file differs from the new template in structure or rules. This covers template drift and deliberate project edits alike - the metadata records the template version but not a per-file diff, so old-template state cannot be reconstructed exactly. Proposal: a merged file that applies the new template structure while preserving the project's custom content (fixed decisions, chosen stack, recorded conventions, translated text).

For CONFLICT files the agent must read both versions and draft the merge. Preserve, at minimum: language choice and translations, chosen design preset content, real commands and stack facts, fixed decisions, and any user-added rules. Never carry over content that the new template deliberately removed or replaced.

## Step 4: Dry-run plan and approval

Present a plan in this form:

```text
hp-docs template update: <old version> -> <new version>

AGENT_PROMPT.md    CONFLICT  merge: + section N (new rule), keep project stack text
DEVELOPMENT.md     CONFLICT  merge: + duplication principle, keep fixed decisions
SECURITY.md        KEEP      current already matches the new template
TESTING.md         ADD       missing, create from template
```

Wait for explicit approval before writing anything. Offer file-by-file selection if the user wants to apply only part of the plan. Nothing is written without approval.

## Step 5: Apply

Execute the approved items:

- ADD: copy the template file, then fill project-specific values exactly as first-run does.
- KEEP: no write.
- CONFLICT: write the drafted merged file.
- Update `.docs/hp-docs.meta.json`: new package version and template revision; language, preset, and file list stay as they are unless a file was added or removed.

Then append one short entry to `.docs/DECISIONS.md` (never edit existing entries):

```markdown
### YYYY-MM-DD: hp-docs template updated <old> -> <new>
- Decision: generated .docs template files migrated from hp-docs <old> to <new> via the hp-docs-update skill.
- Context: ...
- Consequence: project edits in merged files were preserved; see the update plan in the session.
- Source: hp-docs-update session.
```

## Step 6: Verify and report

- Re-run the docs health check from the hp-docs skill (section counts per file).
- Spot-read every written file: no placeholders left, section counts hold, ASCII punctuation only, translations intact where a non-English language was chosen.
- Report: files ADDed, KEEPed, and merged (with a one-line summary of what each merge preserved), the new meta version, and the DECISIONS.md entry appended.

## Rules

- Read before asking: `.docs/DECISIONS.md` tail, the target file list, and the new template before any question. Do not ask what the files already answer.
- If a CONFLICT merge would drop content the project added (a decision, a rule, translated text), ask instead of silently deleting it.
- DECISIONS.md entries, features/, reviews/, answers/, README, AGENTS.md, and code are read-only here. Only the update entry itself may be appended.
- Do not re-run first-run initialization questions. This skill migrates; it does not reinitialize.
- No automatic application. A dry-run plan without approval is an incomplete run; report it as such.
