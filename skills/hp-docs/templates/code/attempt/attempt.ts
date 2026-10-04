/**
 * Go-style error handling: a fallible call hands back `[value, null]` on success
 * or `[null, Error]` on failure instead of unwinding with `throw`, and the caller
 * decides what a rejection means. Cleanup still has a home: chain `.finally(cb)`
 * on the returned promise - it never rejects, so `cb` always runs.
 */

/** Normalizes a thrown value into an `Error`. */
export function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value));
}

/** Awaits a promise and returns `[value, null]`, or `[null, Error]` when it rejects. */
export async function attempt<T>(
  promise: Promise<T>,
): Promise<[T, null] | [null, Error]> {
  try {
    return [await promise, null];
  } catch (error) {
    return [null, toError(error)];
  }
}

/** Synchronous {@link attempt}: runs a thunk and captures a throw. */
export function attemptSync<T>(fn: () => T): [T, null] | [null, Error] {
  try {
    return [fn(), null];
  } catch (error) {
    return [null, toError(error)];
  }
}

/** The resolved value, or `fallback` when the promise rejects. */
export async function withFallback<T>(
  promise: Promise<T>,
  fallback: T,
): Promise<T> {
  const [value, error] = await attempt(promise);
  if (error !== null) return fallback;
  return value;
}
