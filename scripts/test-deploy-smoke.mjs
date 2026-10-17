#!/usr/bin/env node
/**
 * v1.38 deploy smoke test: opens the live (or any served) gallery and checks
 * that the published state really arrived:
 *   - number of rooms and placed artworks matches customer-artworks/museum-hub.json,
 *   - the room background image loaded,
 *   - no file the page requested with GET came back 404.
 *
 * Usage: node scripts/test-deploy-smoke.mjs https://sebohasee.github.io/Freyraum/
 * Playwright is optional tooling: npm i --no-save playwright
 * (set FREYRAUM_CHROME_PATH or run `npx playwright install chromium`).
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, '..');
const target = process.argv[2] ?? process.env.FREYRAUM_SMOKE_URL;
if (!target || !/^https?:\/\//.test(target)) {
  console.error('Usage: node scripts/test-deploy-smoke.mjs <gallery-url>');
  process.exit(2);
}

let playwright;
try {
  playwright = await import('playwright');
} catch {
  console.error('Playwright is not installed: npm i --no-save playwright');
  process.exit(2);
}

function expectedCounts() {
  const config = JSON.parse(readFileSync(resolve(ROOT, 'customer-artworks/museum-hub.json'), 'utf8'));
  const rooms = Array.isArray(config.rooms) ? config.rooms.length : null;
  const artworks = (config.slots ?? []).filter((slot) => typeof slot.artworkId === 'string' && slot.artworkId).length;
  return { rooms, artworks };
}

const expected = expectedCounts();
const executablePath = process.env.FREYRAUM_CHROME_PATH || undefined;
const browser = await playwright.chromium.launch({
  headless: true,
  ...(executablePath ? { executablePath } : {}),
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const failures = [];
const warnings = [];
const check = (condition, message) => {
  if (condition) console.log(`✓ ${message}`);
  else failures.push(message);
};

try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const missing = [];
  page.on('response', (response) => {
    if (response.status() !== 404) return;
    const entry = `${response.request().method()} ${response.url()}`;
    // HEAD requests are background-candidate probes with a built-in fallback.
    if (response.request().method() === 'HEAD') warnings.push(`optional file missing: ${entry}`);
    else missing.push(entry);
  });
  const url = new URL(target);
  url.searchParams.set('smoke', String(Date.now()));
  await page.goto(url.href, { waitUntil: 'load', timeout: 60_000 });
  const start = page.locator('.loading-start-btn');
  await start.waitFor({ state: 'visible', timeout: 90_000 });
  await page.waitForFunction(() => !document.querySelector('.loading-start-btn')?.hasAttribute('disabled'), null, { timeout: 90_000 });
  await start.click();
  await page.waitForSelector('.museum-hub', { timeout: 60_000 });
  await page.waitForTimeout(1500);

  const state = await page.evaluate(() => {
    const image = document.querySelector('.museum-hub__stage img, .museum-hub img');
    return {
      rooms: document.querySelectorAll('.museum-hub__room').length,
      artworks: new Set(
        [...document.querySelectorAll('.museum-hub__artwork[data-slot-id]')]
          .filter((element) => !element.classList.contains('is-empty-slot'))
          .map((element) => element.getAttribute('data-slot-id'))
      ).size,
      backgroundLoaded: Boolean(image && image.complete && image.naturalWidth > 0),
      backgroundSrc: image?.currentSrc ?? image?.getAttribute('src') ?? null,
    };
  });
  if (expected.rooms !== null) {
    check(state.rooms === expected.rooms, `rooms: ${state.rooms} (expected ${expected.rooms})`);
  }
  check(state.artworks === expected.artworks, `placed artworks: ${state.artworks} (expected ${expected.artworks})`);
  check(state.backgroundLoaded, `background loaded (${state.backgroundSrc})`);
  check(missing.length === 0, `no missing files${missing.length ? `: ${missing.join(', ')}` : ''}`);
} catch (error) {
  failures.push(error instanceof Error ? error.message : String(error));
} finally {
  await browser.close();
}

for (const warning of warnings) console.warn(`⚠ ${warning}`);
if (failures.length > 0) {
  console.error(`\nFAIL (${failures.length}):`);
  for (const failure of failures) console.error(`✗ ${failure}`);
  process.exit(1);
}
console.log('\nPASS: the deployed gallery shows the published rooms, artworks, and background.');
