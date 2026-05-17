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
}

declare global {
  interface Window {
    __FREYRAUM_DIAGNOSTICS__?: DiagnosticsPublicApi;
  }
}

const STORAGE_KEY = 'freyraum.diagnostics.mode';
const MAX_ENTRIES = 300;
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

function serializeValue(value: unknown, depth = 0): unknown {
  if (value === null || value === undefined) return value;
  if (depth > 3) return '[max-depth]';
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }
  if (Array.isArray(value)) return value.map((item) => serializeValue(item, depth + 1));
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      out[key] = serializeValue(entry, depth + 1);
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
      this.error('window', 'uncaught-error', event.message || 'Uncaught window error', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.error('window', 'unhandled-rejection', 'Unhandled promise rejection', {
        reason: event.reason,
      });
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

  private publicApi(): DiagnosticsPublicApi {
    return {
      getMode: () => this.getMode(),
      setMode: (mode) => this.setMode(mode),
      getEntries: () => this.getEntries(),
      clear: () => this.clear(),
      print: (level) => this.print(level),
      snapshot: () => this.snapshot(),
    };
  }

  private push(level: DiagnosticLevel, scope: string, event: string, message: string, data?: unknown): void {
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
      data: data === undefined ? undefined : serializeValue(data),
      repeatCount: 1,
    };

    this.entries.push(entry);
    if (this.entries.length > MAX_ENTRIES) {
      this.entries = this.entries.slice(-MAX_ENTRIES);
    }
    this.dedupe.set(dedupeKey, { entryId: entry.id, lastSeen: now });

    if (LEVEL_RANK[level] >= LEVEL_RANK[consoleThresholdForMode(this.mode)]) {
      this.printEntry(entry);
    }
  }

  private printEntry(entry: DiagnosticEntry): void {
    const prefix = `[freyraum][${entry.scope}][${entry.level}] ${entry.message}`;
    const payload: Record<string, unknown> = {
      event: entry.event,
      atMs: entry.relativeMs,
    };
    if (entry.repeatCount > 1) {
      payload['repeats'] = entry.repeatCount;
    }
    if (entry.data !== undefined) {
      payload['data'] = entry.data;
    }

    switch (entry.level) {
      case 'debug':
        console.debug(prefix, payload);
        break;
      case 'info':
        console.info(prefix, payload);
        break;
      case 'warn':
        console.warn(prefix, payload);
        break;
      case 'error':
        console.error(prefix, payload);
        break;
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
