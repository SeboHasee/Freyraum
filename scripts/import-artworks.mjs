#!/usr/bin/env node
/**
 * FREYRAUM — Customer artwork importer (v0.07)
 *
 * Scans `customer-artworks/inbox/` for image files, validates them, reads
 * their pixel dimensions (zero-dependency header parsing), and emits:
 *   - `customer-artworks/artworks.json` (human-readable manifest, backed up)
 *   - `customer-preview/customer-artworks.js` (runtime injection for the app)
 *   - `customer-preview/images/<id>.<ext>` (copied image assets)
 *   - `customer-artworks/last-import-report.txt` (plain-language report)
 *
 * The importer is intentionally robust against partial failure: one bad
 * file does not stop the whole run. It also keeps a backup of the previous
 * manifest so a failed run can be restored manually.
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
const PROCESSED = join(ROOT, 'customer-artworks', 'processed');
const MANIFEST_JSON = join(ROOT, 'customer-artworks', 'artworks.json');
const MANIFEST_BACKUP = join(ROOT, 'customer-artworks', 'artworks.json.bak');
const PREVIEW_IMAGES = join(ROOT, 'customer-preview', 'images');
const PREVIEW_JS = join(ROOT, 'customer-preview', 'customer-artworks.js');
const REPORT_FILE = join(ROOT, 'customer-artworks', 'last-import-report.txt');

// -------- Format policy --------
const SAFE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif']);
const RISKY_EXTENSIONS = new Set(['.heic', '.heif', '.tif', '.tiff', '.bmp']);
const RAW_EXTENSIONS = new Set([
  '.cr2', '.cr3', '.nef', '.arw', '.dng', '.orf', '.rw2', '.raw', '.pef', '.srw',
]);

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

// -------- Main --------

mkdirSync(INBOX, { recursive: true });
mkdirSync(PROCESSED, { recursive: true });
mkdirSync(PREVIEW_IMAGES, { recursive: true });
mkdirSync(dirname(MANIFEST_JSON), { recursive: true });

const inboxEntries = readdirSync(INBOX, { withFileTypes: true })
  .filter((e) => e.isFile() && !e.name.startsWith('.'))
  .map((e) => e.name)
  .sort((a, b) => a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' }));

const artworks = [];
const imported = [];
const warnings = [];
const skipped = [];
const errors = [];
const usedIds = new Set();

// Clean previously generated images that no longer correspond to inbox files
// (best-effort housekeeping; ignored on failure).
try {
  for (const f of readdirSync(PREVIEW_IMAGES, { withFileTypes: true })) {
    if (f.isFile()) rmSync(join(PREVIEW_IMAGES, f.name));
  }
} catch {
  // ignore
}

inboxEntries.forEach((filename, i) => {
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
  const baseId = normalizeId(stem) || `artwork-${indexLabel}`;
  const id = uniqueId(baseId, usedIds);
  const title = generateTitle(stem) || `Artwork ${indexLabel}`;
  const destFilename = `${id}${ext}`;
  const destPath = join(PREVIEW_IMAGES, destFilename);

  try {
    cpSync(srcPath, destPath);
  } catch (err) {
    errors.push(`${filename} — could not copy to preview folder: ${err.message}`);
    return;
  }

  if (RISKY_EXTENSIONS.has(ext)) {
    warnings.push(
      `${filename} — format may not display in all browsers. Export as JPG if it does not appear.`
    );
  }

  artworks.push({
    id,
    title,
    subtitle: `Artwork ${indexLabel}`,
    description: 'Imported artwork',
    year: new Date().getFullYear(),
    medium: generateMedium(dims.width, dims.height),
    image: `./images/${destFilename}`,
    dimensions: { width: dims.width, height: dims.height },
    alt: title,
    credit: 'Customer',
    tags: [],
    surfaceProfile: 'matte-canvas',
  });

  imported.push(`${filename} (${dims.width} × ${dims.height})`);
});

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

// -------- Plain-language report --------

const lines = [];
lines.push(`FREYRAUM — Gallery update finished at ${new Date().toLocaleString()}`);
lines.push('');
if (imported.length > 0) {
  lines.push(`Imported (${imported.length}):`);
  imported.forEach((f) => lines.push(`  ✓ ${f}`));
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
if (imported.length === 0 && warnings.length === 0 && skipped.length === 0 && errors.length === 0) {
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
