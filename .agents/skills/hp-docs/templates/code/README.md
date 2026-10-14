# Bundled code templates

Copy a template into the project only when the first-run Question 8 selects it. Each template is self-contained TypeScript with no dependencies.

| Template | Provides | Take when | Skip when |
| --- | --- | --- | --- |
| `attempt/` | `toError`, `attempt`, `attemptSync`, `withFallback` | fallible calls are normal flow and the caller must decide | guards and invariant violations (they throw to fail fast) |
| `logger/` | minimal zero-dependency Bun console logger | small Bun server needs colored output now | transports, JSON, redaction, or metrics are needed day one (pick pino or winston) |
| `pacer/` | `scheduleTask`, `sleep`, `debounce`, `throttle` | more than one place needs debounce, throttle, or delayed retry | one local setTimeout does the job; never bench this for throughput |
| `signal-store/` | `createCell`, `createDerived`, `batch` | scattered useState pairs leak or a tiny store replaces zustand/jotai | server or native query state (TanStack Query owns it); persistence mirror stays hand-written at the call site |
| `hotkeys-core/` | chord parse plus one shortcut registry | shortcuts grow past raw window listeners | a hotkey library already exists, or only one shortcut exists |
| `resize/` | rect resize/move math plus coalesced ResizeObserver | drag handles, crop rects, or observer layout sync repeat | CSS flex, grid, or container queries cover the layout |
