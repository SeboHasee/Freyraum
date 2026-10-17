/**
 * v1.39 — Local project store: saves placement-editor changes straight into a
 * FREYRAUM project folder (the customer's Git checkout).
 *
 * Used by the FREYRAUM Editor desktop app (`desktop/src/main.ts`) and by
 * `scripts/test-local-project.mjs`. Pure Node (no Electron), so it can be
 * tested without a window.
 *
 * Same rules as the online save service (`worker/`): every package passes
 * `validatePublishPackage` from `src/online/publishRules.ts`, so the desktop
 * app can never write anything the deployed workflow would reject.
 *
 * Guarantees:
 *   - Only `customer-artworks/museum-hub.json`, new files in
 *     `customer-artworks/inbox/` and new files in
 *     `customer-artworks/Backgrounds/` are written; never outside the folder.
 *   - Existing images and text files are never overwritten.
 *   - All-or-nothing: everything is written to temporary files first and
 *     renamed into place afterwards; a failure removes what was added.
 *   - Version check: the save is refused when museum-hub.json changed since
 *     the editor opened it ("Neuere Version vorhanden – bitte neu laden").
 *   - The previous museum-hub.json is copied to `customer-artworks/history/`
 *     (last 10 kept) before it is replaced.
 */
import { spawn } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import {
  BACKGROUNDS_DIR,
  INBOX_DIR,
  MUSEUM_HUB_PATH,
  validatePublishPackage,
  type PublishFile,
} from '../../src/online/publishRules';

export const HISTORY_DIR = 'customer-artworks/history/';
export const HISTORY_LIMIT = 10;
export const PREVIEW_DATA_PATH = 'customer-preview/customer-artworks.js';
export const IMPORT_REPORT_PATH = 'customer-artworks/last-import-report.txt';

const HISTORY_NAME = /^museum-hub-\d{8}T\d{9}Z(?:-\d{1,3})?\.json$/;

export type ProjectStoreErrorCode = 'invalid' | 'stale' | 'conflict' | 'not-found' | 'io';

export class ProjectStoreError extends Error {
  constructor(
    message: string,
    readonly code: ProjectStoreErrorCode,
    readonly errors: readonly string[] = []
  ) {
    super(message);
  }
}

export interface ProjectCheck {
  ok: boolean;
  reason: string | null;
}

export interface ProjectInfo {
  root: string;
  name: string;
  /** Fingerprint of museum-hub.json the editor works on (see `projectVersion`). */
  version: string;
  hasMuseumHub: boolean;
  /** True when the generated preview data is missing or older than its sources. */
  previewStale: boolean;
}

export interface LocalSaveRequest {
  /** `ProjectInfo.version` when the editor opened the project. */
  baseVersion: string | null;
  config: unknown;
  files?: PublishFile[];
}

export interface LocalSaveResult {
  version: string;
  /** Project-relative paths that were written. */
  files: string[];
  /** History file name of the previous museum-hub.json, if there was one. */
  backup: string | null;
}

export interface LocalHistoryEntry {
  /** `current` or a file name in customer-artworks/history/. */
  id: string;
  savedAt: string;
  current: boolean;
}

export interface ImportRunOptions {
  /** Path of `import-artworks.mjs` to run. */
  importerPath: string;
  /** Node (or Electron with ELECTRON_RUN_AS_NODE=1) executable; default: this process. */
  execPath?: string;
  env?: NodeJS.ProcessEnv;
  timeoutMs?: number;
}

export interface ImportRunResult {
  ok: boolean;
  exitCode: number | null;
  /** Plain-language report (customer-artworks/last-import-report.txt). */
  report: string;
  output: string;
}

/** True when `child` is `parent` or lies inside it (both absolute). */
export function isInside(parent: string, child: string): boolean {
  const rel = relative(parent, child);
  return rel === '' || (!isAbsolute(rel) && rel.split(sep)[0] !== '..');
}

/** A folder is a FREYRAUM project when it has `customer-artworks/` and `package.json`. */
export function checkProjectFolder(root: string): ProjectCheck {
  try {
    if (!root || !statSync(root).isDirectory()) return { ok: false, reason: 'Der Ordner existiert nicht.' };
    const artworks = join(root, 'customer-artworks');
    if (!existsSync(artworks) || !statSync(artworks).isDirectory()) {
      return { ok: false, reason: 'Im Ordner fehlt „customer-artworks“. Bitte den FREYRAUM-Projektordner wählen.' };
    }
    if (!existsSync(join(root, 'package.json'))) {
      return { ok: false, reason: 'Im Ordner fehlt „package.json“. Bitte den FREYRAUM-Projektordner wählen.' };
    }
    return { ok: true, reason: null };
  } catch {
    return { ok: false, reason: 'Der Ordner kann nicht gelesen werden.' };
  }
}

function requireProject(root: string): string {
  const check = checkProjectFolder(root);
  if (!check.ok) throw new ProjectStoreError(check.reason ?? 'Kein FREYRAUM-Projektordner.', 'not-found');
  return realpathSync(root);
}

/** SHA-256 of museum-hub.json, or `missing`. */
export function projectVersion(root: string): string {
  const file = join(root, MUSEUM_HUB_PATH);
  if (!existsSync(file)) return 'missing';
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

function listFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && !entry.name.startsWith('.'))
    .map((entry) => entry.name);
}

function newestMtime(paths: readonly string[]): number {
  let newest = 0;
  for (const path of paths) {
    if (!existsSync(path)) continue;
    const stat = statSync(path);
    newest = Math.max(newest, stat.mtimeMs);
    if (stat.isDirectory()) {
      for (const name of listFiles(path)) newest = Math.max(newest, statSync(join(path, name)).mtimeMs);
    }
  }
  return newest;
}

/** True when `customer-preview/customer-artworks.js` is missing or older than its sources. */
export function previewNeedsImport(root: string): boolean {
  const preview = join(root, PREVIEW_DATA_PATH);
  if (!existsSync(preview)) return true;
  const sources = newestMtime([
    join(root, MUSEUM_HUB_PATH),
    join(root, 'customer-artworks', 'hub-hotspots.json'),
    join(root, INBOX_DIR),
    join(root, BACKGROUNDS_DIR),
    join(root, 'customer-audio', 'inbox'),
  ]);
  return sources > statSync(preview).mtimeMs;
}

export function readProjectInfo(root: string): ProjectInfo {
  const real = requireProject(root);
  return {
    root: real,
    name: basename(real),
    version: projectVersion(real),
    hasMuseumHub: existsSync(join(real, MUSEUM_HUB_PATH)),
    previewStale: previewNeedsImport(real),
  };
}

/**
 * Resolves a project-relative path and makes sure its folder exists and
 * really lies inside the project (also through symbolic links).
 */
function targetInside(root: string, projectPath: string): string {
  const target = resolve(root, ...projectPath.split('/'));
  if (!isInside(root, target)) throw new ProjectStoreError(`Pfad nicht erlaubt: ${projectPath}`, 'invalid');
  const folder = dirname(target);
  mkdirSync(folder, { recursive: true });
  if (!isInside(root, realpathSync(folder))) throw new ProjectStoreError(`Pfad nicht erlaubt: ${projectPath}`, 'invalid');
  return target;
}

function backupMuseumHub(root: string, now: Date): string | null {
  const source = join(root, MUSEUM_HUB_PATH);
  if (!existsSync(source)) return null;
  const folder = dirname(targetInside(root, `${HISTORY_DIR}museum-hub.json`));
  const stamp = now.toISOString().replace(/[-:.]/g, '');
  let name = `museum-hub-${stamp}.json`;
  for (let index = 2; existsSync(join(folder, name)) && index < 1000; index += 1) name = `museum-hub-${stamp}-${index}.json`;
  copyFileSync(source, join(folder, name));
  const backups = listFiles(folder).filter((entry) => HISTORY_NAME.test(entry)).sort();
  for (const old of backups.slice(0, Math.max(0, backups.length - HISTORY_LIMIT))) rmSync(join(folder, old), { force: true });
  return name;
}

interface StagedWrite {
  projectPath: string;
  target: string;
  temp: string;
  replace: boolean;
}

/** Error codes Windows reports while a virus scanner, indexer or Explorer briefly holds a file. */
const TRANSIENT_RENAME_CODES = new Set(['EPERM', 'EACCES', 'EBUSY']);
const RENAME_RETRY_DELAYS_MS = [50, 100, 200, 400, 800];

/**
 * `renameSync` with short retries for transient Windows file locks
 * (about 1.5 s in total). Other errors, and the last failure, are thrown.
 */
export function renameWithRetry(from: string, to: string, rename: (from: string, to: string) => void = renameSync): void {
  for (let attempt = 0; ; attempt += 1) {
    try {
      rename(from, to);
      return;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException | null)?.code ?? '';
      const delay = RENAME_RETRY_DELAYS_MS[attempt];
      if (!TRANSIENT_RENAME_CODES.has(code) || delay === undefined) throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delay);
    }
  }
}

function removeQuietly(path: string): void {
  try {
    unlinkSync(path);
  } catch {
    // Already gone.
  }
}

/** Validates a save package and writes it into the project (all-or-nothing). */
export function saveToProject(root: string, request: LocalSaveRequest, now: Date = new Date()): LocalSaveResult {
  const real = requireProject(root);
  const hubFile = join(real, MUSEUM_HUB_PATH);
  const currentText = existsSync(hubFile) ? readFileSync(hubFile, 'utf8') : null;
  if (request.baseVersion !== projectVersion(real)) {
    throw new ProjectStoreError('Neuere Version vorhanden – bitte neu laden.', 'stale');
  }
  let currentConfig: unknown = null;
  if (currentText !== null) {
    try {
      currentConfig = JSON.parse(currentText) as unknown;
    } catch {
      currentConfig = null;
    }
  }
  const files = Array.isArray(request.files) ? request.files : [];
  const validation = validatePublishPackage(
    { baseCommit: null, config: request.config, files },
    {
      currentConfig,
      existingBackgrounds: listFiles(join(real, BACKGROUNDS_DIR)),
      existingInbox: listFiles(join(real, INBOX_DIR)),
    }
  );
  if (validation.errors.length > 0 || validation.configText === null) {
    throw new ProjectStoreError('Die Änderungen wurden nicht gespeichert.', 'invalid', validation.errors);
  }

  const writes: { projectPath: string; bytes: Buffer; replace: boolean }[] = files.map((file) => ({
    projectPath: file.path,
    bytes: Buffer.from(file.contentBase64, 'base64'),
    replace: false,
  }));
  if (validation.configText !== currentText) {
    writes.push({ projectPath: MUSEUM_HUB_PATH, bytes: Buffer.from(validation.configText, 'utf8'), replace: true });
  }
  if (writes.length === 0) return { version: projectVersion(real), files: [], backup: null };

  // 1. Stage every file next to its target.
  const staged: StagedWrite[] = [];
  const suffix = `.${randomBytes(6).toString('hex')}.freyraum-tmp`;
  try {
    for (const write of writes) {
      const target = targetInside(real, write.projectPath);
      if (!write.replace && existsSync(target)) {
        throw new ProjectStoreError(`Datei existiert bereits: ${write.projectPath}`, 'conflict');
      }
      const temp = `${target}${suffix}`;
      writeFileSync(temp, write.bytes, { flag: 'wx' });
      staged.push({ projectPath: write.projectPath, target, temp, replace: write.replace });
    }
  } catch (error) {
    for (const entry of staged) removeQuietly(entry.temp);
    if (error instanceof ProjectStoreError) throw error;
    throw new ProjectStoreError(`Speichern fehlgeschlagen: ${(error as Error).message}`, 'io');
  }

  // 2. Keep the previous museum-hub.json, then move everything into place
  //    (museum-hub.json last, so the layout never points at missing files).
  let backup: string | null = null;
  const committed: string[] = [];
  try {
    if (staged.some((entry) => entry.replace)) backup = backupMuseumHub(real, now);
    for (const entry of [...staged.filter((item) => !item.replace), ...staged.filter((item) => item.replace)]) {
      if (!entry.replace && existsSync(entry.target)) {
        throw new ProjectStoreError(`Datei existiert bereits: ${entry.projectPath}`, 'conflict');
      }
      renameWithRetry(entry.temp, entry.target);
      committed.push(entry.target);
    }
  } catch (error) {
    for (const entry of staged) {
      if (!entry.replace && committed.includes(entry.target)) removeQuietly(entry.target);
      removeQuietly(entry.temp);
    }
    if (error instanceof ProjectStoreError) throw error;
    throw new ProjectStoreError(`Speichern fehlgeschlagen: ${(error as Error).message}`, 'io');
  }
  return { version: projectVersion(real), files: staged.map((entry) => entry.projectPath), backup };
}

/** Current museum-hub.json first, then saved versions (newest first). */
export function listHistory(root: string): LocalHistoryEntry[] {
  const real = requireProject(root);
  const entries: LocalHistoryEntry[] = [];
  const hubFile = join(real, MUSEUM_HUB_PATH);
  if (existsSync(hubFile)) entries.push({ id: 'current', savedAt: statSync(hubFile).mtime.toISOString(), current: true });
  const folder = join(real, HISTORY_DIR);
  const backups = listFiles(folder).filter((name) => HISTORY_NAME.test(name)).sort().reverse();
  for (const name of backups) entries.push({ id: name, savedAt: statSync(join(folder, name)).mtime.toISOString(), current: false });
  return entries;
}

/** Makes an earlier museum-hub.json current again (same checks as a save). */
export function restoreFromHistory(root: string, id: string, baseVersion: string | null, now: Date = new Date()): LocalSaveResult {
  const real = requireProject(root);
  if (typeof id !== 'string' || !HISTORY_NAME.test(id)) throw new ProjectStoreError('Unbekannte Version.', 'not-found');
  const file = join(real, HISTORY_DIR, id);
  if (!existsSync(file)) throw new ProjectStoreError('Diese Version gibt es nicht mehr.', 'not-found');
  let config: unknown;
  try {
    config = JSON.parse(readFileSync(file, 'utf8')) as unknown;
  } catch {
    throw new ProjectStoreError('Diese Version ist beschädigt.', 'invalid');
  }
  return saveToProject(real, { baseVersion, config, files: [] }, now);
}

/**
 * Runs `import-artworks.mjs --root <project>` ("Update Gallery") in a child
 * process and returns its plain-language report.
 */
export function runProjectImport(root: string, options: ImportRunOptions): Promise<ImportRunResult> {
  const real = requireProject(root);
  const reportFile = join(real, IMPORT_REPORT_PATH);
  const started = Date.now();
  return new Promise((resolvePromise) => {
    let output = '';
    let settled = false;
    const child = spawn(options.execPath ?? process.execPath, [options.importerPath, '--root', real], {
      cwd: real,
      env: options.env ?? process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });
    const append = (chunk: Buffer): void => {
      output = `${output}${chunk.toString('utf8')}`.slice(-200_000);
    };
    child.stdout?.on('data', append);
    child.stderr?.on('data', append);
    const timer = setTimeout(() => {
      output += '\nDie Galerie-Aktualisierung hat zu lange gedauert und wurde abgebrochen.\n';
      child.kill();
    }, options.timeoutMs ?? 5 * 60_000);
    const finish = (exitCode: number | null): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      let report = '';
      try {
        if (existsSync(reportFile) && statSync(reportFile).mtimeMs >= started - 1000) report = readFileSync(reportFile, 'utf8');
      } catch {
        report = '';
      }
      resolvePromise({ ok: exitCode === 0, exitCode, report: report || output, output });
    };
    child.on('error', (error) => {
      output += `${error.message}\n`;
      finish(null);
    });
    child.on('close', (code) => finish(code));
  });
}
