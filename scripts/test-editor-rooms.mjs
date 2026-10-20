#!/usr/bin/env node
/**
 * Browser test for room management in the generated standalone placement
 * editor (`customer-preview/placement-editor.html`, the exact file:// artifact
 * customers open). It checks that a customer can:
 *   1. start with "Raum 1 von 1" and add Raum 2 with "+ Neuer Raum",
 *   2. assign two artworks to Raum 2 from the artwork list,
 *   3. drag an artwork in Raum 2,
 *   4. switch rooms with the room chips,
 *   5. add Raum 3 (undo/redo as one step each) and delete it (confirmation dialog),
 *   6. save with layout hints present (download enabled),
 *   7. open a validation message in another room (room switches),
 *   8. reload the downloaded file into the same state.
 *
 * Playwright is optional tooling (not a project dependency):
 *   npm i --no-save playwright && npx playwright install chromium
 * or point FREYRAUM_CHROME_PATH at an installed Chrome/Chromium binary.
 * Build the preview first: npm run import:artworks && npm run build
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, '..');
const EDITOR_PATH = resolve(ROOT, process.argv[2] ?? 'customer-preview/placement-editor.html');
const VIEWPORT = { width: 1600, height: 900 };

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

const settle = (page) =>
  page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));

async function counterText(page) {
  return (await page.locator('.museum-hub__room-counter').textContent())?.trim() ?? '';
}

async function readExport(page) {
  return page.evaluate(() => {
    const output = document.querySelector('.museum-hub__calibration-output');
    try {
      return JSON.parse(output?.value ?? '');
    } catch {
      return null;
    }
  });
}

function assignments(config) {
  return Object.fromEntries(
    (config?.slots ?? []).filter((slot) => slot.artworkId).map((slot) => [slot.id, slot.artworkId])
  );
}

async function openTab(page, id) {
  await page.click(`#museum-hub-editor-tab-${id}`);
  await settle(page);
}

async function clickRoomButton(page, text) {
  await openTab(page, 'room');
  await page.locator('.museum-hub__room-manager button', { hasText: text }).first().click();
  await settle(page);
}

/** Confirms the delete dialog; artworks (if any) become unplaced. */
async function confirmDelete(page) {
  await page
    .locator('dialog.museum-hub__editor-dialog[open] button', { hasText: /^(Bilder nicht platzieren|Raum löschen)$/ })
    .click();
  await settle(page);
}

/** Clicks an editor place in the scene (empty places are dashed buttons). */
async function scenePlaceClick(page, slotId) {
  await page.locator(`.museum-hub__room.is-active .museum-hub__artwork[data-slot-id="${slotId}"]`).click();
  await settle(page);
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
  const check = (condition, message) => {
    if (condition) console.log(`✓ ${message}`);
    else failures.push(message);
  };
  try {
    const context = await browser.newContext({ viewport: VIEWPORT, acceptDownloads: true });
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.goto(pathToFileURL(EDITOR_PATH).href, {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await page.waitForSelector('.museum-hub__calibration-output', { state: 'attached', timeout: 30_000 });
    const start = page.locator('.loading-start-btn');
    await start.waitFor({ state: 'visible', timeout: 60_000 });
    await page.waitForFunction(
      () => !document.querySelector('.loading-start-btn')?.hasAttribute('disabled'),
      null,
      { timeout: 60_000 }
    );
    await start.click();
    await page.waitForSelector('.loading-overlay', { state: 'detached', timeout: 30_000 });
    await page.waitForSelector('.museum-hub__room-counter', { timeout: 30_000 });

    check((await counterText(page)).startsWith('Raum 1 von 1'), 'editor opens with "Raum 1 von 1"');
    await openTab(page, 'room');
    const photoRoomEditor = page.locator('.museum-hub__gallery-room-editor');
    const photoRoomSelector = photoRoomEditor.locator('select');
    check(
      await photoRoomEditor.isVisible() && await photoRoomSelector.locator('option').count() === 2,
      'Raum tab exposes both configured photo rooms'
    );
    check(
      await photoRoomEditor.locator('.museum-hub__gallery-room-preview img').count() === 2,
      'photo-room editor shows the background and projected artwork preview'
    );
    const roomBefore = await readExport(page);
    const placementU = photoRoomEditor.getByLabel('Horizontalposition');
    const originalU = roomBefore.galleryRoomViews[0].placement.u;
    const editedU = originalU > 0.55 ? 0.45 : 0.55;
    await placementU.fill(editedU.toFixed(3));
    const roomAfter = await readExport(page);
    check(
      roomAfter.galleryRoomViews[0].placement.u === editedU,
      'photo-room placement edits update the exported configuration'
    );
    await page.getByRole('button', { name: /Rückgängig/ }).click();
    await settle(page);
    check(
      (await readExport(page)).galleryRoomViews[0].placement.u === originalU,
      'photo-room edits participate in editor undo history'
    );
    const firstPhotoBackground = await photoRoomEditor.locator('.museum-hub__gallery-room-preview img').first().getAttribute('src');
    await photoRoomSelector.selectOption({ index: 1 });
    const secondPhotoBackground = await photoRoomEditor.locator('.museum-hub__gallery-room-preview img').first().getAttribute('src');
    check(firstPhotoBackground !== secondPhotoBackground, 'photo-room selector switches the preview background');
    await photoRoomSelector.selectOption({ index: 0 });

    // 1. Add Raum 2: empty dashed places.
    await clickRoomButton(page, '+ Neuer Raum');
    check((await counterText(page)).startsWith('Raum 2 von 2'), '"+ Neuer Raum" creates and opens Raum 2');
    const emptyPlaces = await page.locator('.museum-hub__room.is-active .museum-hub__artwork.is-empty-slot').count();
    check(emptyPlaces === 4, `Raum 2 shows four empty dashed places (found ${emptyPlaces})`);

    // 2. Assign two unplaced artworks: click a place, then an artwork.
    await openTab(page, 'artworks');
    const unplacedItems = page.locator('.museum-hub__library-group--unplaced .museum-hub__library-item');
    const available = await unplacedItems.count();
    check(available >= 2, `artwork list offers unplaced artworks (found ${available})`);
    for (const slotId of ['room-02.wall-front.a', 'room-02.wall-front.b']) {
      await page.click(`.museum-hub__place-card[data-slot-id="${slotId}"]`);
      await page.locator('.museum-hub__library-group--unplaced .museum-hub__library-item').first().click();
      await settle(page);
    }
    let exported = await readExport(page);
    const room2 = Object.keys(assignments(exported)).filter((id) => id.startsWith('room-02.'));
    check(room2.length === 2, `two artworks are assigned to Raum 2 (${room2.join(', ')})`);

    // 3. Drag an artwork in Raum 2.
    const artwork = page.locator('.museum-hub__room.is-active .museum-hub__artwork[data-slot-id="room-02.wall-front.a"]');
    const before = exported.slots.find((slot) => slot.id === 'room-02.wall-front.a')?.placement;
    const box = await artwork.boundingBox();
    if (box) {
      const startPoint = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
      await page.mouse.move(startPoint.x, startPoint.y);
      await page.mouse.down();
      await page.mouse.move(startPoint.x + 40, startPoint.y - 25, { steps: 12 });
      await page.mouse.up();
      await settle(page);
    }
    exported = await readExport(page);
    const after = exported.slots.find((slot) => slot.id === 'room-02.wall-front.a')?.placement;
    check(
      Boolean(box && before && after && (after.horizontalPosition !== before.horizontalPosition || after.centerHeight !== before.centerHeight)),
      'dragging moves an artwork in Raum 2'
    );

    // 3b. v1.36 placement: click an artwork, then a dashed place in the scene.
    await openTab(page, 'artworks');
    await page.locator('.museum-hub__library-group--unplaced .museum-hub__library-item').first().click();
    await settle(page);
    const chosenCount = await page.locator('.museum-hub__library-item.is-chosen').count();
    const highlighted = await page
      .locator('.museum-hub__room.is-active .museum-hub__artwork.is-drop-candidate.is-drop-free')
      .count();
    check(chosenCount === 1 && highlighted >= 2, `choosing an artwork highlights free places (${highlighted})`);
    await scenePlaceClick(page, 'room-02.wall-left.a');
    exported = await readExport(page);
    check(Boolean(assignments(exported)['room-02.wall-left.a']), 'click → click places the chosen artwork in the scene');
    check(
      await page.locator('.museum-hub__toast:not([hidden])').isVisible(),
      'a confirmation message with "Rückgängig" appears after placing'
    );

    // 3c. Drag an artwork from the list straight onto a dashed place in the scene.
    const dragSource = page.locator('.museum-hub__library-group--unplaced .museum-hub__library-item').first();
    const sourceBox = await dragSource.boundingBox();
    const targetBox = await page
      .locator('.museum-hub__room.is-active .museum-hub__artwork[data-slot-id="room-02.wall-right.a"]')
      .boundingBox();
    let ghostSeen = false;
    if (sourceBox && targetBox) {
      await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
      await page.mouse.down();
      const target = { x: targetBox.x + targetBox.width / 2, y: targetBox.y + targetBox.height / 2 };
      await page.mouse.move(target.x, target.y, { steps: 15 });
      await settle(page);
      ghostSeen = await page.locator('.museum-hub__drag-ghost').isVisible().catch(() => false);
      await page.mouse.up();
      await settle(page);
    }
    exported = await readExport(page);
    check(
      ghostSeen && Boolean(assignments(exported)['room-02.wall-right.a']),
      'dragging from the list onto a dashed scene place assigns the artwork (with drag preview)'
    );

    // 4. Switch rooms with the chips.
    await page.locator('.museum-hub__room-chip').nth(0).click();
    await settle(page);
    const activeRoom1 = await page.$$eval('.museum-hub__room.is-active .museum-hub__artwork[data-slot-id]', (buttons) =>
      buttons.map((button) => button.getAttribute('data-slot-id'))
    );
    check(
      (await counterText(page)).startsWith('Raum 1 von 2') && activeRoom1.every((id) => id.startsWith('room-01.')),
      'room chips switch the editor and stage to Raum 1'
    );
    await page.locator('.museum-hub__room-chip').nth(1).click();
    await settle(page);
    check((await counterText(page)).startsWith('Raum 2 von 2'), 'room chips switch back to Raum 2');

    // 5. Add and delete Raum 3.
    await clickRoomButton(page, '+ Neuer Raum');
    check((await counterText(page)).startsWith('Raum 3 von 3'), 'Raum 3 is added after Raum 2');
    await page.locator('.museum-hub__editor-bottom button', { hasText: 'Rückgängig' }).click();
    await settle(page);
    check((await page.locator('.museum-hub__room-chip').count()) === 2, 'one undo step removes the added room');
    await page.locator('.museum-hub__editor-bottom button', { hasText: 'Wiederholen' }).click();
    await settle(page);
    check((await page.locator('.museum-hub__room-chip').count()) === 3, 'redo restores the added room');
    await page.locator('.museum-hub__room-chip').nth(2).click();
    await settle(page);
    await clickRoomButton(page, 'Raum löschen');
    await confirmDelete(page);
    await settle(page);
    check((await counterText(page)).startsWith('Raum 2 von 2'), 'deleting Raum 3 returns to Raum 2 of 2');

    // 6. Saving is allowed with layout hints (empty room) present.
    await page.locator('.museum-hub__room-chip').nth(0).click();
    await clickRoomButton(page, '+ Neuer Raum');
    check((await counterText(page)).startsWith('Raum 2 von 3'), 'a new empty room can be inserted after Raum 1');
    await openTab(page, 'save');
    const downloadEnabled = await page.locator('.museum-hub__save-primary').isEnabled();
    check(downloadEnabled, 'download stays enabled while only layout hints exist (empty room)');

    // 7. A validation message for another room switches to that room.
    await page.locator('.museum-hub__room-chip').nth(0).click();
    await settle(page);
    await openTab(page, 'save');
    const roomIssue = page.locator('.museum-hub__calibration-warnings li[data-page="1"] .museum-hub__issue-link').first();
    if ((await roomIssue.count()) > 0) {
      await roomIssue.click();
      await settle(page);
    }
    check((await counterText(page)).startsWith('Raum 2 von 3'), 'clicking a Raum 2 message opens Raum 2');
    await clickRoomButton(page, 'Raum löschen');
    await confirmDelete(page);
    await settle(page);

    // 8. Download, change, and reload the downloaded file.
    await openTab(page, 'save');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('.museum-hub__save-primary').click(),
    ]);
    const downloadedPath = await download.path();
    const saved = JSON.parse(readFileSync(downloadedPath, 'utf8'));
    check(
      Array.isArray(saved.rooms) && saved.rooms.length === 2 && saved.fallbacks?.autoPlaceUnmapped === false,
      'downloaded file lists both rooms and keeps unplaced artworks hidden'
    );
    await clickRoomButton(page, '+ Neuer Raum');
    await openTab(page, 'save');
    await page.setInputFiles('#museum-hub-editor-panel-save .museum-hub__file-input', downloadedPath);
    await page.waitForFunction(
      () => document.querySelector('.museum-hub__room-counter')?.textContent?.includes('von 2'),
      undefined,
      { timeout: 10_000 }
    ).catch(async () => {
      failures.push(`import did not restore two rooms: ${await page.locator('.museum-hub__calibration-action-status').textContent()}`);
    });
    const reloaded = await readExport(page);
    check(
      JSON.stringify(reloaded?.rooms) === JSON.stringify(saved.rooms)
        && JSON.stringify(assignments(reloaded)) === JSON.stringify(assignments(saved)),
      'reloading the downloaded file restores the same rooms and assignments'
    );

    if (pageErrors.length) failures.push(...pageErrors.map((message) => `page error: ${message}`));
  } finally {
    await browser.close();
  }
  if (failures.length) {
    console.error(`FAIL: ${failures.length} editor room problem(s):\n- ${failures.join('\n- ')}`);
    process.exit(1);
  }
  console.log('PASS: rooms can be added, filled, dragged, switched, deleted, saved, and reloaded in the placement editor.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
