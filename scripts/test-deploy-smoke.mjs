#!/usr/bin/env node
/**
 * Checks real published content, photographic pixels, room paging, and editor
 * projection parity. Supports served deployments and standalone file:// previews.
 * Usage: FREYRAUM_CHROME_PATH=/usr/bin/google-chrome node scripts/test-deploy-smoke.mjs <gallery-url>
 * Optional tooling: npm i --no-save playwright
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const target = process.argv[2] ?? process.env.FREYRAUM_SMOKE_URL;
if (!target || !/^(https?|file):\/\//.test(target)) {
  console.error('Usage: node scripts/test-deploy-smoke.mjs <http(s):// or file:// gallery-url>');
  process.exit(2);
}

let playwright;
try {
  playwright = await import('playwright');
} catch {
  console.error('Playwright is not installed: npm i --no-save playwright');
  process.exit(2);
}

const config = JSON.parse(readFileSync(resolve(ROOT, 'customer-artworks/museum-hub.json'), 'utf8'));
const artworks = JSON.parse(readFileSync(resolve(ROOT, 'customer-artworks/artworks.json'), 'utf8'));
const bundled = buildSync({
  entryPoints: [resolve(ROOT, 'src/config/museumHub.ts')],
  bundle: true, format: 'esm', platform: 'browser', write: false, target: ['es2020'],
});
const { resolveMuseumHub } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
const expected = resolveMuseumHub(artworks, config);
assert.equal(config.background.src, 'Backgrounds/Museum_ohne_Bilder.png');
assert.equal(config.backgroundFallback.src, 'Backgrounds/museum-empty.png');

const browser = await playwright.chromium.launch({
  headless: true,
  ...(process.env.FREYRAUM_CHROME_PATH ? { executablePath: process.env.FREYRAUM_CHROME_PATH } : {}),
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const failures = [];
const warnings = [];
const check = (condition, message) => {
  if (condition) console.log(`✓ ${message}`);
  else failures.push(message);
};

async function openMuseum(url) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, reducedMotion: 'reduce' });
  page.on('response', (response) => {
    if (response.status() !== 404) return;
    const entry = `${response.request().method()} ${response.url()}`;
    if (response.request().method() === 'HEAD') warnings.push(`optional probe missing: ${entry}`);
    else failures.push(`missing file: ${entry}`);
  });
  page.on('requestfailed', (request) => {
    if (request.method() !== 'HEAD' && request.failure()?.errorText !== 'net::ERR_ABORTED') {
      const message = `failed request: ${request.url()} (${request.failure()?.errorText})`;
      // Standalone WebGL probes can fail file:// fetches while embedded sources
      // decode correctly. The decode and screenshot assertions below gate output.
      if (new URL(url).protocol === 'file:') warnings.push(message);
      else if (new URL(request.url()).origin === new URL(url).origin) failures.push(message);
      else warnings.push(`optional external resource: ${message}`);
    }
  });
  await page.goto(url, { waitUntil: 'load', timeout: 60_000 });
  const start = page.locator('.loading-start-btn:not([disabled])');
  await start.waitFor({ state: 'visible', timeout: 90_000 });
  if (new URL(url).pathname.endsWith('/index.html') && new URL(page.url()).pathname.endsWith('/customer-preview/app.html')) {
    const requested = new URL(url);
    const loaded = new URL(page.url());
    check(/^\d+$/.test(loaded.searchParams.get('previewRefresh') ?? ''),
      'root index refreshes the preview document');
    for (const [key, value] of requested.searchParams) {
      if (key !== 'previewRefresh') check(loaded.searchParams.getAll(key).includes(value),
        `root index preserves query parameter ${key}`);
    }
    check(loaded.hash === requested.hash, 'root index preserves the URL fragment');
    const assetUrls = await page.evaluate(() => [
      ...[...document.querySelectorAll('script[src]')].map((script) => script.src),
      ...[...document.querySelectorAll('link[rel="stylesheet"]')].map((link) => link.href),
    ]);
    for (const filename of ['customer-artworks.js', 'customer-audio.js', 'freyraum-gallery.js', 'style.css']) {
      check(assetUrls.some((src) => new URL(src).pathname.endsWith(`/${filename}`)
        && /^\d+$/.test(new URL(src).searchParams.get('t') ?? '')),
      `root preview versions ${filename} against stale browser caches`);
    }
  }
  await start.click();
  await page.waitForSelector('.museum-hub:not([hidden])', { timeout: 60_000 });
  await page.waitForSelector('.loading-overlay', { state: 'detached', timeout: 15_000 });
  await page.addStyleTag({ content: '.museum-hub *, .museum-hub { animation: none !important; transition: none !important; }' });
  await page.mouse.move(0, 0);
  return page;
}

async function assertPixelContribution(page, selector, label) {
  const image = page.locator(selector);
  await image.evaluate((element) => element.decode());
  const state = await image.evaluate((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      decoded: element.complete && element.naturalWidth > 0 && element.naturalHeight > 0,
      opacity: style.opacity, visibility: style.visibility,
      width: rect.width, height: rect.height,
    };
  });
  check(state.decoded && state.opacity === '1' && state.visibility === 'visible'
    && state.width > 1 && state.height > 1, `${label}: decoded and fully opaque`);
  const stage = page.locator('.museum-hub__stage');
  const present = await stage.screenshot({ animations: 'disabled' });
  const oldVisibility = await image.evaluate((element) => {
    const old = element.style.visibility;
    element.style.visibility = 'hidden';
    return old;
  });
  let absent;
  try {
    absent = await stage.screenshot({ animations: 'disabled' });
  } finally {
    await image.evaluate((element, previous) => { element.style.visibility = previous; }, oldVisibility);
  }
  check(!present.equals(absent), `${label}: contributes visible screenshot pixels (not covered by an opaque scene)`);
}

async function readGeometry(page) {
  return page.locator('.museum-hub__artwork[data-slot-id]').evaluateAll((elements) => elements
    .filter((element) => element.querySelector('.museum-hub__art')?.naturalWidth > 0)
    .map((element) => ({
      id: element.dataset.slotId,
      artworkId: element.dataset.artworkId,
      left: element.style.left, top: element.style.top,
      width: element.style.width, height: element.style.height,
      clipPath: element.style.clipPath,
      homography: element.style.getPropertyValue('--hub-artwork-transform'),
    })));
}

try {
  const url = new URL(target);
  url.searchParams.set('smoke', String(Date.now()));
  const page = await openMuseum(url.href);
  check(await page.locator('.museum-hub.is-photographic').count() === 1, 'museum uses the photographic renderer');
  check(await page.locator('.museum-hub__canvas').count() === 0, 'museum does not construct a WebGL room canvas');
  check(await page.locator('.museum-hub__room').count() === Math.max(1, expected.pages.length), 'resolved room/page count matches the published content');
  const backgroundSrc = await page.locator('.museum-hub__image').evaluate((image) => image.currentSrc || image.src);
  const expectedBackgroundPath = url.protocol === 'file:'
    ? '/Backgrounds/Museum_ohne_Bilder.png'
    : '/backgrounds/Museum_ohne_Bilder.png';
  check(Boolean(backgroundSrc) && decodeURIComponent(new URL(backgroundSrc).pathname).endsWith(expectedBackgroundPath),
    `exact primary photograph selected (${backgroundSrc || 'no resolved image source'})`);
  if (backgroundSrc) await assertPixelContribution(page, '.museum-hub__image', 'primary photograph');
  else check(false, 'primary photograph: no decoded background contributes visible pixels');

  const seen = [];
  for (const expectedPage of expected.pages) {
    await page.waitForSelector(`.museum-hub__room.is-active[data-page="${expectedPage.pageIndex}"]`);
    const active = page.locator('.museum-hub__room.is-active');
    const expectedSlots = expectedPage.slots.filter((slot) => slot.selectable && slot.artworkId);
    const actualSlots = await active.locator('.museum-hub__artwork:not([disabled])[data-artwork-id]').evaluateAll(
      (elements) => elements.map((element) => ({ id: element.dataset.slotId, artworkId: element.dataset.artworkId }))
    );
    check(JSON.stringify(actualSlots.sort((a, b) => a.id.localeCompare(b.id)))
      === JSON.stringify(expectedSlots.map(({ id, artworkId }) => ({ id, artworkId })).sort((a, b) => a.id.localeCompare(b.id))),
    `room ${expectedPage.pageIndex + 1}: exact available mappings (unavailable IDs are not substituted)`);
    for (const slot of expectedSlots) {
      await assertPixelContribution(page,
        `.museum-hub__room.is-active [data-slot-id="${slot.id}"] .museum-hub__art`, `${slot.id} / ${slot.artworkId}`);
    }
    seen.push(...await readGeometry(page));
    if (expectedPage.pageIndex < expected.pages.length - 1) {
      await page.locator('.museum-hub__pager-arrow--next').click();
    }
  }
  // Diagnostics coalesces identical messages, so validate retained outcome
  // samples rather than assuming one retained record per artwork.
  const domOutcomes = await page.evaluate(() => {
    const entries = (window.__FREYRAUM_DIAGNOSTICS__?.getEntries?.() ?? [])
      .filter((entry) => entry.event === 'source-to-pixel-outcome'
        && entry.data?.route === 'hub' && entry.data?.result === 'success');
    return entries.length > 0 && entries.every((entry) => {
      const data = entry.data;
      const image = [...document.querySelectorAll('.museum-hub__artwork[data-artwork-id]')]
        .find((element) => element.dataset.artworkId === data.artworkId)?.querySelector('.museum-hub__art');
      return image && data.presentationPath === 'dom'
        && data.sourceWidth === image.naturalWidth && data.sourceHeight === image.naturalHeight
        && data.uploadWidth === null && data.uploadHeight === null
        && data.rendererMaxTextureSize === null && data.visibleProbe === null
        && entry.message.includes('DOM presentation (no WebGL upload)');
    });
  });
  check(domOutcomes, 'retained diagnostic outcomes report native-size DOM decoding, not GPU/pixel proof');

  const editorUrl = new URL(process.env.FREYRAUM_SMOKE_EDITOR_URL ?? url.href);
  editorUrl.searchParams.set('hubCalibrate', '1');
  editorUrl.searchParams.set('placementEditor', '1');
  const editor = await openMuseum(editorUrl.href);
  await editor.waitForFunction(() => [...document.querySelectorAll('.museum-hub__art')]
    .every((image) => image.complete && image.naturalWidth > 0));
  const editorGeometry = new Map((await readGeometry(editor)).map((slot) => [slot.id, slot]));
  for (const slot of new Map(seen.map((item) => [item.id, item])).values()) {
    check(JSON.stringify(editorGeometry.get(slot.id)) === JSON.stringify(slot),
      `${slot.id}: editor and museum share exact bounds, clip polygon and homography`);
  }
  await editor.close();
  await page.close();
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
console.log('\nPASS: published room mappings, visible photograph/artwork pixels, and editor projection parity.');
