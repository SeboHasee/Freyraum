#!/usr/bin/env node
/**
 * Browser drag test for the generated standalone placement editor.
 *
 * Drags every artwork toward all four edges of its green mounting zone in
 * `customer-preview/placement-editor.html` (the exact file:// artifact customers
 * open) and checks that:
 *   1. the artwork moved toward the requested edge (or was already at it),
 *   2. it stopped exactly at the limit (one more 10 cm Shift+arrow step in
 *      the same direction does not move it),
 *   3. the editor reports no green-zone / doorway warning for it, and
 *   4. the exported JSON stays valid.
 *
 * Playwright is optional tooling (not a project dependency):
 *   npm i --no-save playwright && npx playwright install chromium
 * or point FREYRAUM_CHROME_PATH at an installed Chrome/Chromium binary.
 * Build the preview first: npm run import:artworks && npm run build
 */
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, '..');
const EDITOR_PATH = resolve(ROOT, process.argv[2] ?? 'customer-preview/placement-editor.html');
const VIEWPORT = { width: 1600, height: 900 };
/**
 * A blocked 10 cm Shift+arrow step must move less than this. centerHeight is
 * exported in metres (1 mm precision); horizontalPosition is wall-normalized
 * (0.001 ≈ 1 cm), so 0.002 covers export rounding on both axes.
 */
const AT_LIMIT_TOLERANCE = 0.002;
/** Placement warnings (position/zone/doorway) — size guidance is not a drag problem. */
const PLACEMENT_WARNING = /grünen Wandfläche|Türbereich|überschneidet|Position kann nicht/;
const DIRECTIONS = [
  { name: 'up', key: 'ArrowUp', axis: 'centerHeight', sign: 1 },
  { name: 'down', key: 'ArrowDown', axis: 'centerHeight', sign: -1 },
  { name: 'left', key: 'ArrowLeft', axis: 'horizontalPosition', sign: -1 },
  { name: 'right', key: 'ArrowRight', axis: 'horizontalPosition', sign: 1 },
];

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    console.error(
      'Playwright is not installed. Install it on demand (not a project dependency):\n' +
        '  npm i --no-save playwright && npx playwright install chromium\n' +
        'or set FREYRAUM_CHROME_PATH to a local Chrome/Chromium binary.'
    );
    process.exit(2);
  }
}

function requirePreview() {
  const bundle = resolve(dirname(EDITOR_PATH), 'customer-artworks.js');
  if (!existsSync(EDITOR_PATH) || !existsSync(bundle)) {
    console.error(
      `Missing generated editor preview (${EDITOR_PATH}) or customer bundle (${bundle}).\n` +
        'Run: npm run import:artworks && npm run build'
    );
    process.exit(2);
  }
}

async function readExport(page) {
  return page.evaluate(() => {
    const output = document.querySelector('.museum-hub__calibration-output');
    // Messages live in the "Speichern" tab; each carries its place in data-slot-id.
    const warnings = [...document.querySelectorAll('.museum-hub__calibration-warnings li')].map((item) => ({
      slotId: item.getAttribute('data-slot-id'),
      text: item.textContent ?? '',
    }));
    try {
      return { config: JSON.parse(output?.value ?? output?.textContent ?? ''), warnings };
    } catch {
      return { config: null, warnings };
    }
  });
}

function placementOf(exported, slotId) {
  return exported.config?.slots?.find((slot) => slot.id === slotId)?.placement ?? null;
}

async function dragTowardEdge(page, slotId, direction) {
  const button = page.locator(`.museum-hub__artwork[data-slot-id="${slotId}"]`);
  const box = await button.boundingBox();
  if (!box) throw new Error(`${slotId}: artwork is not visible`);
  const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  const margin = 3;
  const end = {
    up: { x: start.x, y: margin },
    down: { x: start.x, y: VIEWPORT.height - margin },
    left: { x: margin, y: start.y },
    right: { x: VIEWPORT.width - margin, y: start.y },
  }[direction.name];
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(end.x, end.y, { steps: 30 });
  await page.mouse.up();
  // The editor coalesces moves per animation frame; let the release settle.
  await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
}

async function main() {
  requirePreview();
  const { chromium } = await loadPlaywright();
  const executablePath = process.env.FREYRAUM_CHROME_PATH || undefined;
  const browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
    args: ['--allow-file-access-from-files', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  const failures = [];
  try {
    const page = await browser.newPage({ viewport: VIEWPORT });
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.goto(pathToFileURL(EDITOR_PATH).href);
    await page.waitForSelector('.museum-hub__calibration-output', { state: 'attached', timeout: 30_000 });
    // Enter the editor through the branded loader like a customer would.
    const start = page.locator('.loading-start-btn');
    await start.waitFor({ state: 'visible', timeout: 60_000 });
    await page.waitForFunction(() => !document.querySelector('.loading-start-btn')?.hasAttribute('disabled'));
    await start.click();
    await page.waitForSelector('.loading-overlay', { state: 'detached', timeout: 30_000 });
    const activeArtworks =
      '.museum-hub__room.is-active .museum-hub__artwork[data-slot-id]:not([disabled]):not(.is-empty-slot)';
    await page.waitForSelector(activeArtworks, { timeout: 30_000 });
    const slotIds = await page.$$eval(activeArtworks, (buttons) =>
      buttons
        .filter((button) => button.getBoundingClientRect().width > 0)
        .map((button) => button.getAttribute('data-slot-id'))
    );
    if (slotIds.length === 0) throw new Error('no draggable artworks found in the placement editor');

    for (const slotId of slotIds) {
      for (const direction of DIRECTIONS) {
        const label = `${slotId} → ${direction.name}`;
        const before = placementOf(await readExport(page), slotId);
        await dragTowardEdge(page, slotId, direction);
        const afterDrag = await readExport(page);
        const dragged = placementOf(afterDrag, slotId);
        if (!before || !dragged) {
          failures.push(`${label}: placement missing from export`);
          continue;
        }
        if (dragged.wallId !== before.wallId) failures.push(`${label}: wall ownership changed to ${dragged.wallId}`);
        const moved = (dragged[direction.axis] - before[direction.axis]) * direction.sign;
        // Blocked limit check: one more 1 cm step in the same direction.
        await page.locator(`.museum-hub__artwork[data-slot-id="${slotId}"]`).focus();
        await page.keyboard.press(`Shift+${direction.key}`);
        const afterKey = await readExport(page);
        const stepped = placementOf(afterKey, slotId);
        const extra = stepped ? (stepped[direction.axis] - dragged[direction.axis]) * direction.sign : Number.NaN;
        if (moved < -AT_LIMIT_TOLERANCE) {
          failures.push(`${label}: moved the wrong way (${moved.toFixed(3)})`);
        }
        if (!(extra <= AT_LIMIT_TOLERANCE)) {
          failures.push(`${label}: stopped ${extra.toFixed(3)} before the zone limit (drag did not reach the edge)`);
        }
        const slotWarnings = afterKey.warnings.filter(
          (warning) => warning.slotId === slotId && PLACEMENT_WARNING.test(warning.text)
        );
        if (slotWarnings.length) failures.push(`${label}: ${slotWarnings.map((warning) => warning.text).join(' | ')}`);
        console.log(
          `${failures.length ? '…' : '✓'} ${label}: ${direction.axis} ${before[direction.axis]} → ${dragged[direction.axis]}` +
            ` (extra step ${Number.isFinite(extra) ? extra.toFixed(3) : 'n/a'})`
        );
      }
    }
    if (pageErrors.length) failures.push(...pageErrors.map((message) => `page error: ${message}`));
  } finally {
    await browser.close();
  }
  if (failures.length) {
    console.error(`FAIL: ${failures.length} editor drag problem(s):\n- ${failures.join('\n- ')}`);
    process.exit(1);
  }
  console.log('PASS: every artwork reaches all four green-zone edges, stops exactly at the limit, and exports valid placements.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
