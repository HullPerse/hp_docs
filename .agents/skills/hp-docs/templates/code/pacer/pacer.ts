/**
 * Minimal timing engine: the only debounce, throttle, delayed retry,
 * cancellable sleep, and polling interval in the project.
 *
 * Take when: more than one place needs debounce, throttle, or delayed retry.
 * Skip when: a single setTimeout at one call site does the job (ponytail rung 6).
 * Never bench throughput here: this module owns timing behavior, not speed.
 *
 * Distilled from the iluhaAnime pacer (Debouncer/Throttler classes with
 * leading/trailing/maxWait/status cells). The class variants with maxWait and
 * observable status stay in the source project; this template keeps the
 * function core so it has no store dependency.
 */

export type PacerMode = "timeout" | "raf";

export const MAX_TIMEOUT_MS = 2_147_483_647;

export function normalizeWait(wait: number | (() => number)): number {
  const raw = typeof wait === "function" ? wait() : wait;
  if (Number.isNaN(raw) || raw <= 0) return 0;
  if (!Number.isFinite(raw)) return MAX_TIMEOUT_MS;
  return Math.floor(raw);
}

export interface ScheduledTask {
  cancel: () => void;
}

export function scheduleTask(mode: PacerMode, waitMs: number, run: () => void): ScheduledTask {
  if (mode !== "raf" || typeof requestAnimationFrame !== "function") {
    const id = setTimeout(run, Math.min(Math.max(0, waitMs), MAX_TIMEOUT_MS));
    return { cancel: () => clearTimeout(id) };
  }
  const start = Date.now();
  let frame = 0;
  let cancelled = false;
  const tick = (): void => {
    if (cancelled) return;
    if (Date.now() - start >= waitMs) {
      run();
      return;
    }
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return {
    cancel: () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    },
  };
}

export interface SleepTask {
  readonly done: Promise<void>;
  cancel: () => void;
}

export function sleep(waitMs: number): SleepTask {
  let settle: () => void = () => {};
  const done = new Promise<void>((resolve) => {
    settle = resolve;
  });
  const task = scheduleTask("timeout", waitMs, settle);
  return {
    done,
    cancel: () => {
      task.cancel();
      settle();
    },
  };
}

export interface RateOptions {
  wait: number | (() => number);
  leading?: boolean;
  trailing?: boolean;
  enabled?: boolean | (() => boolean);
  mode?: PacerMode;
}

function resolveEnabled(enabled: RateOptions["enabled"]): boolean {
  if (enabled === undefined) return true;
  return typeof enabled === "function" ? enabled() : enabled;
}

export function debounce<TArgs extends unknown[]>(
  task: (...args: TArgs) => void,
  options: RateOptions,
): (...args: TArgs) => void {
  const leading = options.leading ?? false;
  const trailing = options.trailing ?? true;
  let timer: ScheduledTask | null = null;
  let pending: TArgs | undefined;
  const fire = (args: TArgs): void => {
    pending = undefined;
    task(...args);
  };
  return (...args: TArgs): void => {
    if (!resolveEnabled(options.enabled)) return;
    if (leading && timer === null && pending === undefined) {
      task(...args);
      timer = scheduleTask(options.mode ?? "timeout", normalizeWait(options.wait), () => {
        timer = null;
      });
      return;
    }
    if (!trailing) return;
    pending = args;
    timer?.cancel();
    const captured = pending;
    timer = scheduleTask(options.mode ?? "timeout", normalizeWait(options.wait), () => {
      timer = null;
      fire(captured);
    });
  };
}

export function throttle<TArgs extends unknown[]>(
  task: (...args: TArgs) => void,
  options: RateOptions,
): (...args: TArgs) => void {
  const leading = options.leading ?? true;
  const trailing = options.trailing ?? true;
  let timer: ScheduledTask | null = null;
  let pending: TArgs | undefined;
  let lastExec: number | null = null;
  return (...args: TArgs): void => {
    if (!resolveEnabled(options.enabled)) return;
    const now = Date.now();
    const wait = normalizeWait(options.wait);
    if (lastExec === null || now - lastExec >= wait) {
      if (leading) {
        lastExec = now;
        task(...args);
        return;
      }
      lastExec = now;
    }
    if (!trailing) return;
    pending = args;
    if (timer !== null) return;
    const delay = lastExec === null ? wait : Math.max(0, lastExec + wait - now);
    timer = scheduleTask(options.mode ?? "timeout", delay, () => {
      timer = null;
      if (pending !== undefined) {
        const captured = pending;
        pending = undefined;
        lastExec = Date.now();
        task(...captured);
      }
    });
  };
}
