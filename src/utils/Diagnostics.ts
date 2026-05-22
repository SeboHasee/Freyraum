export type DiagnosticsMode = 'default' | 'info' | 'verbose';
export type DiagnosticLevel = 'debug' | 'info' | 'warn' | 'error';

export interface DiagnosticEntry {
  id: number;
  timestamp: string;
  relativeMs: number;
  level: DiagnosticLevel;
  scope: string;
  event: string;
  message: string;
  data?: unknown;
  repeatCount: number;
}

export interface DiagnosticsSnapshot {
  sessionStartedAt: string;
  mode: DiagnosticsMode;
  entries: readonly DiagnosticEntry[];
}

export interface DiagnosticsPublicApi {
  getMode(): DiagnosticsMode;
  setMode(mode: DiagnosticsMode): void;
  getEntries(): readonly DiagnosticEntry[];
  clear(): void;
  print(level?: DiagnosticLevel): void;
  snapshot(): DiagnosticsSnapshot;
  /** Returns all entries as a formatted JSON string. Useful for copy-paste bug reports. */
  exportJson(): string;
  /**
   * Prints a compact summary to the console: one line per scope+event, with
   * counts and the last message. Useful for a quick orientation in a verbose
   * session without scrolling through hundreds of individual entries.
   */
  summarize(): void;
}

declare global {
  interface Window {
    __FREYRAUM_DIAGNOSTICS__?: DiagnosticsPublicApi;
  }
}

const STORAGE_KEY = 'freyraum.diagnostics.mode';
const MAX_ENTRIES = 500;
const DEDUPE_WINDOW_MS = 2_500;

const LEVEL_RANK: Record<DiagnosticLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function parseMode(value: string | null): DiagnosticsMode | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === '1' || normalized === 'true' || normalized === 'info') return 'info';
  if (normalized === 'verbose' || normalized === '2') return 'verbose';
  if (normalized === '0' || normalized === 'false' || normalized === 'default') return 'default';
  return null;
}

function readQueryMode(): DiagnosticsMode | null {
  try {
    const params = new URLSearchParams(window.location.search);
    return parseMode(params.get('debug'));
  } catch {
    return null;
  }
}

function readStoredMode(): DiagnosticsMode | null {
  try {
    return parseMode(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function writeStoredMode(mode: DiagnosticsMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Ignore storage failures; diagnostics must never break the app.
  }
}

function consoleThresholdForMode(mode: DiagnosticsMode): DiagnosticLevel {
  switch (mode) {
    case 'verbose':
      return 'debug';
    case 'info':
      return 'info';
    default:
      return 'warn';
  }
}

function serializeValue(value: unknown, depth = 0, seen?: WeakSet<object>): unknown {
  if (value === null || value === undefined) return value;
  if (depth > 3) return '[max-depth]';
  if (typeof value === 'function') return `[function ${(value as { name?: string }).name || 'anonymous'}]`;
  if (typeof value === 'bigint') return value.toString();
  if (typeof value === 'symbol') return value.toString();
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }
  if (Array.isArray(value)) return value.map((item) => serializeValue(item, depth + 1, seen));
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const seenRefs = seen ?? new WeakSet<object>();
    if (seenRefs.has(obj)) return '[circular]';
    seenRefs.add(obj);
    const out: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(obj)) {
      out[key] = serializeValue(entry, depth + 1, seenRefs);
    }
    return out;
  }
  return value;
}

class Diagnostics {
  private readonly startedAt = performance.now();
  private readonly startedAtIso = new Date().toISOString();
  private entries: DiagnosticEntry[] = [];
  private nextId = 1;
  private mode: DiagnosticsMode;
  private readonly dedupe = new Map<string, { entryId: number; lastSeen: number }>();
  private globalHandlersInstalled = false;
  private handlingGlobalError = false;

  constructor() {
    this.mode = readQueryMode() ?? readStoredMode() ?? 'default';
    if (typeof window !== 'undefined') {
      window.__FREYRAUM_DIAGNOSTICS__ = this.publicApi();
    }
  }

  getMode(): DiagnosticsMode {
    return this.mode;
  }

  setMode(mode: DiagnosticsMode): void {
    this.mode = mode;
    writeStoredMode(mode);
    this.info('diagnostics', 'mode-changed', `Diagnostics mode set to ${mode}`);
  }

  installGlobalHandlers(): void {
    if (this.globalHandlersInstalled || typeof window === 'undefined') return;
    this.globalHandlersInstalled = true;

    window.addEventListener('error', (event) => {
      if (this.handlingGlobalError) return;
      this.handlingGlobalError = true;
      try {
        this.error('window', 'uncaught-error', event.message || 'Uncaught window error', {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error,
        });
      } catch (err) {
        console.error('[freyraum][diagnostics][error] Failed to handle global window error', err);
      } finally {
        this.handlingGlobalError = false;
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      if (this.handlingGlobalError) return;
      this.handlingGlobalError = true;
      try {
        this.error('window', 'unhandled-rejection', 'Unhandled promise rejection', {
          reason: event.reason,
        });
      } catch (err) {
        console.error('[freyraum][diagnostics][error] Failed to handle unhandled rejection', err);
      } finally {
        this.handlingGlobalError = false;
      }
    });
  }

  debug(scope: string, event: string, message: string, data?: unknown): void {
    this.push('debug', scope, event, message, data);
  }

  info(scope: string, event: string, message: string, data?: unknown): void {
    this.push('info', scope, event, message, data);
  }

  warn(scope: string, event: string, message: string, data?: unknown): void {
    this.push('warn', scope, event, message, data);
  }

  error(scope: string, event: string, message: string, data?: unknown): void {
    this.push('error', scope, event, message, data);
  }

  child(scope: string): ScopedDiagnostics {
    return new ScopedDiagnostics(this, scope);
  }

  getEntries(): readonly DiagnosticEntry[] {
    return this.entries;
  }

  clear(): void {
    this.entries = [];
    this.dedupe.clear();
  }

  snapshot(): DiagnosticsSnapshot {
    return {
      sessionStartedAt: this.startedAtIso,
      mode: this.mode,
      entries: this.entries,
    };
  }

  print(level: DiagnosticLevel = 'info'): void {
    const minRank = LEVEL_RANK[level];
    for (const entry of this.entries) {
      if (LEVEL_RANK[entry.level] < minRank) continue;
      this.printEntry(entry);
    }
  }

  exportJson(): string {
    return JSON.stringify(this.snapshot(), null, 2);
  }

  summarize(): void {
    // Group by scope+event, track count, last message, and worst level.
    type Summary = { count: number; level: DiagnosticLevel; lastMessage: string; lastMs: number };
    const groups = new Map<string, Summary>();
    for (const entry of this.entries) {
      const key = `[${entry.scope}] ${entry.event}`;
      const existing = groups.get(key);
      if (existing) {
        existing.count += entry.repeatCount;
        existing.lastMessage = entry.message;
        existing.lastMs = entry.relativeMs;
        if (LEVEL_RANK[entry.level] > LEVEL_RANK[existing.level]) {
          existing.level = entry.level;
        }
      } else {
        groups.set(key, {
          count: entry.repeatCount,
          level: entry.level,
          lastMessage: entry.message,
          lastMs: entry.relativeMs,
        });
      }
    }
    console.group('[freyraum] Diagnostics summary');
    for (const [key, s] of groups) {
      const label = `${key} (×${s.count}, last +${s.lastMs}ms) — ${s.lastMessage}`;
      if (s.level === 'error') console.error(label);
      else if (s.level === 'warn') console.warn(label);
      else if (s.level === 'info') console.info(label);
      else console.debug(label);
    }
    console.groupEnd();
  }

  private publicApi(): DiagnosticsPublicApi {
    return {
      getMode: () => this.getMode(),
      setMode: (mode) => this.setMode(mode),
      getEntries: () => this.getEntries(),
      clear: () => this.clear(),
      print: (level) => this.print(level),
      snapshot: () => this.snapshot(),
      exportJson: () => this.exportJson(),
      summarize: () => this.summarize(),
    };
  }

  private push(level: DiagnosticLevel, scope: string, event: string, message: string, data?: unknown): void {
    let safeData: unknown;
    try {
      safeData = data === undefined ? undefined : serializeValue(data);
    } catch (err) {
      safeData = {
        serializationError: err instanceof Error ? err.message : String(err),
      };
    }
    const now = performance.now();
    const dedupeKey = `${level}|${scope}|${event}|${message}`;
    const dedupeHit = this.dedupe.get(dedupeKey);
    if (dedupeHit && now - dedupeHit.lastSeen < DEDUPE_WINDOW_MS) {
      const existing = this.entries.find((entry) => entry.id === dedupeHit.entryId);
      if (existing) {
        existing.repeatCount += 1;
        dedupeHit.lastSeen = now;
        return;
      }
    }

    const entry: DiagnosticEntry = {
      id: this.nextId++,
      timestamp: new Date().toISOString(),
      relativeMs: Math.round(now - this.startedAt),
      level,
      scope,
      event,
      message,
      data: safeData,
      repeatCount: 1,
    };

    this.entries.push(entry);
    if (this.entries.length > MAX_ENTRIES) {
      this.entries = this.entries.slice(-MAX_ENTRIES);
    }
    this.dedupe.set(dedupeKey, { entryId: entry.id, lastSeen: now });

    if (LEVEL_RANK[level] >= LEVEL_RANK[consoleThresholdForMode(this.mode)]) {
      try {
        this.printEntry(entry);
      } catch (err) {
        console.error('[freyraum][diagnostics][error] Failed to print diagnostic entry', err);
      }
    }
  }

  private printEntry(entry: DiagnosticEntry): void {
    const prefix = `[freyraum][${entry.scope}][${entry.level}] +${entry.relativeMs}ms ${entry.message}`;
    const meta: Record<string, unknown> = { event: entry.event };
    if (entry.repeatCount > 1) meta['repeats'] = entry.repeatCount;

    const hasData = entry.data !== undefined;
    const logFn =
      entry.level === 'error' ? console.error
      : entry.level === 'warn' ? console.warn
      : entry.level === 'info' ? console.info
      : console.debug;

    if (hasData) {
      // Use a collapsed group so the message is visible at a glance but the
      // full payload expands on demand. This keeps the console readable.
      try {
        console.groupCollapsed(prefix, meta);
        logFn('data:', entry.data);
        console.groupEnd();
      } catch {
        logFn(prefix, meta, entry.data);
      }
    } else {
      try {
        logFn(prefix, meta);
      } catch {
        console.log(prefix, meta);
      }
    }
  }
}

class ScopedDiagnostics {
  constructor(
    private readonly diagnostics: Diagnostics,
    private readonly scope: string
  ) {}

  debug(event: string, message: string, data?: unknown): void {
    this.diagnostics.debug(this.scope, event, message, data);
  }

  info(event: string, message: string, data?: unknown): void {
    this.diagnostics.info(this.scope, event, message, data);
  }

  warn(event: string, message: string, data?: unknown): void {
    this.diagnostics.warn(this.scope, event, message, data);
  }

  error(event: string, message: string, data?: unknown): void {
    this.diagnostics.error(this.scope, event, message, data);
  }
}

const diagnosticsSingleton = new Diagnostics();

export function getDiagnostics(): Diagnostics {
  return diagnosticsSingleton;
}

export function createScopedDiagnostics(scope: string): ScopedDiagnostics {
  return diagnosticsSingleton.child(scope);
}
