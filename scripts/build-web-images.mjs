#!/usr/bin/env node
/**
 * FREYRAUM — v1.46 web image derivatives for the deployed site.
 *
 * Called by `scripts/sync-customer-public.mjs` (npm/CI builds only). The
 * customer's "Update Gallery" keeps working with plain Node: it never runs
 * this step and the local preview keeps the original files.
 *
 * For every imported artwork it writes WebP versions whose long edge is 640,
 * 1280, 2048 and min(source, 4096) px into `public/web-images/`, and appends
 * `window.__FREYRAUM_WEB_IMAGES = { <id>: [{ src, width, height }, …] }` and
 * `window.__FREYRAUM_WEB_BACKGROUNDS = { "Backgrounds/<file>": "./web-images/…" }`
 * (full-size copies of the hub/photo-room photos) to `public/customer-artworks.js`. The runtime picks one size per device
 * (`src/utils/artworkImageSources.ts`); without the map it uses the originals.
 *
 * Encoded files are cached in `node_modules/.cache/freyraum-web-images/`,
 * keyed by source bytes, size and encoder settings.
 */
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';

export const WEB_IMAGE_LONG_EDGES = [640, 1280, 2048, 4096];
export const WEB_IMAGE_DIR = 'web-images';
export const WEB_IMAGE_QUALITY = 82;
const ENCODER_KEY = `webp-q${WEB_IMAGE_QUALITY}-e4-v1`;

/** Long edges to generate for a source: the fixed steps below it plus min(source, 4096). */
export function webImageLongEdges(sourceLongEdge) {
  const cap = Math.min(sourceLongEdge, WEB_IMAGE_LONG_EDGES[WEB_IMAGE_LONG_EDGES.length - 1]);
  const edges = WEB_IMAGE_LONG_EDGES.filter((edge) => edge < cap);
  edges.push(cap);
  return edges;
}

function safeId(id) {
  return String(id).replace(/[^A-Za-z0-9_-]/g, '-');
}

/**
 * @returns {Promise<{ written: number, cached: number, artworks: number } | { skipped: string }>}
 */
export async function buildWebImages({ root, log = () => {} }) {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    return { skipped: 'sharp is not installed (run `npm ci`); the deployed site uses the original images.' };
  }
  const manifestPath = join(root, 'customer-artworks', 'artworks.json');
  if (!existsSync(manifestPath)) return { skipped: 'customer-artworks/artworks.json is missing.' };
  const artworks = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const publicDir = join(root, 'public');
  const outDir = join(publicDir, WEB_IMAGE_DIR);
  const cacheDir = join(root, 'node_modules', '.cache', 'freyraum-web-images');
  mkdirSync(cacheDir, { recursive: true });
  if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const map = {};
  let written = 0;
  let cached = 0;
  for (const artwork of Array.isArray(artworks) ? artworks : []) {
    if (!artwork || typeof artwork.id !== 'string' || typeof artwork.image !== 'string') continue;
    const file = decodeURIComponent(artwork.image.replace(/[?#].*$/, '').replace(/^\.\/images\//, ''));
    const sourcePath = join(publicDir, 'images', file);
    if (!existsSync(sourcePath)) continue;
    const bytes = readFileSync(sourcePath);
    const meta = await sharp(bytes).metadata();
    const orientedSwap = (meta.orientation ?? 1) >= 5;
    const width = orientedSwap ? meta.height : meta.width;
    const height = orientedSwap ? meta.width : meta.height;
    if (!width || !height) continue;
    const hash = createHash('sha1').update(bytes).update(ENCODER_KEY).digest('hex').slice(0, 10);
    const variants = [];
    for (const edge of webImageLongEdges(Math.max(width, height))) {
      const scale = edge / Math.max(width, height);
      const outWidth = Math.max(1, Math.round(width * scale));
      const outHeight = Math.max(1, Math.round(height * scale));
      const name = `${safeId(artwork.id)}-${edge}-${hash}.webp`;
      const cachePath = join(cacheDir, name);
      if (existsSync(cachePath)) {
        cached += 1;
      } else {
        await sharp(bytes)
          .rotate()
          .resize({ width: outWidth, height: outHeight, fit: 'fill' })
          .webp({ quality: WEB_IMAGE_QUALITY, effort: 4, smartSubsample: true })
          .toFile(cachePath);
        written += 1;
      }
      copyFileSync(cachePath, join(outDir, name));
      variants.push({ src: `./${WEB_IMAGE_DIR}/${name}`, width: outWidth, height: outHeight });
    }
    map[artwork.id] = variants;
    log(`web images: ${artwork.id} → ${variants.map((v) => Math.max(v.width, v.height)).join(', ')} px`);
  }

  // v1.46 (B4): full-size WebP copies of the configured background photos
  // (hub + photo rooms). Same pixel size, so calibration is unchanged; the
  // editor keeps loading the originals.
  const backgrounds = {};
  const hubPath = join(root, 'customer-artworks', 'museum-hub.json');
  if (existsSync(hubPath)) {
    let hub = null;
    try {
      hub = JSON.parse(readFileSync(hubPath, 'utf8'));
    } catch {
      hub = null;
    }
    const sources = new Set();
    if (typeof hub?.background?.src === 'string') sources.add(hub.background.src);
    for (const view of Array.isArray(hub?.galleryRoomViews) ? hub.galleryRoomViews : []) {
      if (typeof view?.background?.src === 'string') sources.add(view.background.src);
    }
    for (const src of sources) {
      if (!/^Backgrounds\/[^/]+$/.test(src)) continue;
      const sourcePath = join(publicDir, 'backgrounds', src.slice('Backgrounds/'.length));
      if (!existsSync(sourcePath)) continue;
      const bytes = readFileSync(sourcePath);
      const meta = await sharp(bytes).metadata();
      if (!meta.width || !meta.height) continue;
      const hash = createHash('sha1').update(bytes).update(ENCODER_KEY).digest('hex').slice(0, 10);
      const base = safeId(src.slice('Backgrounds/'.length).replace(/\.[^.]+$/, ''));
      const name = `bg-${base}-${Math.max(meta.width, meta.height)}-${hash}.webp`;
      const cachePath = join(cacheDir, name);
      if (existsSync(cachePath)) {
        cached += 1;
      } else {
        await sharp(bytes).webp({ quality: WEB_IMAGE_QUALITY, effort: 4, smartSubsample: true }).toFile(cachePath);
        written += 1;
      }
      copyFileSync(cachePath, join(outDir, name));
      backgrounds[src] = `./${WEB_IMAGE_DIR}/${name}`;
    }
  }

  // Drop cache entries that no current source/size uses.
  const used = new Set(readdirSync(outDir));
  for (const name of readdirSync(cacheDir)) {
    if (!used.has(name)) rmSync(join(cacheDir, name), { force: true });
  }

  appendFileSync(
    join(publicDir, 'customer-artworks.js'),
    `window.__FREYRAUM_WEB_IMAGES = ${JSON.stringify(map)};\n` +
      `window.__FREYRAUM_WEB_BACKGROUNDS = ${JSON.stringify(backgrounds)};\n`,
    'utf8'
  );
  return { written, cached, artworks: Object.keys(map).length, backgrounds: Object.keys(backgrounds).length };
}
