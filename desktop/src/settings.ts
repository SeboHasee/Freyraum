/**
 * v1.39 — Remembered settings of the FREYRAUM Editor desktop app
 * (`settings.json` in the app's user-data folder): last project folder and
 * window size. Pure Node so it can be tested without Electron.
 */
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export interface WindowBounds {
  x?: number;
  y?: number;
  width: number;
  height: number;
  maximized: boolean;
}

export interface AppSettings {
  projectRoot: string | null;
  window: WindowBounds | null;
}

const DEFAULT_SETTINGS: AppSettings = { projectRoot: null, window: null };

function finite(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function readSettings(file: string): AppSettings {
  try {
    if (!existsSync(file)) return { ...DEFAULT_SETTINGS };
    const raw = JSON.parse(readFileSync(file, 'utf8')) as Partial<AppSettings> | null;
    const bounds = raw?.window;
    return {
      projectRoot: typeof raw?.projectRoot === 'string' && raw.projectRoot ? raw.projectRoot : null,
      window:
        bounds && finite(bounds.width) && finite(bounds.height) && bounds.width >= 640 && bounds.height >= 480
          ? {
              ...(finite(bounds.x) ? { x: bounds.x } : {}),
              ...(finite(bounds.y) ? { y: bounds.y } : {}),
              width: Math.round(bounds.width),
              height: Math.round(bounds.height),
              maximized: bounds.maximized === true,
            }
          : null,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function writeSettings(file: string, settings: AppSettings): void {
  try {
    mkdirSync(dirname(file), { recursive: true });
    const temp = `${file}.tmp`;
    writeFileSync(temp, `${JSON.stringify(settings, null, 2)}\n`, 'utf8');
    renameSync(temp, file);
  } catch {
    // Settings are a convenience; failing to store them must not stop the app.
  }
}
