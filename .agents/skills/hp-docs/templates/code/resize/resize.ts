/**
 * Minimal resize math plus resize-event coalescing.
 *
 * Take when: drag-resize handles, crop rectangles, or ResizeObserver-driven
 * layout sync appear in more than one place. Skip when: a single CSS-only
 * solution (flex, grid, container queries) covers the layout.
 *
 * Distilled from two sources: the iluhaAnime crop math (edge and corner
 * resize with min size, aspect lock, and bounds clamp) and the DPG desktop
 * window resize (8-handle drag with viewport clamp). Snap guides and the
 * React drag hook stay in the source projects; this template keeps the pure
 * math plus a framework-agnostic observer so it has no UI dependency.
 * Resize listeners always coalesce through one rAF or timeout task, never a
 * raw setState per event.
 */

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropBounds {
  width: number;
  height: number;
}

export type CropHandle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | "move";

export interface ResizeOptions {
  minSize?: number;
  ratio?: number | null;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function clampRect(rect: CropRect, bounds: CropBounds, minSize = 1): CropRect {
  const width = clamp(rect.width, minSize, bounds.width);
  const height = clamp(rect.height, minSize, bounds.height);
  return {
    x: clamp(rect.x, 0, Math.max(0, bounds.width - width)),
    y: clamp(rect.y, 0, Math.max(0, bounds.height - height)),
    width,
    height,
  };
}

export function moveRect(rect: CropRect, dx: number, dy: number, bounds: CropBounds): CropRect {
  return clampRect({ ...rect, x: rect.x + dx, y: rect.y + dy }, bounds);
}

export function resizeRect(
  rect: CropRect,
  handle: CropHandle,
  dx: number,
  dy: number,
  bounds: CropBounds,
  options: ResizeOptions = {},
): CropRect {
  if (handle === "move") return moveRect(rect, dx, dy, bounds);
  const minSize = Math.max(1, options.minSize ?? 1);
  const west = handle.includes("w");
  const east = handle.includes("e");
  const north = handle.includes("n");
  const south = handle.includes("s");
  let left = rect.x;
  let top = rect.y;
  let right = rect.x + rect.width;
  let bottom = rect.y + rect.height;
  if (west) left = clamp(left + dx, 0, right - Math.min(minSize, bounds.width));
  if (east) right = clamp(right + dx, left + Math.min(minSize, bounds.width), bounds.width);
  if (north) top = clamp(top + dy, 0, bottom - Math.min(minSize, bounds.height));
  if (south) bottom = clamp(bottom + dy, top + Math.min(minSize, bounds.height), bounds.height);
  let next = clampRect({ x: left, y: top, width: right - left, height: bottom - top }, bounds, minSize);
  const ratio = options.ratio ?? null;
  const corner = (west || east) && (north || south);
  if (ratio !== null && ratio > 0 && corner) {
    const height = Math.max(1, Math.round(next.width / ratio));
    next = clampRect({ ...next, height }, bounds, minSize);
  }
  return next;
}

export function coalesceWithRaf(run: () => void): () => void {
  let frame = 0;
  let queued = false;
  return () => {
    if (queued) return;
    queued = true;
    const fire = (): void => {
      queued = false;
      run();
    };
    if (typeof requestAnimationFrame === "function") {
      frame = requestAnimationFrame(fire);
    } else {
      frame = setTimeout(fire, 0) as unknown as number;
    }
    void frame;
  };
}

export function observeSize(element: HTMLElement, onResize: (rect: DOMRectReadOnly) => void): () => void {
  let queued = false;
  let latest: DOMRectReadOnly | null = null;
  const fire = (): void => {
    queued = false;
    if (latest !== null) onResize(latest);
  };
  const schedule = (): void => {
    if (queued) return;
    queued = true;
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(fire);
    else setTimeout(fire, 0);
  };
  const observer = new ResizeObserver((entries) => {
    const entry = entries[entries.length - 1];
    if (!entry) return;
    latest = entry.contentRect;
    schedule();
  });
  observer.observe(element);
  return () => observer.disconnect();
}
