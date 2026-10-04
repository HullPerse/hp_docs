import { COLOR_MAP } from "./logger.config";
import type { LogLevel } from "./logger.types";

/**
 * Minimal color console logger for Bun servers. Base template, not a target:
 * it has no level text, context object, or secret redaction yet. Add those as
 * the server grows, or swap for an ecosystem package (pino, winston) when the
 * project needs transports, structured JSON, or metrics.
 */
export default class Logger {
  private author: string;

  constructor(author = "SYSTEM") {
    this.author = author.toUpperCase();
  }

  private static get timestamp(): string {
    const now = new Date();

    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }

  private format(message: string, level: LogLevel): string {
    return `${Logger.formatTimestamp(Logger.timestamp)} ${this.formatLabel(level)} ${message}\u001B[0m`;
  }

  private static formatTimestamp(timestamp: string): string {
    const colored = Bun.color("grey", "ansi");
    return `${colored}[${timestamp}]\u001B[0m`;
  }

  private formatLabel(level: LogLevel): string {
    const colored = Bun.color(COLOR_MAP[level], "ansi");
    return `${colored}[${this.author}]\u001B[0m`;
  }

  setAuthor(author: string): this {
    this.author = author.toUpperCase();
    return this;
  }

  log(message: string) {
    console.log(this.format(message, "log"));
  }

  debug(message: string) {
    console.debug(this.format(message, "debug"));
  }

  info(message: string) {
    console.info(this.format(message, "info"));
  }

  warn(message: string) {
    console.warn(this.format(message, "warn"));
  }

  error(message: string) {
    console.error(this.format(message, "error"));
  }

  success(message: string) {
    console.log(this.format(message, "success"));
  }

  static clear() {
    console.clear();
  }
}
