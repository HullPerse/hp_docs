---
name: deep-performance
version: 1.0.0
description: >
  Deep performance engineering for a whole repository: profile hot paths with
  evidence instead of guessing, audit architecture and algorithms, build
  reproducible benchmarks (throughput, latency p50/p95/p99, memory under
  load), and verify every optimization with repeat measurements plus
  correctness and regression checks. Use when the user asks for a
  "performance audit", "find the bottleneck", "why is this slow", or wants
  benchmark-proven speedups. Methods are paraphrased borrows with no
  dependency; the skill picks profilers that fit the project's language and
  runtime.
---

# Deep Performance

A senior performance engineer plus systems architect plus benchmark engineer in one pass. It never advises from code reading alone: every bottleneck carries a profile, every speedup carries a repeat measurement.

## Preconditions

- `.docs/` exists and is filled. Read `AGENT_PROMPT.md`, `DEVELOPMENT.md` (benchmark-first rule), `TESTING.md` (performance axis), `DECISIONS.md` (accepted constraints), and `.docs/PERFORMANCE.md` when the project has one.
- List available MCP tools and keep the list. Use documentation tools for profiler and harness docs before running them.
- Record scope, target paths, revision, machine, runtime, and date at the top of the report.

## Modes

Run only the modes the scope needs. Skip a mode with a one-line reason.

1. **profiler** - CPU hot paths, allocations, GC pressure, event loop blocks, sync I/O on critical paths, needless data copies, call overhead. Confirm with a profile (sampling, flame graph, allocation timeline, event-loop lag probe), never with reading alone.
2. **arch-audit** - wasteful algorithms, abstraction layers that copy or convert on every call, repeated computation, suboptimal structures, module coupling that forces extra passes over data, serialization and transform chains, inefficient APIs.
3. **bench-engineer** - reproducible benchmarks with deterministic fixtures and seeded data: throughput, latency p50/p95/p99, memory at several input sizes, behavior under sustained load. Baseline first, then optimized variant, same machine and corpus.
4. **algo-opt** - complexity check (`O(n)`, `O(n log n)`, `O(n^2)`), caching, indexing, incremental updates, batching, fewer allocations. Each proposal names the current complexity and the target one.
5. **verify** - repeat measurements (median of at least three), correctness tests, regression suite, trade-off note. A claim without a repeat run is a hypothesis, not a result.
6. **retention** - what stays alive over time: repeated cycles and soak runs, heap snapshots, retained-object diffs, live handle and listener counts, cache growth. Separate expected allocator caching and GC lag from real growth; every leak finding names the retention path and the measurement behind it.

## Finding classes

Every finding is labeled so the user sees what is proven:

- **confirmed** - profile plus repeat measurement agree on the bottleneck and the gain;
- **probable** - one measurement or strong structural evidence, needs a second run;
- **theoretical** - reasoning only, no measurement yet, never presented as a win.

## Stack adapters

Pick the profiler that fits the runtime instead of forcing one tool:

- TypeScript/Bun/Node plus React: sampling profiler, React render counts, store subscription audit, TanStack Query fan-out and stale-window check, bundle and import-cost check; heap snapshot diff, live listener and handle counts, detached DOM nodes for retention.
- Rust/native: `cargo bench`, criterion-style harnesses, release-profile numbers, clippy-clean benches; heaptrack or dhat for allocation growth, `Arc::strong_count` for reference cycles.
- System level: utilization, saturation, and errors per resource (USE method borrowed as a checklist), flame graphs for the saturated one only.

## Report format

Bottleneck table first (finding, class, evidence, affected path), then the bench plan (workload, metric, baseline), then per-optimization entries (change, before/after with artifact, correctness proof, trade-offs, return condition), then the deliberately-not-taken list. Numbers come only from executed commands and their recorded artifacts.

## Constraints

- Read-only until the user approves a fix package: this skill investigates and measures; implementation runs as a follow-up with its own disposition.
- No invented numbers, no "40 percent faster" without the repeat run attached.
- Throwaway spikes live outside the repo and are deleted after recording; the tree stays clean.
- Methods borrow ideas paraphrased from backend audit practice (proof-required findings, zero-findings allowed), profile-optimize-reprofile discipline with statistical significance, and resource-saturation diagnosis. No upstream dependency is installed and no upstream text is copied.
