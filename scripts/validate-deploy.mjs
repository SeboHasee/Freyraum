#!/usr/bin/env node
/**
 * FREYRAUM — v1.38 deploy safety check (`npm run validate:deploy`).
 *
 * Runs in the GitHub Pages workflow after `npm run import:artworks` and before
 * `npm run build`. A broken online publish (unknown artwork ID, missing image,
 * wrong upper/lower case, path outside the project, oversized file) fails the
 * deploy, so the live gallery stays on the last good version.
 *
 * Usage:
 *   node scripts/validate-deploy.mjs [--root <dir>] [--strict]
 *
 * --strict turns warnings (e.g. a missing primary background that falls back
 * to backgroundFallback) into errors.
 *
 * Exit code 0 = deployable, 1 = errors found.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const MAX_INBOX_IMAGE_BYTES = 50 * 1024 * 1024;
export const WARN_INBOX_IMAGE_BYTES = 20 * 1024 * 1024;
export const MAX_BACKGROUND_BYTES = 25 * 1024 * 1024;
export const MAX_SIDECAR_BYTES = 64 * 1024;
// v1.46 — the deployed manifest is a blocking script: metadata only, no image bytes.
export const MAX_DEPLOY_MANIFEST_BYTES = 2 * 1024 * 1024;

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg|avif)$/i;

function listFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && !entry.name.startsWith('.'))
    .map((entry) => entry.name);
}

/** Relative project path check: no absolute paths, schemes, backslashes, or `..`. */
export function isSafeRelativePath(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  if (value.includes('\\') || value.includes('\0')) return false;
  if (value.startsWith('/') || /^[a-z][a-z0-9+.-]*:/i.test(value)) return false;
  return !value.split('/').some((part) => part === '..' || part === '');
}

/** Checks a background path against the Backgrounds folder with exact case. */
function checkBackground(label, src, backgroundFiles, issues, { missingIsWarning }) {
  if (!isSafeRelativePath(src) || !/^Backgrounds\/[^/]+$/.test(src)) {
    issues.errors.push(`${label}: "${src}" must be "Backgrounds/<file>" inside the project.`);
    return false;
  }
  const name = src.slice('Backgrounds/'.length);
  if (backgroundFiles.includes(name)) return true;
  const caseMatch = backgroundFiles.find((file) => file.toLowerCase() === name.toLowerCase());
  if (caseMatch) {
    issues.errors.push(
      `${label}: "${src}" differs only in upper/lower case from "Backgrounds/${caseMatch}". GitHub Pages is case-sensitive.`
    );
    return false;
  }
  const message = `${label}: customer-artworks/${src} does not exist.`;
  if (missingIsWarning) issues.warnings.push(`${message} The gallery uses backgroundFallback instead.`);
  else issues.errors.push(message);
  return false;
}

export function validateDeploy(root) {
  const issues = { errors: [], warnings: [], checked: { artworks: 0, slots: 0, backgrounds: 0 } };
  const customer = join(root, 'customer-artworks');
  const hubPath = join(customer, 'museum-hub.json');
  const manifestPath = join(customer, 'artworks.json');
  const inboxDir = join(customer, 'inbox');
  const backgroundsDir = join(customer, 'Backgrounds');
  const previewImagesDir = join(root, 'customer-preview', 'images');

  // ── Inbox sources ────────────────────────────────────────────────────────
  const inboxFiles = listFiles(inboxDir);
  const lowerSeen = new Map();
  for (const name of inboxFiles) {
    const lower = name.toLowerCase();
    if (lowerSeen.has(lower)) {
      issues.errors.push(`inbox: "${name}" and "${lowerSeen.get(lower)}" differ only in upper/lower case.`);
    }
    lowerSeen.set(lower, name);
    const size = statSync(join(inboxDir, name)).size;
    if (IMAGE_EXT.test(name)) {
      if (size > MAX_INBOX_IMAGE_BYTES) {
        issues.errors.push(`inbox: ${name} is ${(size / 1048576).toFixed(1)} MB (max ${MAX_INBOX_IMAGE_BYTES / 1048576} MB).`);
      } else if (size > WARN_INBOX_IMAGE_BYTES) {
        issues.warnings.push(`inbox: ${name} is ${(size / 1048576).toFixed(1)} MB; consider a smaller export for faster loading.`);
      }
    } else if (/\.(txt|md)$/i.test(name) && size > MAX_SIDECAR_BYTES) {
      issues.errors.push(`inbox: ${name} is larger than ${MAX_SIDECAR_BYTES / 1024} KB.`);
    }
  }

  // ── Backgrounds ─────────────────────────────────────────────────────────
  const backgroundFiles = listFiles(backgroundsDir);
  for (const name of backgroundFiles) {
    const size = statSync(join(backgroundsDir, name)).size;
    if (size > MAX_BACKGROUND_BYTES) {
      issues.errors.push(`Backgrounds: ${name} is ${(size / 1048576).toFixed(1)} MB (max ${MAX_BACKGROUND_BYTES / 1048576} MB).`);
    }
  }

  // ── Generated manifest ──────────────────────────────────────────────────
  let manifest = null;
  if (!existsSync(manifestPath)) {
    issues.errors.push('customer-artworks/artworks.json is missing. Run `npm run import:artworks` first.');
  } else {
    try {
      manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
      if (!Array.isArray(manifest)) throw new Error('expected an array');
    } catch (error) {
      issues.errors.push(`customer-artworks/artworks.json cannot be read (${error.message}).`);
      manifest = null;
    }
  }
  const knownIds = new Set();
  if (manifest) {
    const previewImages = listFiles(previewImagesDir);
    for (const entry of manifest) {
      if (!entry || typeof entry.id !== 'string') continue;
      knownIds.add(entry.id);
      issues.checked.artworks += 1;
      const image = typeof entry.image === 'string' ? entry.image.replace(/[?#].*$/, '') : '';
      const relative = image.replace(/^\.\//, '');
      if (!isSafeRelativePath(relative) || !relative.startsWith('images/')) {
        issues.errors.push(`artwork ${entry.id}: image path "${entry.image}" is not inside images/.`);
        continue;
      }
      const file = decodeURIComponent(relative.slice('images/'.length));
      if (!previewImages.includes(file)) {
        const caseMatch = previewImages.find((name) => name.toLowerCase() === file.toLowerCase());
        issues.errors.push(
          caseMatch
            ? `artwork ${entry.id}: image "${file}" differs in upper/lower case from "${caseMatch}".`
            : `artwork ${entry.id}: image "${file}" is missing from customer-preview/images.`
        );
      }
    }
  }

  // ── Deployed manifest (public/customer-artworks.js, v1.46) ─────────────
  const deployManifestPath = join(root, 'public', 'customer-artworks.js');
  if (!existsSync(deployManifestPath)) {
    issues.warnings.push('public/customer-artworks.js is missing. Run `npm run import:artworks` before building.');
  } else {
    const size = statSync(deployManifestPath).size;
    if (size > MAX_DEPLOY_MANIFEST_BYTES) {
      issues.errors.push(
        `public/customer-artworks.js is ${(size / 1048576).toFixed(1)} MB (max ${MAX_DEPLOY_MANIFEST_BYTES / 1048576} MB). ` +
          'Every visitor downloads it before the gallery starts.'
      );
    }
    if (/"webglImage"\s*:|data:image\//.test(readFileSync(deployManifestPath, 'utf8'))) {
      issues.errors.push(
        'public/customer-artworks.js embeds image bytes. The deployed site loads images from images/; ' +
          'embedded copies belong only in the local preview (customer-preview/customer-artworks.js).'
      );
    }
    // v1.46 (B2): every listed WebP variant must exist; without the map the
    // site falls back to the originals (warning only).
    const webImagesMatch = /window\.__FREYRAUM_WEB_IMAGES = (\{.*\});\s*$/m.exec(readFileSync(deployManifestPath, 'utf8'));
    if (!webImagesMatch) {
      issues.warnings.push(
        'public/customer-artworks.js has no web image variants; visitors download the full original images. ' +
          'Run `npm ci` (installs sharp) and `npm run import:artworks`.'
      );
    } else {
      let webImages = null;
      try {
        webImages = JSON.parse(webImagesMatch[1]);
      } catch {
        issues.errors.push('public/customer-artworks.js: the web image map is not valid JSON.');
      }
      for (const [id, variants] of Object.entries(webImages ?? {})) {
        for (const variant of Array.isArray(variants) ? variants : []) {
          const src = typeof variant?.src === 'string' ? variant.src : '';
          if (!/^\.\/web-images\/[A-Za-z0-9_-]+-\d+-[0-9a-f]+\.webp$/.test(src)) {
            issues.errors.push(`web images: "${id}" lists an invalid path "${src}".`);
          } else if (!existsSync(join(root, 'public', src.slice(2)))) {
            issues.errors.push(`web images: public/${src.slice(2)} for "${id}" is missing. Re-run \`npm run import:artworks\`.`);
          }
        }
      }
    }
  }

  // ── museum-hub.json ─────────────────────────────────────────────────────
  if (!existsSync(hubPath)) {
    issues.warnings.push('customer-artworks/museum-hub.json is missing; the built-in default layout is used.');
    return issues;
  }
  let hub;
  try {
    hub = JSON.parse(readFileSync(hubPath, 'utf8'));
  } catch (error) {
    issues.errors.push(`customer-artworks/museum-hub.json is not valid JSON (${error.message}).`);
    return issues;
  }
  if (!hub || typeof hub !== 'object' || Array.isArray(hub)) {
    issues.errors.push('customer-artworks/museum-hub.json must be a JSON object.');
    return issues;
  }
  const fallbackSrc = hub.backgroundFallback?.src;
  const fallbackOk = typeof fallbackSrc === 'string'
    ? checkBackground('backgroundFallback.src', fallbackSrc, backgroundFiles, issues, { missingIsWarning: false })
    : true;
  if (typeof hub.background?.src === 'string') {
    checkBackground('background.src', hub.background.src, backgroundFiles, issues, { missingIsWarning: fallbackOk });
    issues.checked.backgrounds += 1;
  }
  const slots = Array.isArray(hub.slots) ? hub.slots : [];
  for (const slot of slots) {
    if (!slot || typeof slot !== 'object') continue;
    issues.checked.slots += 1;
    if (typeof slot.artworkId === 'string' && slot.artworkId && manifest && !knownIds.has(slot.artworkId)) {
      issues.errors.push(`museum-hub.json slot ${slot.id ?? '?'}: unknown artwork ID "${slot.artworkId}".`);
    }
  }
  return issues;
}

function main() {
  const args = process.argv.slice(2);
  const rootIndex = args.indexOf('--root');
  const here = dirname(fileURLToPath(import.meta.url));
  const root = rootIndex >= 0 && args[rootIndex + 1] ? resolve(args[rootIndex + 1]) : resolve(here, '..');
  const strict = args.includes('--strict');
  const result = validateDeploy(root);
  if (strict) result.errors.push(...result.warnings.splice(0));
  for (const warning of result.warnings) console.warn(`Warning: ${warning}`);
  for (const error of result.errors) console.error(`Error: ${error}`);
  const { artworks, slots, backgrounds } = result.checked;
  if (result.errors.length > 0) {
    console.error(`validate:deploy failed with ${result.errors.length} error(s).`);
    process.exit(1);
  }
  console.log(`validate:deploy ok — ${artworks} artwork(s), ${slots} slot(s), ${backgrounds} background(s) checked.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
