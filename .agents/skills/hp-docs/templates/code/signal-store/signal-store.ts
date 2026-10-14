/**
 * Minimal signal store: one cell-based primitive for client and UI state.
 *
 * Take when: client state is scattered across useState/useRef pairs that leak
 * into each other, or a tiny store would replace zustand/jotai for a few
 * atoms. Skip when: server or native query state (that belongs to TanStack
 * Query or the native bridge), or a single useState is enough.
 *
 * Rules carried over: one store per topic, one file per store, persisted
 * state is a hand-written mirror with a schema version (no partialize
 * magic), domain logic never imports stores. Persistence itself is not in
 * this file: write the mirror at the call site and document excluded fields.
 *
 * Distilled from the iluhaAnime signal store (cells, derived nodes with
 * version checks, batching, named atoms, snapshot). Named atoms and snapshots
 * stay in the source project; this template keeps cells, derived values, and
 * batching so it has no framework dependency.
 */

export type Unsubscriber = () => void;

export interface Cell<T> {
  get: () => T;
  set: (value: T) => void;
  update: (fn: (prev: T) => T) => void;
  subscribe: (fn: () => void) => Unsubscriber;
}

export interface Readable<T> {
  get: () => T;
  subscribe: (fn: () => void) => Unsubscriber;
}

let batchDepth = 0;
const queued = new Set<() => void>();

function emit(notify: () => void): void {
  if (batchDepth > 0) {
    queued.add(notify);
    return;
  }
  notify();
}

export function batch(fn: () => void): void {
  batchDepth += 1;
  try {
    fn();
  } finally {
    batchDepth -= 1;
    if (batchDepth === 0) {
      const pending = [...queued];
      queued.clear();
      for (const notify of pending) notify();
    }
  }
}

export function createCell<T>(initial: T): Cell<T> {
  let value = initial;
  const subs = new Set<() => void>();
  const notify = (): void => {
    for (const fn of [...subs]) fn();
  };
  return {
    get: () => value,
    set: (next: T) => {
      if (Object.is(value, next)) return;
      value = next;
      emit(notify);
    },
    update: (fn: (prev: T) => T) => {
      const next = fn(value);
      if (Object.is(value, next)) return;
      value = next;
      emit(notify);
    },
    subscribe: (fn: () => void) => {
      subs.add(fn);
      return () => {
        subs.delete(fn);
      };
    },
  };
}

export function createDerived<T>(deps: Readable<unknown>[], compute: (args: unknown[]) => T): Readable<T> {
  let cached: T | undefined;
  let hasValue = false;
  const subs = new Set<() => void>();
  const recompute = (): void => {
    const next = compute(deps.map((dep) => dep.get()));
    if (hasValue && Object.is(cached, next)) return;
    cached = next;
    hasValue = true;
    for (const fn of [...subs]) fn();
  };
  const unsubs = deps.map((dep) => dep.subscribe(() => emit(recompute)));
  void unsubs;
  return {
    get: () => {
      if (!hasValue) {
        cached = compute(deps.map((dep) => dep.get()));
        hasValue = true;
      }
      return cached as T;
    },
    subscribe: (fn: () => void) => {
      subs.add(fn);
      return () => {
        subs.delete(fn);
      };
    },
  };
}
