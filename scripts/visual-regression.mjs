/**
 * v0.74 Phase 10.3 / Phase 12 — Type A (visual) regression harness.
 *
 * Captures and compares rendered screenshots of the FREYRAUM gallery to gate
 * perceptual-risk optimizations (OPT-4 bloom, OPT-5 shadow, OPT-6 panel
 * opacity, OPT-9 LOD). This is the "pixel diff → Playwright" tooling mapping the
 * regression model requires (`plan.md § Phase 10.3`, `§ Phase 12.3 Type A`).
 *
 * Pass criterion (Phase 10.3 / 14.3): on every comparison, fewer than 2% of
 * pixels may differ by more than 10/255.
 *
 * Usage:
 *   1. Build a preview server (e.g. `npm run dev` or a static server of the
 *      built `customer-preview/`) and pass its URL via FREYRAUM_URL.
 *   2. Capture a baseline BEFORE the optimization:
 *        node scripts/visual-regression.mjs baseline
 *   3. Apply the optimization, then compare:
 *        node scripts/visual-regression.mjs compare
 *
 * Dependencies are loaded lazily so the rest of the toolchain never has to
 * install a browser engine. When Playwright (and pixelmatch + pngjs for the
 * compare step) are absent the script prints the exact install command and
 * exits non-zero rather than failing opaquely.
 *
 *   npm i -D playwright pixelmatch pngjs && npx playwright install chromium
 */
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, '..');
const BASELINE_DIR = resolve(ROOT, '.visual-regression/baseline');
const CURRENT_DIR = resolve(ROOT, '.visual-regression/current');
const DIFF_DIR = resolve(ROOT, '.visual-regression/diff');

const URL = process.env.FREYRAUM_URL ?? 'http://localhost:5173/app.html';
const VIEWPORT = { width: 1280, height: 800 };

const ARTWORK_STEPS = [0, 1, 2];
const ZOOM_STATES = ['overview', 'reset', 'inspection'];

// The fixed dramatic lighting configuration is exercised across artwork and
// zoom states. Stored preferences no longer include a lighting field.
const states = ARTWORK_STEPS.flatMap((artworkStep) =>
  ZOOM_STATES.map((zoom) => ({
    name: `dramatic__artwork-${artworkStep}__${zoom}`,
    query: '?startup=entry-minimal',
    artworkStep,
    zoom,
  }))
);

// Phase 10.3 / 14.3 thresholds.
const PER_PIXEL_CHANNEL_THRESHOLD = 10 / 255; // a pixel "differs" beyond this
const MAX_DIFF_FRACTION = 0.02; // < 2% of pixels may differ

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    console.error(
      'Playwright is not installed. Install the Type A tooling on demand:\n' +
        '  npm i -D playwright pixelmatch pngjs && npx playwright install chromium'
    );
    process.exit(2);
  }
}

async function capture(targetDir) {
  const { chromium } = await loadPlaywright();
  mkdirSync(targetDir, { recursive: true });
  const browser = await chromium.launch();
  for (const state of states) {
    const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 1 });
    await page.addInitScript(() => {
      localStorage.setItem('freyraum-nav-hint-seen', '1');
      localStorage.setItem(
        'freyraum.preferences.v1',
        JSON.stringify({
          reducedMotion: true,
          highContrast: false,
          contrastMode: 'auto',
          quality: 'high',
          audioMuted: false,
          audioVolume: 0.15,
          alwaysShowChrome: true,
        })
      );
    });
    await page.goto(`${URL}${state.query}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.loading-start-btn:not([disabled])', { timeout: 45_000 });
    await page.click('.loading-start-btn');
    await page.waitForSelector('.loading-overlay', { state: 'detached', timeout: 10_000 });
    for (let i = 0; i < state.artworkStep; i += 1) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(350);
    }
    if (state.zoom === 'overview') {
      for (let i = 0; i < 5; i += 1) await page.keyboard.press('-');
    } else if (state.zoom === 'inspection') {
      for (let i = 0; i < 7; i += 1) await page.keyboard.press('=');
    }
    await page.waitForTimeout(1600);
    const invariant = await page.evaluate(() => window.__FREYRAUM_PERF_TOOLS__?.checkInvariants());
    if (!invariant) {
      throw new Error(`${state.name}: performance/invariant tooling was not installed`);
    }
    if (invariant.violations.length > 0) {
      throw new Error(`${state.name}: invariant gate failed: ${invariant.violations.join('; ')}`);
    }
    const file = resolve(targetDir, `${state.name}.png`);
    await page.screenshot({ path: file });
    console.log(`captured ${state.name} → ${file}`);
    await page.close();
  }
  await browser.close();
}

async function compare() {
  let pixelmatch;
  let PNG;
  try {
    pixelmatch = (await import('pixelmatch')).default;
    PNG = (await import('pngjs')).PNG;
  } catch {
    console.error(
      'pixelmatch/pngjs not installed. Install the Type A compare tooling:\n' +
        '  npm i -D pixelmatch pngjs'
    );
    process.exit(2);
  }
  if (!existsSync(BASELINE_DIR)) {
    console.error(`No baseline at ${BASELINE_DIR}. Run "baseline" first.`);
    process.exit(2);
  }
  await capture(CURRENT_DIR);
  mkdirSync(DIFF_DIR, { recursive: true });

  let failed = 0;
  for (const state of states) {
    const basePath = resolve(BASELINE_DIR, `${state.name}.png`);
    const curPath = resolve(CURRENT_DIR, `${state.name}.png`);
    if (!existsSync(basePath)) {
      console.warn(`skip ${state.name}: no baseline image`);
      continue;
    }
    const base = PNG.sync.read(readFileSync(basePath));
    const cur = PNG.sync.read(readFileSync(curPath));
    if (base.width !== cur.width || base.height !== cur.height) {
      console.error(`FAIL ${state.name}: dimension mismatch`);
      failed += 1;
      continue;
    }
    const { width, height } = base;
    const diff = new PNG({ width, height });
    const mismatched = pixelmatch(base.data, cur.data, diff.data, width, height, {
      threshold: PER_PIXEL_CHANNEL_THRESHOLD,
    });
    writeFileSync(resolve(DIFF_DIR, `${state.name}.png`), PNG.sync.write(diff));
    const fraction = mismatched / (width * height);
    const verdict = fraction < MAX_DIFF_FRACTION ? 'PASS' : 'FAIL';
    if (verdict === 'FAIL') failed += 1;
    console.log(
      `${verdict} ${state.name}: ${(fraction * 100).toFixed(3)}% differing ` +
        `(limit ${(MAX_DIFF_FRACTION * 100).toFixed(1)}%)`
    );
  }
  if (failed > 0) {
    console.error(`\nType A gate FAILED for ${failed} state(s).`);
    process.exit(1);
  }
  console.log('\nType A gate PASSED.');
}

const mode = process.argv[2];
if (mode === 'baseline') {
  await capture(BASELINE_DIR);
  console.log(`\nBaseline written to ${BASELINE_DIR}.`);
} else if (mode === 'compare') {
  await compare();
} else {
  console.error('Usage: node scripts/visual-regression.mjs <baseline|compare>');
  process.exit(2);
}
