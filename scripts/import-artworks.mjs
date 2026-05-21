#!/usr/bin/env node
/**
 * FREYRAUM — Customer artwork importer (v0.18)
 *
 * Scans `customer-artworks/inbox/` for image files and matching plain-text
 * sidecar files, validates them, reads pixel dimensions (zero-dependency
 * header parsing), parses sidecar metadata, and emits:
 *   - `customer-artworks/artworks.json` (human-readable manifest, backed up)
 *   - `customer-preview/customer-artworks.js` (runtime injection for the app)
 *   - `customer-preview/images/<id>.<ext>` (copied image assets)
 *   - `customer-artworks/last-import-report.txt` (plain-language report)
 *
 * The importer is intentionally robust against partial failure: one bad
 * file does not stop the whole run. It also keeps a backup of the previous
 * manifest so a failed run can be restored manually.
 *
 * v0.18 — Sidecar text files
 * --------------------------
 * Each painting `inbox/<name>.<ext>` may have a matching plain-text card
 * `inbox/<name>.txt` (or `<name>.md` as a secondary alias). Sidecars are
 * matched by lowercase basename, parsed BOM-safely, and merged into the
 * generated manifest. Missing or invalid sidecars never fail the run; they
 * are surfaced through the plain-language report (`Text applied`,
 * `Pictures missing text`, `Text files without matching pictures`,
 * `Text fields needing attention`).
 *
 * The asset fields (`id`, `image`, `webglImage`, `dimensions`) remain
 * importer-owned. Sidecars only supply customer-facing metadata
 * (`title`, `subtitle`, `description`, `year`, `medium`, `alt`, `credit`,
 * `tags`, `surfaceProfile`).
 *
 * No npm dependencies are required. Node 18+.
 */

import {
  readdirSync,
  mkdirSync,
  cpSync,
  writeFileSync,
  existsSync,
  renameSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { join, extname, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// -------- Paths --------
const __filename = fileURLToPath(import.meta.url);
const ROOT = join(dirname(__filename), '..');
const INBOX = join(ROOT, 'customer-artworks', 'inbox');
const AUDIO_INBOX = join(ROOT, 'customer-audio', 'inbox');
const PROCESSED = join(ROOT, 'customer-artworks', 'processed');
const MANIFEST_JSON = join(ROOT, 'customer-artworks', 'artworks.json');
const MANIFEST_BACKUP = join(ROOT, 'customer-artworks', 'artworks.json.bak');
const PREVIEW_IMAGES = join(ROOT, 'customer-preview', 'images');
const PREVIEW_AUDIO = join(ROOT, 'customer-preview', 'audio');
const PREVIEW_JS = join(ROOT, 'customer-preview', 'customer-artworks.js');
const PREVIEW_AUDIO_JS = join(ROOT, 'customer-preview', 'customer-audio.js');
const PREVIEW_HTML = join(ROOT, 'customer-preview', 'app.html');
const REPORT_FILE = join(ROOT, 'customer-artworks', 'last-import-report.txt');

// -------- Format policy --------
const SAFE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif']);
const RISKY_EXTENSIONS = new Set(['.heic', '.heif', '.tif', '.tiff', '.bmp']);
const RAW_EXTENSIONS = new Set([
  '.cr2', '.cr3', '.nef', '.arw', '.dng', '.orf', '.rw2', '.raw', '.pef', '.srw',
]);
const AUDIO_SAFE_EXTENSIONS = new Set(['.mp3', '.ogg', '.m4a', '.wav']);
const AUDIO_SELECTION_PRIORITY = ['.mp3', '.ogg', '.m4a', '.wav'];
const AUDIO_MIME_TYPES = {
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.m4a': 'audio/mp4',
  '.wav': 'audio/wav',
};

// v0.18 — sidecar text files.
//   - `.txt` is the primary, customer-friendly format (Notepad / TextEdit).
//   - `.md` is accepted as a secondary alias and parsed with the same
//     `Label: value` + `Description:` block contract.
//   - Order matters: when both exist for the same image stem, `.txt` wins
//     and the duplicate is reported as a warning.
const SIDECAR_EXTENSIONS = ['.txt', '.md'];
const PRIMARY_SIDECAR_EXT = '.txt';

// Allowed surface profile values for sidecar `Surface:` lines. Mirrors the
// `SurfaceProfile` type in `src/config/artworks.ts` minus the runtime-only
// `procedural-fallback` value.
const ALLOWED_SURFACE_PROFILES = new Set([
  'matte-canvas',
  'satin-canvas',
  'varnished-oil',
  'paper',
]);

// Sidecar field keys (lowercased) that map to artwork metadata fields.
const SIDECAR_FIELD_KEYS = new Set([
  'title',
  'subtitle',
  'year',
  'credit',
  'alt',
  'tags',
  'surface',
  'medium',
  'description',
]);

/** MIME types for data URL encoding. */
const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.heic': 'image/heic',
  '.heif': 'image/heif',
  '.tif': 'image/tiff',
  '.tiff': 'image/tiff',
  '.bmp': 'image/bmp',
};

// -------- Helpers --------

/**
 * Reads image dimensions by parsing the file header. Supports the common
 * browser-safe formats. AVIF and some exotic WebP variants fall back to
 * placeholder `{0,0}` and are flagged so the customer can decide if they
 * want to convert them.
 */
function readImageDimensions(filePath) {
  const buf = readFileSync(filePath);

  // JPEG: scan for SOFn markers (0xFFC0..C3, skipping segments).
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) break;
      // skip fill bytes
      while (buf[i] === 0xff && i < buf.length - 1) i++;
      const marker = buf[i];
      i++;
      // standalone markers (no length)
      if (marker === 0xd8 || marker === 0xd9) continue;
      if (i + 2 > buf.length) break;
      const segLen = buf.readUInt16BE(i);
      const isSOF =
        marker === 0xc0 || marker === 0xc1 || marker === 0xc2 || marker === 0xc3 ||
        marker === 0xc5 || marker === 0xc6 || marker === 0xc7 ||
        marker === 0xc9 || marker === 0xca || marker === 0xcb ||
        marker === 0xcd || marker === 0xce || marker === 0xcf;
      if (isSOF) {
        const height = buf.readUInt16BE(i + 3);
        const width = buf.readUInt16BE(i + 5);
        return { width, height, format: 'jpeg' };
      }
      i += segLen;
    }
    throw new Error('JPEG SOF marker not found');
  }

  // PNG: IHDR at offset 8.
  if (
    buf.length >= 24 &&
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47
  ) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), format: 'png' };
  }

  // GIF: width at offset 6, height at offset 8.
  if (buf.length >= 10 && buf.toString('ascii', 0, 3) === 'GIF') {
    return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8), format: 'gif' };
  }

  // WebP (RIFF + WEBP).
  if (
    buf.length >= 30 &&
    buf.toString('ascii', 0, 4) === 'RIFF' &&
    buf.toString('ascii', 8, 12) === 'WEBP'
  ) {
    const chunk = buf.toString('ascii', 12, 16);
    if (chunk === 'VP8X') {
      const width = 1 + buf.readUIntLE(24, 3);
      const height = 1 + buf.readUIntLE(27, 3);
      return { width, height, format: 'webp' };
    }
    if (chunk === 'VP8 ') {
      const width = buf.readUInt16LE(26) & 0x3fff;
      const height = buf.readUInt16LE(28) & 0x3fff;
      return { width, height, format: 'webp' };
    }
    if (chunk === 'VP8L') {
      const b0 = buf[21];
      const b1 = buf[22];
      const b2 = buf[23];
      const b3 = buf[24];
      const width = 1 + (((b1 & 0x3f) << 8) | b0);
      const height = 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
      return { width, height, format: 'webp' };
    }
  }

  // AVIF: scan ispe box for dimensions.
  if (
    buf.length >= 12 &&
    buf.toString('ascii', 4, 8) === 'ftyp' &&
    /avif|avis|heic|heix|mif1|msf1/.test(buf.toString('ascii', 8, 24))
  ) {
    // Naive ispe scan; sufficient for most exports.
    const idx = buf.indexOf(Buffer.from('ispe', 'ascii'));
    if (idx > 0 && idx + 12 <= buf.length) {
      const width = buf.readUInt32BE(idx + 4);
      const height = buf.readUInt32BE(idx + 8);
      if (width > 0 && height > 0) {
        return { width, height, format: 'avif' };
      }
    }
    throw new Error('Could not read AVIF/HEIC dimensions');
  }

  // SVG: read width/height attributes, or viewBox.
  const head = buf.toString('utf8', 0, Math.min(buf.length, 2048));
  if (head.includes('<svg')) {
    const wMatch = /\bwidth=["']([0-9.]+)/.exec(head);
    const hMatch = /\bheight=["']([0-9.]+)/.exec(head);
    const vbMatch = /viewBox=["']\s*[-0-9.]+\s+[-0-9.]+\s+([0-9.]+)\s+([0-9.]+)/.exec(head);
    let width = 0;
    let height = 0;
    if (wMatch && hMatch) {
      width = Math.round(parseFloat(wMatch[1]));
      height = Math.round(parseFloat(hMatch[1]));
    } else if (vbMatch) {
      width = Math.round(parseFloat(vbMatch[1]));
      height = Math.round(parseFloat(vbMatch[2]));
    }
    if (width > 0 && height > 0) {
      return { width, height, format: 'svg' };
    }
    // No declared size: fall back to a safe default; vector scales anyway.
    return { width: 2048, height: 2048, format: 'svg' };
  }

  throw new Error(`Unrecognized image header for ${basename(filePath)}`);
}

function normalizeId(stem) {
  return stem
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-') || 'artwork';
}

function generateTitle(stem) {
  // Strip leading "01-", "001_", etc.
  const cleaned = stem
    .replace(/^[0-9]+[\s_.\-]*/, '')
    .replace(/[_\-.]+/g, ' ')
    .trim();
  const source = cleaned || stem;
  return source
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function generateMedium(width, height) {
  if (!width || !height) return 'Photograph';
  const ratio = width / height;
  const dimsLabel = `${width} × ${height}`;
  if (ratio > 1.1) return `Landscape · ${dimsLabel}`;
  if (ratio < 0.9) return `Portrait · ${dimsLabel}`;
  return `Square · ${dimsLabel}`;
}

function uniqueId(base, taken) {
  let id = base;
  let i = 2;
  while (taken.has(id)) {
    id = `${base}-${i++}`;
  }
  taken.add(id);
  return id;
}

/**
 * v0.18 — Parse a customer-edited sidecar text file.
 *
 * Format:
 *   - UTF-8 (BOM tolerated)
 *   - `Label: value` lines, case-insensitive keys
 *   - Everything after a line starting with `Description:` becomes the
 *     description body (multi-line, blank lines preserved, trailing
 *     blank lines trimmed)
 *
 * Returns `{ fields, fieldWarnings }`. Field-level mistakes (invalid year,
 * unknown surface, unknown keys, blank required values) collect warnings
 * but never throw — the import still succeeds. I/O errors throw so the
 * caller can decide how to surface them.
 */
function parseSidecar(filePath) {
  let raw = readFileSync(filePath, 'utf8');
  // Strip UTF-8 BOM (common from Notepad / TextEdit).
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
  // Normalize Windows / classic Mac line endings to \n.
  raw = raw.replace(/\r\n?/g, '\n');

  const fields = {};
  const fieldWarnings = [];
  const lines = raw.split('\n');

  let inDescription = false;
  const descriptionLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (inDescription) {
      descriptionLines.push(line);
      continue;
    }

    // Skip blank lines outside the description block.
    if (line.trim() === '') continue;

    const colon = line.indexOf(':');
    if (colon < 0) {
      // Free-text line outside any block — treat as a warning so the
      // customer notices a typo, but do not fail the import.
      fieldWarnings.push(
        `unrecognized line "${line.trim().slice(0, 60)}" — expected "Label: value"`,
      );
      continue;
    }

    const rawKey = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    const key = rawKey.toLowerCase();

    if (key === 'description') {
      inDescription = true;
      if (value !== '') descriptionLines.push(value);
      continue;
    }

    if (!SIDECAR_FIELD_KEYS.has(key)) {
      fieldWarnings.push(`unknown field "${rawKey}" — ignored`);
      continue;
    }

    fields[key] = value;
  }

  if (inDescription) {
    // Trim trailing blank lines but preserve internal blank lines.
    while (descriptionLines.length > 0 && descriptionLines[descriptionLines.length - 1].trim() === '') {
      descriptionLines.pop();
    }
    fields.description = descriptionLines.join('\n');
  }

  // Validate Year — must be a four-digit number.
  if (Object.prototype.hasOwnProperty.call(fields, 'year')) {
    const yearText = fields.year;
    if (yearText === '') {
      // Treat blank year the same as omitted; remove so `??` fallback fires.
      delete fields.year;
    } else if (!/^\d{4}$/.test(yearText)) {
      fieldWarnings.push(`Year "${yearText}" is not a four-digit number — falling back to current year`);
      delete fields.year;
    } else {
      fields.year = Number(yearText);
    }
  }

  // Validate Surface — must be one of the allowed profiles.
  if (Object.prototype.hasOwnProperty.call(fields, 'surface')) {
    const surfaceText = fields.surface;
    if (surfaceText === '') {
      delete fields.surface;
    } else if (!ALLOWED_SURFACE_PROFILES.has(surfaceText)) {
      fieldWarnings.push(
        `Surface "${surfaceText}" is not recognized — falling back to matte-canvas (allowed: ${[
          ...ALLOWED_SURFACE_PROFILES,
        ].join(', ')})`,
      );
      delete fields.surface;
    }
  }

  // Tags — split on comma or semicolon, trim, drop empties.
  if (Object.prototype.hasOwnProperty.call(fields, 'tags')) {
    const tagsText = fields.tags;
    if (tagsText === '') {
      delete fields.tags;
    } else {
      fields.tags = tagsText
        .split(/[,;]/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
    }
  }

  // Warn on blank required fields. Use Object.prototype.hasOwnProperty so
  // "missing" (omitted) is distinct from "present but blank".
  if (Object.prototype.hasOwnProperty.call(fields, 'title') && fields.title === '') {
    fieldWarnings.push('Title is empty — add a short painting title');
  }
  if (Object.prototype.hasOwnProperty.call(fields, 'alt') && fields.alt === '') {
    fieldWarnings.push('Alt is empty — add a short visual description');
  }
  if (Object.prototype.hasOwnProperty.call(fields, 'description') && fields.description === '') {
    fieldWarnings.push('Description is empty — add the main info-panel text');
  }

  return { fields, fieldWarnings };
}

function pickAudioByPriority(candidates) {
  if (!Array.isArray(candidates) || candidates.length === 0) return null;
  const sorted = [...candidates].sort((a, b) => {
    const prioA = AUDIO_SELECTION_PRIORITY.indexOf(a.ext);
    const prioB = AUDIO_SELECTION_PRIORITY.indexOf(b.ext);
    if (prioA !== prioB) return prioA - prioB;
    return a.filename.localeCompare(b.filename, 'en', { numeric: true, sensitivity: 'base' });
  });
  return sorted[0] || null;
}

// -------- Main --------

mkdirSync(INBOX, { recursive: true });
mkdirSync(AUDIO_INBOX, { recursive: true });
mkdirSync(PROCESSED, { recursive: true });
mkdirSync(PREVIEW_IMAGES, { recursive: true });
mkdirSync(PREVIEW_AUDIO, { recursive: true });
mkdirSync(dirname(MANIFEST_JSON), { recursive: true });

const inboxEntries = readdirSync(INBOX, { withFileTypes: true })
  .filter((e) => e.isFile() && !e.name.startsWith('.'))
  .map((e) => e.name)
  .sort((a, b) => a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' }));

// v0.18 — Split inbox entries into image candidates and sidecar files.
//   - sidecarMap: lowercase stem → { filename, ext } for the *chosen* sidecar
//     (`.txt` wins over `.md` deterministically).
//   - duplicateSidecarWarnings: collected when both `.txt` and `.md` exist
//     for the same stem.
const imageEntries = [];
const sidecarMap = new Map();
const duplicateSidecarWarnings = [];

{
  // Group all sidecars per stem so the chosen file is deterministic across
  // OSes regardless of `readdirSync` ordering.
  const sidecarsByStem = new Map();
  for (const filename of inboxEntries) {
    const ext = extname(filename).toLowerCase();
    if (SIDECAR_EXTENSIONS.includes(ext)) {
      const stem = basename(filename, ext).toLowerCase();
      if (!sidecarsByStem.has(stem)) sidecarsByStem.set(stem, []);
      sidecarsByStem.get(stem).push({ filename, ext });
    } else {
      imageEntries.push(filename);
    }
  }
  for (const [stem, candidates] of sidecarsByStem) {
    // Prefer .txt over .md.
    candidates.sort((a, b) => SIDECAR_EXTENSIONS.indexOf(a.ext) - SIDECAR_EXTENSIONS.indexOf(b.ext));
    const chosen = candidates[0];
    sidecarMap.set(stem, chosen);
    for (let i = 1; i < candidates.length; i++) {
      duplicateSidecarWarnings.push(
        `${candidates[i].filename} — duplicate sidecar (also found ${chosen.filename}); using ${chosen.filename} (${PRIMARY_SIDECAR_EXT} preferred)`,
      );
    }
  }
}

const artworks = [];
const imported = [];
const warnings = [];
const skipped = [];
const errors = [];
const usedIds = new Set();

// v0.18 — sidecar-aware report state.
const textApplied = [];
const picturesMissingText = [];
const textFieldWarnings = [];
const matchedSidecarStems = new Set();

const audioSelected = [];
const audioIgnored = [];
const audioUnsupported = [];
let audioPayload = { sources: [] };

const audioEntries = readdirSync(AUDIO_INBOX, { withFileTypes: true })
  .filter((e) => e.isFile() && !e.name.startsWith('.'))
  .map((e) => e.name)
  .sort((a, b) => a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' }));

const audioCandidates = [];
for (const filename of audioEntries) {
  const ext = extname(filename).toLowerCase();
  if (!AUDIO_SAFE_EXTENSIONS.has(ext)) {
    audioUnsupported.push(`${filename} — unsupported audio file type "${ext || '(none)'}". Use MP3, OGG, M4A, or WAV.`);
    continue;
  }
  audioCandidates.push({
    filename,
    ext,
    srcPath: join(AUDIO_INBOX, filename),
  });
}

// Clean previously generated images that no longer correspond to inbox files
// (best-effort housekeeping; ignored on failure).
try {
  for (const f of readdirSync(PREVIEW_IMAGES, { withFileTypes: true })) {
    if (f.isFile()) rmSync(join(PREVIEW_IMAGES, f.name));
  }
} catch {
  // ignore
}
try {
  for (const f of readdirSync(PREVIEW_AUDIO, { withFileTypes: true })) {
    if (f.isFile()) rmSync(join(PREVIEW_AUDIO, f.name));
  }
} catch {
  // ignore
}

imageEntries.forEach((filename, i) => {
  const srcPath = join(INBOX, filename);
  const ext = extname(filename).toLowerCase();
  const indexLabel = String(i + 1).padStart(2, '0');

  if (RAW_EXTENSIONS.has(ext)) {
    skipped.push(`${filename} — camera RAW format, cannot display in a browser. Please export as JPG or PNG.`);
    return;
  }
  if (!SAFE_EXTENSIONS.has(ext) && !RISKY_EXTENSIONS.has(ext)) {
    skipped.push(`${filename} — unsupported file type "${ext || '(none)'}". Use JPG, PNG, WebP, GIF, SVG, or AVIF.`);
    return;
  }

  let dims;
  try {
    dims = readImageDimensions(srcPath);
  } catch (err) {
    warnings.push(`${filename} — could not read dimensions (${err.message}). Skipping.`);
    return;
  }
  if (!dims.width || !dims.height) {
    warnings.push(`${filename} — image dimensions are zero. Skipping.`);
    return;
  }

  const stem = basename(filename, ext);
  const stemLower = stem.toLowerCase();
  const baseId = normalizeId(stem) || `artwork-${indexLabel}`;
  const id = uniqueId(baseId, usedIds);
  const generatedTitle = generateTitle(stem) || `Artwork ${indexLabel}`;
  const destFilename = `${id}${ext}`;
  const destPath = join(PREVIEW_IMAGES, destFilename);

  try {
    cpSync(srcPath, destPath);
  } catch (err) {
    errors.push(`${filename} — could not copy to preview folder: ${err.message}`);
    return;
  }

  // v0.09: embed exact image bytes as a base64 data URL so the 3D painting
  // can load the texture reliably from file:// without CORS / taint issues.
  // No crop, no scale, no recompression — the exact original bytes are encoded.
  let webglImage = '';
  try {
    const imgBytes = readFileSync(destPath);
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    webglImage = `data:${mime};base64,${imgBytes.toString('base64')}`;
  } catch (err) {
    warnings.push(`${filename} — could not embed 3D painting source (${err.message}). The 3D painting will try a file path fallback.`);
  }

  if (RISKY_EXTENSIONS.has(ext)) {
    warnings.push(
      `${filename} — format may not display in all browsers. Export as JPG if it does not appear.`
    );
  }

  // v0.21 — GPU texture memory warnings. Three.js uploads textures as
  // RGBA8 with mipmaps; the on-GPU footprint is therefore
  //   bytes ≈ width × height × 4 × (4 / 3)
  // because the mip pyramid adds roughly one third on top of the base
  // level. v0.21 raises the norm from the old 4096px blanket warning to
  // tiered 4K/8K/16K guidance that matches current WebGL MAX_TEXTURE_SIZE
  // values while still flagging mobile memory risk before upload.
  //
  // Online validation:
  //   - https://registry.khronos.org/webgl/specs/latest/1.0/ (texture limits)
  //   - https://web.dev/articles/webgl-texturing-performance
  const ALL_SAFE_DIMENSION = 4096;
  const MODERN_DIMENSION = 8192;
  const HIGH_END_DIMENSION = 16384;
  const HIGH_GPU_MB_THRESHOLD = 85;
  const VERY_HIGH_GPU_MB_THRESHOLD = 341;
  const EXTREME_GPU_MB_THRESHOLD = 1024;
  const gpuMb = (dims.width * dims.height * 4 * 4) / 3 / (1024 * 1024);
  const longestSide = Math.max(dims.width, dims.height);
  const isPowerOfTwo = (value) => value > 0 && (value & (value - 1)) === 0;
  if (!isPowerOfTwo(dims.width) || !isPowerOfTwo(dims.height)) {
    // Internal advisory only: WebGL 2 handles NPOT textures correctly. Keep the
    // calculation close to the import audit without surfacing noisy customer text.
  }
  if (longestSide > HIGH_END_DIMENSION) {
    warnings.push(
      `${filename} — image is ${dims.width}×${dims.height}px. The longest side is above 16384px, which exceeds the usual WebGL texture limit even on high-end hardware. Downscale to 16384px or less before importing.`
    );
  } else if (longestSide > MODERN_DIMENSION) {
    warnings.push(
      `${filename} — image is ${dims.width}×${dims.height}px. This is high-end desktop territory (up to 16K); phones and many tablets may downscale or skip it. Keep this only for workstation-grade previews.`
    );
  } else if (longestSide > ALL_SAFE_DIMENSION) {
    warnings.push(
      `${filename} — image is ${dims.width}×${dims.height}px. 8K-class artwork is supported on modern devices, but older phones may downscale. Export a 4096px copy if maximum compatibility is required.`
    );
  }
  if (gpuMb >= EXTREME_GPU_MB_THRESHOLD) {
    warnings.push(
      `${filename} — extreme GPU memory estimate (${Math.round(gpuMb)} MB with mipmaps). This is suitable only for very high-end desktop GPUs.`
    );
  } else if (gpuMb >= VERY_HIGH_GPU_MB_THRESHOLD) {
    warnings.push(
      `${filename} — at ${dims.width}×${dims.height}px this image needs about ${Math.round(gpuMb)} MB of GPU memory. Mobile devices may run out of memory and skip the texture.`
    );
  } else if (gpuMb >= HIGH_GPU_MB_THRESHOLD) {
    warnings.push(
      `${filename} — large image (${dims.width}×${dims.height}px, about ${Math.round(gpuMb)} MB on GPU). Performance may be reduced on low-end phones.`
    );
  }

  // v0.18 — Look up a sidecar by lowercased stem and merge customer fields.
  let sidecarFields = null;
  const sidecarEntry = sidecarMap.get(stemLower);
  if (sidecarEntry) {
    matchedSidecarStems.add(stemLower);
    const sidecarPath = join(INBOX, sidecarEntry.filename);
    try {
      const parsed = parseSidecar(sidecarPath);
      sidecarFields = parsed.fields;
      textApplied.push(`${sidecarEntry.filename} matched ${filename}`);
      for (const w of parsed.fieldWarnings) {
        textFieldWarnings.push(`${sidecarEntry.filename} — ${w}`);
      }
    } catch (err) {
      warnings.push(
        `${sidecarEntry.filename} — could not read text card (${err.message}). Importing ${filename} with fallback text.`,
      );
    }
  } else {
    picturesMissingText.push(
      `${filename} — add ${stem}${PRIMARY_SIDECAR_EXT} next to the image`,
    );
  }

  const title = (sidecarFields?.title) || generatedTitle;
  const subtitle = (sidecarFields?.subtitle) || `Artwork ${indexLabel}`;
  const description = (sidecarFields?.description) || 'Imported artwork';
  const year = sidecarFields?.year ?? new Date().getFullYear();
  const credit = (sidecarFields?.credit) || 'Customer';
  const alt = (sidecarFields?.alt) || title;
  const tags = Array.isArray(sidecarFields?.tags) ? sidecarFields.tags : [];
  const surfaceProfile = (sidecarFields?.surface) || 'matte-canvas';
  const medium = (sidecarFields?.medium) || generateMedium(dims.width, dims.height);

  artworks.push({
    id,
    title,
    subtitle,
    description,
    year,
    medium,
    image: `./images/${destFilename}`,
    ...(webglImage ? { webglImage } : {}),
    dimensions: { width: dims.width, height: dims.height },
    alt,
    credit,
    tags,
    surfaceProfile,
  });

  imported.push(`${filename} (${dims.width} × ${dims.height})`);
});

const selectedAudio = pickAudioByPriority(audioCandidates);
const copiedAudio = [];
for (const candidate of audioCandidates) {
  const destFilename = `${normalizeId(basename(candidate.filename, candidate.ext))}${candidate.ext}`;
  const destPath = join(PREVIEW_AUDIO, destFilename);
  try {
    cpSync(candidate.srcPath, destPath);
  } catch (err) {
    warnings.push(`${candidate.filename} — could not copy audio to preview folder: ${err.message}`);
    continue;
  }
  const source = {
    src: `./audio/${destFilename}`,
    ext: candidate.ext,
    mime: AUDIO_MIME_TYPES[candidate.ext] || 'application/octet-stream',
    filename: candidate.filename,
  };
  copiedAudio.push(source);
  if (selectedAudio && selectedAudio.filename === candidate.filename) {
    audioSelected.push(`${candidate.filename} (${candidate.ext.slice(1).toUpperCase()})`);
  } else {
    audioIgnored.push(`${candidate.filename} — copied as fallback source`);
  }
}

audioPayload = {
  sources: copiedAudio,
  ...(selectedAudio
    ? {
        selectedByImporter: copiedAudio.find((source) => source.filename === selectedAudio.filename),
      }
    : {}),
};

// Back up previous manifest (best-effort), then write new one.
try {
  if (existsSync(MANIFEST_JSON)) {
    renameSync(MANIFEST_JSON, MANIFEST_BACKUP);
  }
} catch {
  // ignore
}

writeFileSync(MANIFEST_JSON, JSON.stringify(artworks, null, 2) + '\n', 'utf8');

const js =
  '// Auto-generated by scripts/import-artworks.mjs — do not edit manually.\n' +
  '// Last run: ' + new Date().toISOString() + '\n' +
  'window.__FREYRAUM_ARTWORKS = ' + JSON.stringify(artworks, null, 2) + ';\n';
writeFileSync(PREVIEW_JS, js, 'utf8');

const audioJs =
  '// Auto-generated by scripts/import-artworks.mjs — do not edit manually.\n' +
  '// Last run: ' + new Date().toISOString() + '\n' +
  'window.__FREYRAUM_AUDIO = ' + JSON.stringify(audioPayload, null, 2) + ';\n';
writeFileSync(PREVIEW_AUDIO_JS, audioJs, 'utf8');

// v0.20 — Cache-bust the dynamic script tags in app.html on every import run.
//
// When the customer opens app.html as a file:// URL, Chromium-family browsers
// cache script resources keyed by their full URL. Re-importing (which rewrites
// customer-artworks.js and customer-audio.js on disk) does NOT change the URL,
// so the browser can serve stale content from its disk/memory cache. Adding
// a `?t=<timestamp>` query string makes each import produce a distinct URL
// that forces a fresh read — with zero risk of misloading because browsers
// always ignore the query string when resolving file:// paths to disk.
//
// customer-artworks.js and customer-audio.js are stamped because their content
// changes on every import. freyraum-gallery.js is left unversioned because it
// changes only on developer-issued gallery updates, not customer data imports.
try {
  if (existsSync(PREVIEW_HTML)) {
    const ts = Date.now();
    const originalHtml = readFileSync(PREVIEW_HTML, 'utf8');
    const updatedHtml = originalHtml
      // Match only inside src="..." attributes to avoid touching comments or other text.
      .replace(/(src=["'][^"']*?)customer-artworks\.js(\?t=\d+)?/g, `$1customer-artworks.js?t=${ts}`)
      .replace(/(src=["'][^"']*?)customer-audio\.js(\?t=\d+)?/g, `$1customer-audio.js?t=${ts}`);
    if (updatedHtml !== originalHtml) {
      writeFileSync(PREVIEW_HTML, updatedHtml, 'utf8');
    }
  }
} catch {
  // Best-effort: cache-busting failure does not block the import.
}

// v0.18 — Compute orphaned sidecars (text files without matching pictures).
// `imageStems` mirrors the lowercased basenames the image loop processed.
const imageStems = new Set();
for (const filename of imageEntries) {
  const ext = extname(filename).toLowerCase();
  imageStems.add(basename(filename, ext).toLowerCase());
}
const orphanedSidecars = [];
for (const [stem, entry] of sidecarMap) {
  if (!imageStems.has(stem)) {
    orphanedSidecars.push(`${entry.filename} — no image named ${stem}.* was found`);
  }
}

// -------- Plain-language report --------

const lines = [];
lines.push(`FREYRAUM — Gallery update finished at ${new Date().toLocaleString()}`);
lines.push('');
if (imported.length > 0) {
  lines.push(`Imported (${imported.length}):`);
  imported.forEach((f) => lines.push(`  ✓ ${f}`));
  lines.push('');
  lines.push('  3D painting source: images embedded as data URLs for reliable offline WebGL.');
}

// v0.18 — Text-card sections. Missing/orphaned text and field problems are
// warnings, not errors: the import still succeeds.
if (textApplied.length > 0) {
  if (lines[lines.length - 1] !== '') lines.push('');
  lines.push(`Text applied (${textApplied.length}):`);
  textApplied.forEach((t) => lines.push(`  ✓ ${t}`));
}
if (picturesMissingText.length > 0) {
  if (lines[lines.length - 1] !== '') lines.push('');
  lines.push(`Pictures missing text (${picturesMissingText.length}):`);
  picturesMissingText.forEach((t) => lines.push(`  ⚠ ${t}`));
}
if (orphanedSidecars.length > 0) {
  if (lines[lines.length - 1] !== '') lines.push('');
  lines.push(`Text files without matching pictures (${orphanedSidecars.length}):`);
  orphanedSidecars.forEach((t) => lines.push(`  ⚠ ${t}`));
}
if (textFieldWarnings.length > 0) {
  if (lines[lines.length - 1] !== '') lines.push('');
  lines.push(`Text fields needing attention (${textFieldWarnings.length}):`);
  textFieldWarnings.forEach((t) => lines.push(`  ⚠ ${t}`));
}
if (duplicateSidecarWarnings.length > 0) {
  if (lines[lines.length - 1] !== '') lines.push('');
  lines.push(`Duplicate text files (${duplicateSidecarWarnings.length}):`);
  duplicateSidecarWarnings.forEach((t) => lines.push(`  ⚠ ${t}`));
}

if (audioSelected.length > 0) {
  if (lines[lines.length - 1] !== '') lines.push('');
  lines.push(`Audio selected (${audioSelected.length}):`);
  audioSelected.forEach((entry) => lines.push(`  ✓ ${entry}`));
} else {
  if (lines[lines.length - 1] !== '') lines.push('');
  lines.push('Audio selected (0):');
  lines.push('  ⚠ No supported background audio files found in customer-audio/inbox.');
}
if (audioIgnored.length > 0) {
  if (lines[lines.length - 1] !== '') lines.push('');
  lines.push(`Audio candidates ignored by precedence (${audioIgnored.length}):`);
  audioIgnored.forEach((entry) => lines.push(`  ⚠ ${entry}`));
}
if (audioUnsupported.length > 0) {
  if (lines[lines.length - 1] !== '') lines.push('');
  lines.push(`Unsupported audio files (${audioUnsupported.length}):`);
  audioUnsupported.forEach((entry) => lines.push(`  ⚠ ${entry}`));
}

if (warnings.length > 0) {
  if (lines[lines.length - 1] !== '') lines.push('');
  lines.push(`Needs attention (${warnings.length}):`);
  warnings.forEach((w) => lines.push(`  ⚠ ${w}`));
}
if (skipped.length > 0) {
  if (lines[lines.length - 1] !== '') lines.push('');
  lines.push(`Skipped (${skipped.length}):`);
  skipped.forEach((s) => lines.push(`  ✗ ${s}`));
}
if (errors.length > 0) {
  if (lines[lines.length - 1] !== '') lines.push('');
  lines.push(`Errors (${errors.length}):`);
  errors.forEach((e) => lines.push(`  ! ${e}`));
}
if (
  imported.length === 0 &&
  warnings.length === 0 &&
  skipped.length === 0 &&
  errors.length === 0 &&
  orphanedSidecars.length === 0
) {
  lines.push('No image files were found in:');
  lines.push(`  ${INBOX}`);
  lines.push('');
  lines.push('Drop your pictures into the "inbox" folder and run Update Gallery again.');
} else if (imported.length > 0) {
  lines.push('');
  lines.push('Open index.html (in the FREYRAUM folder) to view the updated gallery.');
}

const report = lines.join('\n') + '\n';
writeFileSync(REPORT_FILE, report, 'utf8');
process.stdout.write(report);

// Exit code: only fail hard if there were copy/IO errors. Warnings and
// skipped files do not fail the run because partial imports are still
// useful for the customer.
process.exit(errors.length > 0 ? 1 : 0);
