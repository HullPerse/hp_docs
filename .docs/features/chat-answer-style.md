# Terse chat answer style (caveman adapted)

## Status

- Implementation: implemented.
- Documentation: this feature file and DECISIONS.md.
- Source: hp_docs audit session 2026-09-05, follow-up request.

## Idea

Add a terse chat answer style to the agent rules, adapted from caveman-style prompts: answer first, drop polite openers and closers, cut filler words and re-statements, keep every reply as short as the content allows. The style layers on top of the required response structure and never replaces it.

## Comment

A literal caveman mode (telegraphic speech for everything) would break the session contract: task reports must keep the Audit / Decisions needed / Scope+Plan / Progress / Verification / Final state structure, and comprehension is never shortened where precision matters. The usable variant is narrower. Most chat turns do not need a structured report at all - plain answers do. The rules therefore target ordinary conversation: no "I can help with that" openers, no "let me know if you need anything" closers, no restating the question, no summary when the answer is the summary, no filler function words when the direct statement is clear. Anti-slop already bans template intros and repeated conclusions; this adds answer-first ordering and brevity on top.

## Idea (text)

- Answer first, then add context only if it changes the meaning.
- In plain chat turns: no greeting ritual, no recap of the question, no polite closer, no "sure / absolutely" padding.
- In task reports: keep the required structure and section headers, compress every section to what is new and actionable, drop anything the reader already knows.
- Never shorten: warnings, security findings, hard rules, test evidence, or an explanation the user explicitly asked for in depth.

## Pros

- Less noise per turn; the user reads the substance faster.
- Complements the existing anti-slop rules without a new mechanism.
- Keeps the structured report for tasks, so nothing important gets lost.

## Cons

- Style rules are subjective; the line between terse and rude depends on the user.
- Task reports still take their required shape - brevity has a ceiling there.

## Approved decisions

- The style is "terse on top of the required structure", not full caveman speech.
- The rule lives in AGENT_PROMPT.md section 11 (Response format) only.
- No changes to AGENTS.md key rules beyond the already-short format, and no separate skill.
