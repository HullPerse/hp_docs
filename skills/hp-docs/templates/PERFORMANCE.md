# {{PROJECT_NAME}} Performance Contract

Optional file. Create it when the project has performance-sensitive paths (hot loops, search/sort/parse, large lists, IPC chatter, native bridges) or when the user asks for explicit perf rules. Otherwise the benchmark-first rule in `DEVELOPMENT.md` plus the performance axis in `TESTING.md` apply on their own.

Borrowed from the iluhaAnime benchmark practice (labs + cargo benches, Ryzen 7 5800X evidence). Tool names below are examples; keep the gates, swap the runner.

## 1. Commands and profiles

Define the bench commands in `package.json` (or the native equivalent) and use them consistently:

- `bench:all` - quick profile only, safe for routine runs, finishes in minutes. Default command.
- `bench:full` - every bench file including slow ones. Run explicitly.
- `bench:slow` - slow files only (large corpora, cold builds).
- `bench:compare` - compare the last two saved runs.
- `bench:native` - native benches (`cargo bench`, `go test -bench`, etc.) when a native layer exists.

Tag files with profiles: `@quick` for routine files, `@slow` for heavy files excluded from the default command. Live-network probes are never in the default command: gate them behind an env flag (example `ILUHA_BENCH_LIVE=1`) so a default run stays offline and deterministic.

## 2. Benchmark gates

Every bench file states its budget in the header comment (avg or median per iteration, machine, runtime, date). No budget means the file must not be added.

- Regression threshold: 5% (`minDelta` equivalent). Below it, numbers are noise.
- Every bench returns a checksum so the runner can detect dead code elimination.
- Workloads use deterministic fixtures and seeded generators (example `mulberry32`). No wall-clock randomness.
- Chatter benches pin invoke counts plus request/response bytes per scenario alongside timing.
- Scale benches report heap per iteration at three or more input sizes so bytes per item can be quoted only when flat across sizes.

## 3. What to bench

Bench only performance-sensitive paths with a stated budget or a measured suspicion. Domains ruled not applicable are listed explicitly with a reason, for example: locale/settings/theme (static lookups and config), timing helpers (timing behavior, not throughput).

Separate three bench kinds: timing (latency/throughput), chattiness (calls plus bytes, for IPC/API fan-out), scale (heap per item, for memory growth). One file may hold one kind; mixing kinds in one file hides which gate failed.

## 4. Evidence standard

Every result records: machine, runtime and profile, cold vs warm, corpus sizes. Per-item math is derived by division, never by comparing raw totals across different call counts. Heap figures separate retained state (caches) from transient allocations per pass.

- A single wall-time run is not a signal: take a median of at least three runs.
- Numbers within 10% are marked equivalent and the choice is made on other criteria (API, size, maintenance).
- Never quote a number without its artifact (saved run, bench output, machine note).
- Per-call comparisons only: a helper that runs 8000 times looks slower in totals than one that runs once even when it is faster per call.

## 5. Bench-first rejections

Before adopting a dependency, engine, worker, or pooling scheme for performance reasons, run a throwaway spike outside the repo, record numbers plus quality plus integration cost (IPC hops, second scoring blend, offline contract, downloads, daemons), then delete the spike and verify the tree is clean. Rejections are logged with their numbers so nobody re-runs the same spike: examples from practice are fuzzy engines rejected on typo quality, semantic-search daemons rejected on model download plus daemon cost, TS interning rejected as noise-equivalent, worker offload rejected when clone cost exceeds compute at real sizes (revisit at 50k+ items or with transferables), connection pooling rejected when no hot-loop DB path exists.

## 6. Fix hierarchy

Correctness first, then algorithmic (cache the constant query text once, index the matcher with a map instead of a linear scan, drop tokens the index can never match, batch N IPC calls into one transaction), then render (stable keys, content-visibility, thumb-first images, stale windows that kill refetch storms, memoized ranges), then micro-optimizations only with a bench delta that justifies them. Hot-branch switches over lookup maps need the same delta. Keep a deliberately-not-taken list with return conditions so deferred items do not come back as new proposals.

## 7. Scale table

Maintain a system-requirements evidence table with per-item cold/warm figures, bytes per item, cache-cap effects, and the extrapolation formula. Example rows: filename parsing cold per file vs warm resident per file with LRU cap noted, tree build per file plus bytes, suggest latency per keystroke at catalog size, IPC invokes per poll cycle. Derived figures state the multiplication openly (20k files times per-file cost) and note where the cache cap breaks linearity.

## 8. Journal

Every perf decision logs date, context, before/after numbers, verification (tests, typecheck, lint, build), and the return condition. Rejected spikes log the cleanup proof. No claim of the form "X percent faster" ships without the artifact it was measured from.

## 9. Retention and long-run

Memory numbers answer a different question than the benches above: what stays alive, not what one pass costs. Measure retained state, not peak RSS.

- Repeat the cycle that should release the resource (mount/unmount, open/close, connect/disconnect, start/stop) at least 20 times, then compare retained objects and live resources against the warm baseline.
- TypeScript/Bun: heap snapshot diff for retained objects, `heapUsed` after a forced GC, live listener and handle counts. React: DevTools snapshot plus detached DOM node count after repeated mount/unmount; StrictMode double-invocation exposes non-idempotent cleanup.
- Rust and native: heaptrack, dhat, or valgrind for allocation growth; allocation counts and `Arc::strong_count` in a test for reference cycles; explicit release of decoders, players, and FFI memory on close.
- Not evidence: RSS alone (allocator arenas), a single run, a slow drop after GC, JIT warmup, or a passing test suite. Expected allocator caching is stated as expected, not counted as growth.
- Every leak claim names the suspected retention path: who holds the reference and what should release it. An unconfirmed suspicion is a risk with a next verification step, never a proven defect.
