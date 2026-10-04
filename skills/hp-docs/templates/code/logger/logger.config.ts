import type { LogLevel } from "./logger.types";

export const COLOR_MAP: Record<LogLevel, string> = {
  debug: "magenta",
  error: "red",
  info: "cyan",
  log: "white",
  success: "green",
  warn: "yellow",
};
