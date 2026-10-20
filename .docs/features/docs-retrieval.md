# Docs retrieval

Source: [mksglu/context-mode](https://github.com/mksglu/context-mode), evaluated 2026-10-20. That project is an MCP server: sandboxed tool output, an FTS5 knowledge base, hooks, session replay. None of that runtime applies here. Three of its ideas do, as plain rules.

## Problem

Idea: make the mandatory reading list cheaper without weakening the rules.

Comment: the list costs about 32k tokens at session start (AGENT_PROMPT 33.8k characters, DEVELOPMENT 24.2k, DECISIONS 60.8k, CHECKLIST 10.1k, at a rough 4 characters per token) and DECISIONS grows without limit. `docs-onboard` demanded a full read of every document and forbade deferring, which is the failure context-mode addresses, solved there with a search engine.

Pros: no dependency, applies to every project that uses the template.

Cons: depends on agent discipline; a section skipped by mistake cannot be detected mechanically.

Alternative: ship an FTS5 index and a search tool. Rejected. Ten markdown files do not justify a SQLite build step, and the agent harness already has search and offset reads.

## Read by section

Idea: build the heading index first, read the sections the task touches, read whole files only when the file is the deliverable. DECISIONS.md becomes a tail read plus a topic search.

Comment: implemented in AGENT_PROMPT section 2 and `docs-onboard` step 2. The parallel-sessions protocol still requires a fresh tail before asking or writing.

Pros: onboarding loads only what constrains the task; the journal stops being a fixed tax on every session.

Cons: relevance is judged before reading, and a wrong judgement hides a rule. Mitigation: the rule requires naming the files a widened read touched, so the omission is visible.

## Scripted analysis

Idea: repo-wide questions get one command that prints counts and paths. The report shows the query and the result, not the corpus.

Comment: implemented in AGENT_PROMPT section 3, with one line each in `review-audit`, `docs-refactor`, `security-audit`, and `code-cleanup`.

Pros: the audit skills correctly push broad search for completeness, which is expensive without this rule; the rule keeps completeness and cuts the cost.

Cons: a badly written query under-reports silently. The query stays visible in the report so it can be challenged, and evidence still needs a command.

## Findings as files

Idea: finding sets over about 40 lines go to `.docs/reviews/<scope>-<date>.md`. The chat carries the verdict, the top findings, and the path.

Comment: implemented in AGENT_PROMPT section 9, CHECKLIST, and `reviews/README.md`.

Pros: durable artifact for parallel sessions; no multi-screen chat dumps.

Cons: one more file per run. Mitigation: one file per run, existing issue format, and empty runs create nothing.

## Deferred

`docs-doctor` - a script that validates a consumer project: remaining `{{...}}` placeholders, required sections per the hp-docs contract, `hp-docs.meta.json` version, cross-file links.

Defer reason: a new script needs tests and a CI job, and the contract lives in prose that changes per template version.

Return condition: the first update run that misses drift the doctor would have caught.

DECISIONS.md format change - archive closed phases into separate files once the journal passes about 400 lines.

Defer reason: changes the template format and needs an `hp-docs-update` migration for every consumer project.

Return condition: the journal passes 400 lines, or onboarding cost is still reported as a problem after the retrieval rules land.

## Rejected

FTS5 and BM25 ranking, reciprocal rank fusion, trigram and fuzzy matching: a search engine for ten files.

Hooks, MCP server, SQLite event capture, twelve language sandboxes, TTL cache, progressive throttling: a runtime product for 17 platforms, not a documentation template.

Removing prose-style enforcement: not applicable here. The terse style stays scoped to chat turns and never shortens warnings, evidence, or decisions.
