# Resource lifecycle and retention

Source: user proposal for a standalone `AGENT_RESOURCE_LIFECYCLE.md` document, reviewed against the existing contracts on 2026-10-20.

## Problem

Idea: make the agent prove resource lifecycle on every change instead of being told to "check for memory leaks".

Comment: the obligation was spread over four files with no checklist. `DEVELOPMENT.md` had one line about listeners, timers, and subscriptions. `AGENT_PROMPT.md` section 7 listed caches and cancellation without retention. `TESTING.md` treated memory only as a benchmark metric. `CHECKLIST.md` had nothing. The deep-analysis list in the `hp-docs` skill said "memory leaks, unoptimized renders, missing memoization", which mixes leaks with memoization.

Pros: a named trigger and a checklist that can actually be walked.

Cons: more rules in files the agent already reads, so every session pays a few hundred tokens.

## Rules in always-read files

Idea: keep the obligation short where it is always loaded, move the detail to where audits happen.

Comment: `AGENT_PROMPT.md` section 7 gained "Resource lifecycle and retention" (owner, growth policy, cancellation, presence-is-not-a-defect, proportionate trigger, evidence). `CHECKLIST.md` gained three items. `TESTING.md` section 10 gained the repeated-cycle case. Root `AGENTS.md` gained the key rule.

Pros: no new template file, no second source of truth, onboarding cost grows by about 300 tokens.

Cons: the detailed checklist sits in the `review-audit` skill, so a project that installs `.docs/` without the skills loses the detail. Mitigation: the short rules stay in `AGENT_PROMPT.md`.

## Audit checklist in the skill

Idea: ten categories, walked only when the scope acquires resources or holds state across time: listeners, timers, observers and streams, async cancellation, caches and collections, buffers, native resources, React, Rust and desktop, shutdown and errors.

Comment: lives in `review-audit` as an axis row plus a checklist section. `deep-performance` gained a `retention` mode. `REVIEWER.md` step 6 gained the lifecycle check.

Pros: the checklist is loaded during an audit, not at session start.

Cons: two skills now describe lifecycle and must stay aligned. They share one copy, so drift is a single edit.

## Measurement in PERFORMANCE.md

Idea: separate retention from peak RSS and say explicitly what is not evidence.

Comment: `PERFORMANCE.md` section 9 "Retention and long-run": at least 20 repeated cycles against a warm baseline, per-stack tooling, allocator arenas and GC lag excluded, and a retention path required for every leak claim. Section count 8 to 9; the first-run health check was updated.

Pros: a leak claim becomes verifiable instead of impressionistic.

Cons: `PERFORMANCE.md` is optional, so projects without it rely on `TESTING.md` and the skill.

## Rejected

Separate mandatory `.docs/quality/resource-audit.md` in a new `quality/` directory: one file in a new directory breaks the flat layout, adds about 2k tokens to every session, and duplicates rules already spread over four files. A second source of truth would drift from the skill.

`.docs/performance/` directory: `PERFORMANCE.md` and `.docs/reviews/` already hold the contract and the artifacts.

A lifecycle report block on every change: noise for changes that acquire nothing. The trigger is a resource-acquiring change; everything else gets one line.

"Avoid unnecessary allocations" without a hot path: the rules already forbid optimization without measurement.

Naming the topic "memory leaks": unbounded growth and lifecycle bugs are not leaks and a leak-only checklist misses them.
