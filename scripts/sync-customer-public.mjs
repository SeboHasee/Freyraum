#!/usr/bin/env node
/**
 * FREYRAUM — Sync customer importer output to Vite's public directory.
 *
 * After `scripts/import-artworks.mjs` writes customer data to `customer-preview/`,
 * this script copies the generated assets to `public/` so that Vite picks them up
 * during `npm run build` and includes them in the `dist/` output for GitHub Pages.
 *
 * Files copied:
 *   customer-preview/customer-artworks.js  → public/customer-artworks.js
 *   customer-preview/customer-audio.js     → public/customer-audio.js
 *   customer-preview/images/               → public/images/  (entire folder)
 *   customer-preview/audio/                → public/audio/   (entire folder, if present)
 *   customer-artworks/Backgrounds/          → public/backgrounds/ (museum-target.png excluded — reference asset only)
 *
 * The `public/` versions are gitignored (CI regenerates them from the committed
 * inbox sources). Customer artwork source files live in:
 *   customer-artworks/inbox/   — images and sidecar .txt files
 *   customer-audio/inbox/      — audio files
 *
 * No npm dependencies required. Node 18+.
 */

import { existsSync, mkdirSync, copyFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = join(dirname(__filename), '..');
const PREVIEW = join(ROOT, 'customer-preview');
const PUBLIC = join(ROOT, 'public');

/**
 * Copies all files (non-recursive) from srcDir to destDir.
 * Clears destDir first so stale files from a previous run are removed.
 * An optional filter decides which source files are shipped.
 */
function syncDir(srcDir, destDir, filter) {
  if (!existsSync(srcDir)) return;

  // Remove stale files from a previous run.
  if (existsSync(destDir)) {
    for (const entry of readdirSync(destDir, { withFileTypes: true })) {
      if (entry.isFile()) {
        rmSync(join(destDir, entry.name));
      }
    }
  } else {
    mkdirSync(destDir, { recursive: true });
  }

  let copied = 0;
  for (const entry of readdirSync(srcDir, { withFileTypes: true })) {
    if (entry.isFile() && (!filter || filter(entry.name))) {
      copyFileSync(join(srcDir, entry.name), join(destDir, entry.name));
      copied++;
    }
  }
  return copied;
}

/**
 * Copies a single file. Creates the destination directory if needed.
 */
function syncFile(src, dest) {
  if (!existsSync(src)) return false;
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
  return true;
}

// ── Sync JS injection files ──────────────────────────────────────────────────

const artworksJs = syncFile(
  join(PREVIEW, 'customer-artworks.js'),
  join(PUBLIC, 'customer-artworks.js'),
);
const audioJs = syncFile(
  join(PREVIEW, 'customer-audio.js'),
  join(PUBLIC, 'customer-audio.js'),
);

if (!artworksJs) {
  process.stderr.write(
    'sync-customer-public: customer-preview/customer-artworks.js not found. ' +
    'Run scripts/import-artworks.mjs first.\n',
  );
  process.exit(1);
}

if (!audioJs) {
  // Write a stub so the build does not 404 when no audio has been imported.
  writeFileSync(
    join(PUBLIC, 'customer-audio.js'),
    '// Stub: no audio imported.\nwindow.__FREYRAUM_AUDIO = { sources: [] };\n',
  );
}

// ── Sync image, audio, and hub-background asset folders ─────────────────────

const imagesCopied = syncDir(join(PREVIEW, 'images'), join(PUBLIC, 'images'));
const audioCopied  = syncDir(join(PREVIEW, 'audio'),  join(PUBLIC, 'audio'));
// v0.81 — museum-target.png stays in the repo as a calibration/reference
// asset only; the runtime hub composes artworks over museum-empty.png, so the
// baked-target PNG (~5.5 MB) is no longer shipped to public/ or dist/.
const backgroundsCopied = syncDir(
  join(ROOT, 'customer-artworks', 'Backgrounds'),
  join(PUBLIC, 'backgrounds'),
  (name) => name !== 'museum-target.png',
);

if (backgroundsCopied === undefined) {
  process.stderr.write(
    'sync-customer-public: customer-artworks/Backgrounds is missing. ' +
      'Add the committed museum-empty.png fallback before building.\n',
  );
  process.exit(1);
}

if (!existsSync(join(PUBLIC, 'backgrounds', 'museum-empty.png'))) {
  process.stderr.write(
    'sync-customer-public: required backgrounds/museum-empty.png is missing.\n',
  );
  process.exit(1);
}

process.stdout.write(
  `sync-customer-public: synced customer-artworks.js, customer-audio.js` +
  (imagesCopied  !== undefined ? `, ${imagesCopied} image(s)`  : '') +
  (audioCopied   !== undefined ? `, ${audioCopied} audio file(s)` : '') +
  (backgroundsCopied !== undefined ? `, ${backgroundsCopied} hub background(s)` : '') +
  ' to public/\n',
);
