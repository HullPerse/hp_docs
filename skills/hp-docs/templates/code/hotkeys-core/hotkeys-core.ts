/**
 * Minimal keyboard layer: chord parsing plus one registry that every
 * shortcut routes through.
 *
 * Take when: shortcuts are added as raw window keydown listeners scattered
 * across components. Skip when: the project already uses a hotkey library,
 * or only one or two shortcuts exist (a local listener is cheaper).
 *
 * Rules carried over: every shortcut goes through the registry with config
 * from one place, never a bespoke listener per surface; shortcuts that
 * duplicate a visible button fire that button instead of reimplementing it.
 * The vim engine, hint badges, and collision layout stay in the source
 * project and are not part of this template.
 */

export interface HotkeyChord {
  code: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
}

export type HotkeyRepeat = "once" | "hold";

export interface HotkeyDef<TId extends string = string> {
  id: TId;
  chord: string;
  repeat: HotkeyRepeat;
}

const CODE_PATTERN = /^[A-Za-z][A-Za-z0-9]*$/;

const MODIFIERS: Record<string, "ctrl" | "shift" | "alt" | "meta"> = {
  ctrl: "ctrl",
  control: "ctrl",
  shift: "shift",
  alt: "alt",
  meta: "meta",
};

export function parseChord(input: string): HotkeyChord | undefined {
  const parts = input
    .split("+")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
  const code = parts.pop();
  if (!code || !CODE_PATTERN.test(code) || MODIFIERS[code.toLowerCase()]) return undefined;
  const chord: HotkeyChord = { code, ctrl: false, shift: false, alt: false, meta: false };
  for (const part of parts) {
    const field = MODIFIERS[part.toLowerCase()];
    if (!field) return undefined;
    chord[field] = true;
  }
  return chord;
}

export function chordKey(chord: HotkeyChord): string {
  return `${chord.code}:${chord.ctrl}:${chord.shift}:${chord.alt}:${chord.meta}`;
}

export function chordKeyFromEvent(event: KeyboardEvent): string {
  return `${event.code}:${event.ctrlKey}:${event.shiftKey}:${event.altKey}:${event.metaKey}`;
}

export function humanizeChord(input: string): string {
  const chord = parseChord(input);
  if (!chord) return input;
  const parts: string[] = [];
  if (chord.ctrl) parts.push("Ctrl");
  if (chord.alt) parts.push("Alt");
  if (chord.shift) parts.push("Shift");
  if (chord.meta) parts.push("Meta");
  const code = chord.code.startsWith("Key") && chord.code.length === 4
    ? chord.code.slice(3)
    : chord.code.startsWith("Digit") && chord.code.length === 6
      ? chord.code.slice(5)
      : chord.code;
  parts.push(code);
  return parts.join("+");
}

const HOTKEY_IGNORE_SELECTOR =
  'input, textarea, select, button, [contenteditable="true"], [data-no-hotkeys]';

export function shouldIgnoreHotkeys(target: EventTarget | null): boolean {
  const element = target instanceof HTMLElement ? target : null;
  if (!element) return false;
  return Boolean(element.closest(HOTKEY_IGNORE_SELECTOR));
}

export interface ResolvedHotkey<TId extends string = string> {
  id: TId;
  repeat: HotkeyRepeat;
}

export function createHotkeyRegistry<TId extends string>(
  defs: readonly HotkeyDef<TId>[],
): Map<string, ResolvedHotkey<TId>> {
  const registry = new Map<string, ResolvedHotkey<TId>>();
  for (const def of defs) {
    const chord = parseChord(def.chord);
    if (!chord) continue;
    const key = chordKey(chord);
    if (registry.has(key)) continue;
    registry.set(key, { id: def.id, repeat: def.repeat });
  }
  return registry;
}

export interface HotkeysHandlerOptions<TId extends string = string> {
  registry: Map<string, ResolvedHotkey<TId>>;
  ignore?: (event: KeyboardEvent) => boolean;
  onAction: (id: TId, event: KeyboardEvent) => void;
}

export function createHotkeysHandler<TId extends string>(
  options: HotkeysHandlerOptions<TId>,
): (event: KeyboardEvent) => void {
  const { registry, ignore, onAction } = options;
  return (event) => {
    if (event.isComposing || ignore?.(event)) return;
    const hit = registry.get(chordKeyFromEvent(event));
    if (!hit) return;
    if (event.repeat && hit.repeat === "once") return;
    event.preventDefault();
    onAction(hit.id, event);
  };
}

export function subscribeHotkeys<TId extends string>(
  target: Window | HTMLElement,
  options: Omit<HotkeysHandlerOptions<TId>, "registry"> & { defs: readonly HotkeyDef<TId>[] },
): () => void {
  const handler = createHotkeysHandler({
    registry: createHotkeyRegistry(options.defs),
    ignore: options.ignore,
    onAction: options.onAction,
  });
  const listener = (event: Event): void => {
    if (event instanceof KeyboardEvent) handler(event);
  };
  target.addEventListener("keydown", listener);
  return () => target.removeEventListener("keydown", listener);
}
