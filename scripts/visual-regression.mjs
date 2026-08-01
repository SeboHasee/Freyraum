/**
 * v0.74 Phase 10.3 / Phase 12 — Type A (visual) regression harness.
 *
 * Captures and compares rendered screenshots of the FREYRAUM gallery and main
 * museum hub to gate perceptual-risk changes.
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
const DESKTOP_VIEWPORT = { width: 1280, height: 800 };
const PHONE_VIEWPORT = { width: 390, height: 844 };

const ARTWORK_STEPS = [0, 1, 2];
const ZOOM_STATES = ['overview', 'reset', 'inspection'];

const states = [
  {
    name: 'hub__desktop__room-1',
    query: '?startup=entry-minimal',
    mode: 'hub',
    viewport: DESKTOP_VIEWPORT,
    hubSteps: [],
  },
  {
    name: 'hub__phone__left-wall',
    query: '?startup=entry-minimal',
    mode: 'hub',
    viewport: PHONE_VIEWPORT,
    hubSteps: [],
  },
  {
    name: 'hub__phone__right-wall',
    query: '?startup=entry-minimal',
    mode: 'hub',
    viewport: PHONE_VIEWPORT,
    hubSteps: ['ArrowRight'],
  },
  ...ARTWORK_STEPS.flatMap((artworkStep) =>
    ZOOM_STATES.map((zoom) => ({
      name: `dramatic__artwork-${artworkStep}__${zoom}`,
      query: '?startup=entry-minimal',
      mode: 'gallery',
      viewport: DESKTOP_VIEWPORT,
      artworkStep,
      zoom,
    }))
  ),
];

const PER_PIXEL_CHANNEL_THRESHOLD = 10 / 255;
const MAX_DIFF_FRACTION = 0.02;

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
    const page = await browser.newPage({ viewport: state.viewport, deviceScaleFactor: 1 });
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

    if (state.mode === 'hub') {
      await page.waitForSelector('.museum-hub:not([hidden])', { timeout: 10_000 });
      for (const step of state.hubSteps) {
        await page.keyboard.press(step);
        await page.waitForTimeout(350);
      }
      await page.waitForTimeout(600);
    } else {
      await page.waitForSelector("#app[data-experience='gallery']", { timeout: 10_000 });
      for (let index = 0; index < state.artworkStep; index += 1) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(350);
      }
      if (state.zoom === 'overview') {
        for (let index = 0; index < 5; index += 1) await page.keyboard.press('-');
      } else if (state.zoom === 'inspection') {
        for (let index = 0; index < 7; index += 1) await page.keyboard.press('=');
      }
      await page.waitForTimeout(1600);
    }

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
