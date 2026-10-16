/**
 * v1.38 — Shared rules for publishing editor changes online.
 *
 * Used by the placement editor (pre-flight checks and file naming), by the
 * Cloudflare Worker save service (`worker/src/`, server-side validation), and
 * by the Node test scripts. Pure functions only: no DOM, no network.
 *
 * The artwork ID rule mirrors `normalizeId` + `uniqueId` in
 * `scripts/import-artworks.mjs`, so an artwork uploaded from the editor keeps
 * the same ID after the online build runs the importer.
 */
import { sanitizeMuseumHubConfig, type MuseumHubConfig } from '../config/museumHub';

export const MUSEUM_HUB_PATH = 'customer-artworks/museum-hub.json';
export const BACKGROUNDS_DIR = 'customer-artworks/Backgrounds/';
export const INBOX_DIR = 'customer-artworks/inbox/';

/** Long side of artwork and background uploads after browser downscaling. */
export const MAX_UPLOAD_LONG_SIDE = 4096;
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const MAX_TEXT_BYTES = 64 * 1024;
export const MAX_CONFIG_BYTES = 2 * 1024 * 1024;
export const MAX_PACKAGE_BYTES = 40 * 1024 * 1024;
export const MAX_PACKAGE_FILES = 40;

export type UploadImageExtension = 'png' | 'jpg' | 'webp';

/** Same rule as `normalizeId` in scripts/import-artworks.mjs. */
export function normalizeArtworkId(stem: string): string {
  return (
    stem
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-') || 'artwork'
  );
}

/** Same rule as `uniqueId` in scripts/import-artworks.mjs (mutates `taken`). */
export function uniqueArtworkId(base: string, taken: Set<string>): string {
  let id = base;
  let index = 2;
  while (taken.has(id)) id = `${base}-${index++}`;
  taken.add(id);
  return id;
}

function shortSlug(stem: string, fallback: string): string {
  return normalizeArtworkId(stem).slice(0, 60).replace(/-+$/g, '') || fallback;
}

/**
 * Picks an upload ID that the importer reproduces exactly: the uploaded file
 * is stored as `<id>.<ext>`, `normalizeArtworkId(id) === id`, and the ID is
 * neither taken nor shaped like an importer duplicate (`<taken>-N`).
 */
export function chooseUploadArtworkId(fileName: string, takenIds: Iterable<string>): string {
  const taken = new Set(takenIds);
  const base = shortSlug(fileName.replace(/\.[^.]*$/, ''), 'artwork');
  const blocked = (candidate: string): boolean =>
    taken.has(candidate)
    || [...taken].some((id) => candidate.startsWith(`${id}-`) && /^\d+$/.test(candidate.slice(id.length + 1)));
  if (!blocked(base)) return base;
  for (let index = 2; index < 10_000; index += 1) {
    const candidate = `${base}-neu${index}`;
    if (!blocked(candidate)) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}

/**
 * Computes the IDs the importer assigns for a list of inbox file names
 * (sidecars are ignored). Order and collisions match the importer: sorted with
 * `localeCompare('en', numeric, base)`, then `normalizeId` + `uniqueId`.
 */
export function importerArtworkIds(inboxFileNames: readonly string[]): string[] {
  return [...importerArtworkIdMap(inboxFileNames).values()];
}

/** File name → importer ID, in importer order. */
export function importerArtworkIdMap(inboxFileNames: readonly string[]): Map<string, string> {
  const images = inboxFileNames
    .filter((name) => !name.startsWith('.'))
    .filter((name) => /\.(png|jpe?g|webp|gif|svg|avif)$/i.test(name))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' }));
  const taken = new Set<string>();
  return new Map(images.map((name, index) => {
    const stem = name.replace(/\.[^.]*$/, '');
    const base = normalizeArtworkId(stem) || `artwork-${String(index + 1).padStart(2, '0')}`;
    return [name, uniqueArtworkId(base, taken)] as const;
  }));
}

/** Lowercase, URL- and case-safe file name with the given extension. */
export function safeUploadFileName(fileName: string, extension: UploadImageExtension | 'txt'): string {
  return `${shortSlug(fileName.replace(/\.[^.]*$/, ''), 'datei')}.${extension}`;
}

/** Appends `-2`, `-3`, … until the name differs (case-insensitively) from all taken names. */
export function uniqueFileName(fileName: string, takenNames: Iterable<string>): string {
  const taken = new Set([...takenNames].map((name) => name.toLowerCase()));
  if (!taken.has(fileName.toLowerCase())) return fileName;
  const dot = fileName.lastIndexOf('.');
  const stem = dot > 0 ? fileName.slice(0, dot) : fileName;
  const ext = dot > 0 ? fileName.slice(dot) : '';
  for (let index = 2; index < 10_000; index += 1) {
    const candidate = `${stem}-${index}${ext}`;
    if (!taken.has(candidate.toLowerCase())) return candidate;
  }
  return `${stem}-${Date.now().toString(36)}${ext}`;
}

/** Detects the real image type from the first bytes (file signature). */
export function sniffImageType(bytes: Uint8Array): 'png' | 'jpeg' | 'webp' | null {
  if (
    bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
    && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  ) return 'png';
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg';
  if (
    bytes.length >= 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46
    && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) return 'webp';
  return null;
}

function extensionMatchesType(extension: string, type: 'png' | 'jpeg' | 'webp'): boolean {
  if (type === 'jpeg') return extension === 'jpg' || extension === 'jpeg';
  return extension === type;
}

const SAFE_NAME = /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?\.(png|jpe?g|webp|txt)$/;

export type PackageFileKind = 'background' | 'artwork-image' | 'artwork-text';

/** Classifies an upload path, or returns an error text when it is not allowed. */
export function classifyPackagePath(path: string): { kind: PackageFileKind; name: string } | { error: string } {
  if (typeof path !== 'string' || path.length > 200) return { error: 'Ungültiger Dateipfad.' };
  // eslint-disable-next-line no-control-regex
  if (path.includes('..') || path.includes('\\') || path.startsWith('/') || /[\u0000-\u001f]/.test(path)) {
    return { error: `Pfad nicht erlaubt: ${path}` };
  }
  const inDir = (dir: string): string | null =>
    path.startsWith(dir) && !path.slice(dir.length).includes('/') ? path.slice(dir.length) : null;
  const background = inDir(BACKGROUNDS_DIR);
  const inbox = inDir(INBOX_DIR);
  const name = background ?? inbox;
  if (name === null) return { error: `Pfad nicht erlaubt: ${path}` };
  if (!SAFE_NAME.test(name)) {
    return { error: `Dateiname muss klein geschrieben sein und darf nur a–z, 0–9 und - enthalten: ${name}` };
  }
  if (background !== null) {
    if (name.endsWith('.txt')) return { error: `Hintergründe müssen Bilder sein: ${name}` };
    return { kind: 'background', name };
  }
  return { kind: name.endsWith('.txt') ? 'artwork-text' : 'artwork-image', name };
}

export function base64ByteLength(base64: string): number {
  const clean = base64.replace(/\s+/g, '');
  const padding = clean.endsWith('==') ? 2 : clean.endsWith('=') ? 1 : 0;
  return Math.floor((clean.length * 3) / 4) - padding;
}

function base64Bytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function base64Head(base64: string, byteCount: number): Uint8Array {
  return base64Bytes(base64.replace(/\s+/g, '').slice(0, Math.ceil(byteCount / 3) * 4));
}

/**
 * Fields the online editor must never change. The editor *does* edit wall
 * corners, mounting zones, rooms, assignments, and the background, so those
 * are excluded (unlike the stricter file-import rule `hubFixedFieldsSignature`,
 * which compares against the already opened editor state).
 */
export function hubPublishLockedSignature(config: MuseumHubConfig): string {
  return JSON.stringify({
    version: config.version,
    coverage: config.coverage,
    stage: config.stage,
    visualTokens: config.visualTokens,
    camera: config.camera ?? null,
    room: config.room ?? null,
    hangingRules: config.hangingRules ?? null,
    slotsPerPage: config.slotsPerPage ?? null,
    walls: config.walls.map((wall) => ({ id: wall.id, role: wall.role ?? 'rendered' })),
  });
}

/** Text file next to an uploaded artwork, in the importer's sidecar format. */
export function buildArtworkSidecar(fields: { title: string; credit?: string; year?: string; description?: string }): string {
  const clean = (value: string | undefined): string => (value ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, 200);
  const lines = [`Title: ${clean(fields.title) || 'Ohne Titel'}`];
  if (clean(fields.credit)) lines.push(`Credit: ${clean(fields.credit)}`);
  if (/^\d{4}$/.test(clean(fields.year))) lines.push(`Year: ${clean(fields.year)}`);
  const description = (fields.description ?? '').replace(/\r\n?/g, '\n').trim().slice(0, 4000);
  if (description) lines.push('', 'Description:', description);
  return `${lines.join('\n')}\n`;
}

export interface PublishFile {
  path: string;
  contentBase64: string;
}

export interface PublishPackage {
  baseCommit: string | null;
  config: unknown;
  files: PublishFile[];
  message?: string;
}

export interface PublishValidationContext {
  /** museum-hub.json as currently committed (for the locked-field rule). */
  currentConfig: unknown;
  /** Exact existing file names in customer-artworks/Backgrounds/. */
  existingBackgrounds: readonly string[];
  /** Exact existing file names in customer-artworks/inbox/. */
  existingInbox: readonly string[];
}

export interface PublishValidationResult {
  errors: string[];
  /** Pretty-printed museum-hub.json that will be committed. */
  configText: string | null;
}

/** Server-side (and editor pre-flight) validation of one save package. */
export function validatePublishPackage(pkg: unknown, context: PublishValidationContext): PublishValidationResult {
  const errors: string[] = [];
  if (!pkg || typeof pkg !== 'object' || Array.isArray(pkg)) {
    return { errors: ['Das Speicherpaket ist ungültig.'], configText: null };
  }
  const candidate = pkg as Partial<PublishPackage>;
  if (candidate.files !== undefined && !Array.isArray(candidate.files)) errors.push('Die Dateiliste ist ungültig.');
  const files: unknown[] = Array.isArray(candidate.files) ? candidate.files : [];
  if (files.length > MAX_PACKAGE_FILES) errors.push(`Zu viele Dateien (höchstens ${MAX_PACKAGE_FILES}).`);

  const sanitized = sanitizeMuseumHubConfig(candidate.config);
  const current = sanitizeMuseumHubConfig(context.currentConfig);
  let configText: string | null = null;
  if (!sanitized.config || !candidate.config || typeof candidate.config !== 'object') {
    errors.push('museum-hub.json ist ungültig.');
  } else {
    configText = `${JSON.stringify(candidate.config, null, 2)}\n`;
    if (configText.length > MAX_CONFIG_BYTES) errors.push('museum-hub.json ist zu groß.');
    if (current.config && hubPublishLockedSignature(current.config) !== hubPublishLockedSignature(sanitized.config)) {
      errors.push('Feste Einstellungen (Kamera, Raumform, Wandliste, Bühne) wurden verändert.');
    }
  }

  let total = 0;
  const seen = new Set<string>();
  const uploadedBackgrounds = new Set<string>();
  const uploadedImageNames: string[] = [];
  const uploadedImageStems = new Set<string>();
  const uploadedTextStems = new Set<string>();
  const existingBackgroundsLower = new Set(context.existingBackgrounds.map((name) => name.toLowerCase()));
  const existingInboxStems = new Set(context.existingInbox.map((name) => name.toLowerCase().replace(/\.[^.]*$/, '')));
  for (const entry of files) {
    const file = entry as Partial<PublishFile> | null;
    if (!file || typeof file.path !== 'string' || typeof file.contentBase64 !== 'string') {
      errors.push('Eine Datei im Paket ist ungültig.');
      continue;
    }
    const classified = classifyPackagePath(file.path);
    if ('error' in classified) {
      errors.push(classified.error);
      continue;
    }
    if (seen.has(file.path)) errors.push(`Datei doppelt im Paket: ${classified.name}`);
    seen.add(file.path);
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(file.contentBase64)) {
      errors.push(`Datei ist nicht korrekt kodiert: ${classified.name}`);
      continue;
    }
    const size = base64ByteLength(file.contentBase64);
    total += size;
    const stem = classified.name.replace(/\.[^.]*$/, '');
    const extension = classified.name.slice(classified.name.lastIndexOf('.') + 1);
    if (classified.kind === 'artwork-text') {
      if (size > MAX_TEXT_BYTES) {
        errors.push(`Textdatei zu groß: ${classified.name}`);
      } else {
        try {
          new TextDecoder('utf-8', { fatal: true }).decode(base64Bytes(file.contentBase64));
        } catch {
          errors.push(`Textdatei ist kein gültiger UTF-8-Text: ${classified.name}`);
        }
      }
      uploadedTextStems.add(stem);
      continue;
    }
    if (size > MAX_IMAGE_BYTES) {
      errors.push(
        `Bild zu groß (${(size / 1024 / 1024).toFixed(1)} MB, höchstens ${MAX_IMAGE_BYTES / 1024 / 1024} MB): ${classified.name}`
      );
    }
    let type: ReturnType<typeof sniffImageType> = null;
    try {
      type = sniffImageType(base64Head(file.contentBase64, 16));
    } catch {
      type = null;
    }
    if (!type || !extensionMatchesType(extension, type)) {
      errors.push(`Datei ist kein echtes ${extension.toUpperCase()}-Bild: ${classified.name}`);
    }
    if (classified.kind === 'background') {
      if (existingBackgroundsLower.has(classified.name)) errors.push(`Hintergrund existiert bereits: ${classified.name}`);
      uploadedBackgrounds.add(classified.name);
    } else {
      if (existingInboxStems.has(stem)) errors.push(`Ein Bild mit diesem Namen existiert bereits: ${classified.name}`);
      if (uploadedImageStems.has(stem)) errors.push(`Zwei Bilder mit gleichem Namen im Paket: ${stem}`);
      uploadedImageStems.add(stem);
      uploadedImageNames.push(classified.name);
    }
  }
  for (const stem of uploadedTextStems) {
    if (!uploadedImageStems.has(stem)) errors.push(`Textdatei ohne passendes Bild: ${stem}.txt`);
  }
  if (total > MAX_PACKAGE_BYTES) {
    errors.push(
      `Das Paket ist zu groß (${(total / 1024 / 1024).toFixed(1)} MB, höchstens ${MAX_PACKAGE_BYTES / 1024 / 1024} MB).`
    );
  }

  if (sanitized.config && candidate.config && typeof candidate.config === 'object') {
    const raw = candidate.config as { background?: { src?: unknown } };
    const src = typeof raw.background?.src === 'string' ? raw.background.src : '';
    const match = /^Backgrounds\/([^/\\]+)$/.exec(src);
    if (!match || src.includes('..')) {
      errors.push(`Hintergrund-Pfad ist ungültig: ${src || '(leer)'}`);
    } else {
      const name = match[1]!;
      const existing = context.existingBackgrounds.find((entry) => entry.toLowerCase() === name.toLowerCase());
      const uploaded = uploadedBackgrounds.has(name);
      const currentSrc = (context.currentConfig as { background?: { src?: unknown } } | null)?.background?.src;
      // An unchanged, still missing background keeps the runtime fallback
      // image (validate:deploy reports it as a warning); a new one must exist.
      if (!uploaded && existing === undefined && src !== currentSrc) errors.push(`Hintergrund nicht gefunden: ${name}`);
      else if (!uploaded && existing !== undefined && existing !== name) errors.push(`Hintergrund-Schreibweise stimmt nicht (Groß/Klein): ${name}`);
    }
    const before = importerArtworkIdMap(context.existingInbox);
    const after = importerArtworkIdMap([...context.existingInbox, ...uploadedImageNames]);
    for (const [name, id] of before) {
      if (after.get(name) !== id) errors.push(`Neue Bilder würden die Kennung von ${name} ändern; bitte anders benennen.`);
    }
    const knownIds = new Set(after.values());
    for (const slot of sanitized.config.slots) {
      if (slot.artworkId && !knownIds.has(slot.artworkId)) errors.push(`Unbekanntes Bild in ${slot.id}: ${slot.artworkId}`);
    }
  }
  return { errors, configText };
}
