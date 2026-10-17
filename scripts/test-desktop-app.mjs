#!/usr/bin/env node
/**
 * FREYRAUM — v1.39 desktop app test (`npm run test:desktop-app`).
 *
 * Part 1 (pure Node): the private `freyraum://app/` address maps only to the
 * bundled editor files and to the allowed project files; everything else
 * (path tricks, other hosts, museum-hub.json, package.json) is refused.
 *
 * Part 2 (Playwright's Electron support): starts the built app
 * (`desktop/dist/`) on a temporary copy of the project and checks that
 *   - the app runs "Update Gallery" itself (no Node installation needed),
 *   - the page has no Node access and cannot reach other sites or files,
 *   - inline scripts are blocked by the Content Security Policy,
 *   - a customer can upload a background and an artwork, place it, press
 *     "Im Projekt speichern", and the files land in the project folder,
 *   - the gallery is updated and the reloaded editor shows the saved state.
 *
 * Needs: npm run import:artworks && npm run build (root),
 *        cd desktop && npm ci && npm run build,
 *        npm i --no-save playwright (root); on Linux CI run under xvfb-run.
 */
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';
import { buildSync } from 'esbuild';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, '..');
const DESKTOP = resolve(ROOT, 'desktop');

const failures = [];
const check = (condition, message) => {
  if (condition) console.log(`✓ ${message}`);
  else failures.push(message);
};

/** Solid-colour RGB PNG without extra dependencies. */
function makePng(width, height, [r, g, b]) {
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc = (buffer) => {
    let c = 0xffffffff;
    for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type, data) => {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const sum = Buffer.alloc(4);
    sum.writeUInt32BE(crc(body));
    return Buffer.concat([length, body, sum]);
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 2;
  const row = Buffer.alloc(1 + width * 3);
  for (let x = 0; x < width; x += 1) row.set([r, g, b], 1 + x * 3);
  const raw = Buffer.concat(Array.from({ length: height }, () => row));
  return Buffer.concat([
    Buffer.from('89504e470d0a1a0a', 'hex'),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── Part 1: address mapping ──────────────────────────────────────────────────

const protocolModule = await import(
  `data:text/javascript;base64,${Buffer.from(
    buildSync({
      entryPoints: [resolve(DESKTOP, 'src/appProtocol.ts')],
      bundle: true,
      format: 'esm',
      platform: 'node',
      write: false,
      target: ['node18'],
    }).outputFiles[0].text
  ).toString('base64')}`
);
{
  const { resolveAppRequest, isAppPageUrl, isExternalWebUrl, EDITOR_URL } = protocolModule;
  const folders = { editorDir: '/app/editor', projectRoot: '/work/FREYRAUM' };
  const at = (path) => resolveAppRequest(`freyraum://app${path}`, folders);
  assert.equal(at('/customer-preview/placement-editor.html')?.file, '/app/editor/placement-editor.html');
  assert.equal(at('/customer-preview/placement-editor.html')?.source, 'app');
  assert.equal(at('/customer-preview/customer-artworks.js')?.file, '/work/FREYRAUM/customer-preview/customer-artworks.js');
  assert.equal(at('/customer-preview/images/a.webp')?.file, '/work/FREYRAUM/customer-preview/images/a.webp');
  assert.equal(at('/customer-artworks/Backgrounds/Raum%201.png')?.file, '/work/FREYRAUM/customer-artworks/Backgrounds/Raum 1.png');
  for (const refused of [
    '/customer-artworks/museum-hub.json',
    '/package.json',
    '/customer-preview/../package.json',
    '/customer-preview/%2e%2e/package.json',
    '/customer-preview/images/..%2f..%2fpackage.json',
    '/customer-preview/images/%5c..%5cpackage.json',
    '/customer-artworks/Backgrounds/notes.txt',
    '/customer-preview/images/sub/a.webp',
    '/customer-preview/editor-online.json',
    '/customer-preview/',
  ]) {
    assert.equal(at(refused), null, `refuses ${refused}`);
  }
  assert.equal(resolveAppRequest('freyraum://other/customer-preview/placement-editor.html', folders), null);
  assert.equal(resolveAppRequest('https://app/customer-preview/placement-editor.html', folders), null);
  assert.equal(
    resolveAppRequest('freyraum://app/customer-preview/customer-artworks.js', { ...folders, projectRoot: null }),
    null
  );
  assert.ok(isAppPageUrl(EDITOR_URL));
  assert.ok(!isAppPageUrl('https://example.com/'));
  assert.ok(isExternalWebUrl('https://github.com/'));
  assert.ok(!isExternalWebUrl('file:///etc/passwd'));
  assert.ok(!isExternalWebUrl('javascript:alert(1)'));
  check(true, 'freyraum://app/ serves only the editor and allowed project files');
}

// ── Part 2: the app ──────────────────────────────────────────────────────────

if (!existsSync(join(DESKTOP, 'dist', 'main.cjs')) || !existsSync(join(DESKTOP, 'dist', 'editor', 'freyraum-gallery.js'))) {
  console.error('Missing desktop/dist. Run: npm run build (root), then cd desktop && npm ci && npm run build');
  process.exit(2);
}
let electron;
try {
  ({ _electron: electron } = await import('playwright'));
} catch {
  console.error('Playwright is not installed: npm i --no-save playwright');
  process.exit(2);
}
let electronPath;
try {
  electronPath = createRequire(join(DESKTOP, 'package.json'))('electron');
} catch {
  console.error('Electron is not installed: cd desktop && npm ci');
  process.exit(2);
}

const TEMP = mkdtempSync(join(tmpdir(), 'freyraum-desktop-'));
const PROJECT = join(TEMP, 'FREYRAUM Projekt');
const USER_DATA = join(TEMP, 'user-data');
mkdirSync(PROJECT);
cpSync(join(ROOT, 'customer-artworks'), join(PROJECT, 'customer-artworks'), { recursive: true });
if (existsSync(join(ROOT, 'customer-audio'))) cpSync(join(ROOT, 'customer-audio'), join(PROJECT, 'customer-audio'), { recursive: true });
rmSync(join(PROJECT, 'customer-artworks', 'history'), { recursive: true, force: true });
writeFileSync(join(PROJECT, 'package.json'), '{ "name": "freyraum" }\n');
const hubFile = join(PROJECT, 'customer-artworks', 'museum-hub.json');
const originalConfig = JSON.parse(readFileSync(hubFile, 'utf8'));
// The repository may lack the large customer background; the copy gets a stand-in.
const originalBackground = join(PROJECT, 'customer-artworks', ...originalConfig.background.src.split('/'));
if (!existsSync(originalBackground)) writeFileSync(originalBackground, makePng(1600, 900, [120, 120, 120]));

const settle = (page) =>
  page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));

async function readExport(page) {
  return page.evaluate(() => {
    try {
      return JSON.parse(document.querySelector('.museum-hub__calibration-output')?.value ?? '');
    } catch {
      return null;
    }
  });
}

async function openTab(page, id) {
  await page.click(`#museum-hub-editor-tab-${id}`);
  await settle(page);
}

async function enterEditor(page) {
  await page.waitForURL(/placement-editor\.html/, { timeout: 120_000 });
  const start = page.locator('.loading-start-btn');
  await start.waitFor({ state: 'visible', timeout: 60_000 });
  await page.waitForFunction(() => !document.querySelector('.loading-start-btn')?.hasAttribute('disabled'));
  await start.click();
  await page.waitForSelector('.loading-overlay', { state: 'detached', timeout: 30_000 });
  await page.waitForSelector('.museum-hub__publish:not([hidden]) .museum-hub__publish-body:not([hidden])', {
    state: 'attached',
    timeout: 15_000,
  });
}

const app = await electron.launch({
  executablePath: electronPath,
  args: [DESKTOP, `--project=${PROJECT}`, '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  env: { ...process.env, FREYRAUM_EDITOR_USER_DATA: USER_DATA },
  timeout: 60_000,
});
try {
  const page = await app.firstWindow();
  await page.setViewportSize({ width: 1600, height: 900 }).catch(() => {});
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  if (process.env.DEBUG_DESKTOP) page.on('console', (message) => console.log('console:', message.text()));

  await enterEditor(page);
  check(existsSync(join(PROJECT, 'customer-preview', 'customer-artworks.js')), 'the app ran "Update Gallery" for the new project with its bundled Node');
  check(page.url().startsWith('freyraum://app/customer-preview/placement-editor.html'), 'the editor runs at freyraum://app/');

  // Locked-down page.
  const isolation = await page.evaluate(() => ({
    require: typeof window.require,
    process: typeof window.process,
    module: typeof window.module,
    bridgeKind: window.freyraumDesktop?.kind,
    bridgeKeys: Object.keys(window.freyraumDesktop ?? {}).sort(),
  }));
  check(
    isolation.require === 'undefined' && isolation.process === 'undefined' && isolation.module === 'undefined',
    'the page has no Node access (require/process/module are undefined)'
  );
  check(
    isolation.bridgeKind === 'freyraum-desktop'
      && JSON.stringify(isolation.bridgeKeys)
        === JSON.stringify(['chooseProject', 'history', 'kind', 'projectInfo', 'restore', 'save', 'setUnsavedChanges', 'updateGallery']),
    `only the small desktop bridge is exposed (${isolation.bridgeKeys.join(', ')})`
  );
  const fetches = await page.evaluate(async () => {
    const status = async (url) => {
      try {
        return (await fetch(url)).status;
      } catch {
        return 'blocked';
      }
    };
    return {
      hub: await status('freyraum://app/customer-artworks/museum-hub.json'),
      pkg: await status('freyraum://app/package.json'),
      file: await status('file:///etc/hostname'),
      web: await status('https://example.com/'),
      data: await status('freyraum://app/customer-preview/customer-artworks.js'),
    };
  });
  check(fetches.hub === 404 && fetches.pkg === 404, `project files outside the allowed folders are not served (${fetches.hub}, ${fetches.pkg})`);
  check(fetches.file === 'blocked' && fetches.web === 'blocked', `file:// and web requests are blocked (${fetches.file}, ${fetches.web})`);
  check(fetches.data === 200, 'gallery data is served from the project folder');
  const inlineRan = await page.evaluate(() => {
    const script = document.createElement('script');
    script.textContent = 'window.__inlineRan = true;';
    document.head.appendChild(script);
    return window.__inlineRan === true;
  });
  check(!inlineRan, 'inline scripts are blocked by the Content Security Policy');
  // (file:// instead of https:// so the test does not open the system browser.)
  const opened = await page.evaluate(() => window.open('file:///etc/hostname') === null);
  check(opened && app.windows().length === 1, 'new windows are refused');

  const stored = await app.evaluate(({ app: electronApp }) => electronApp.getPath('userData'));
  check(stored === USER_DATA, 'the test uses a throw-away settings folder');

  // Desktop save target.
  await openTab(page, 'save');
  const saveButton = page.locator('.museum-hub__publish-button');
  check((await saveButton.textContent())?.trim() === 'Im Projekt speichern', 'the save button reads "Im Projekt speichern"');
  check(await page.locator('.museum-hub__publish-login:not([hidden])').count() === 0, 'no login is needed in the app');
  check(await page.locator('.museum-hub.is-editor-readonly').count() === 0, 'the editor is editable right away');
  check(
    ((await page.locator('.museum-hub__publish').textContent()) ?? '').includes('FREYRAUM Projekt'),
    'the save tab shows the opened project folder'
  );

  await openTab(page, 'room');
  await page.setInputFiles('.museum-hub__background-input', {
    name: 'Test Hintergrund.PNG',
    mimeType: 'image/png',
    buffer: makePng(1600, 900, [200, 190, 180]),
  });
  await page.waitForFunction(() =>
    document.querySelector('.museum-hub__calibration-background-info')?.textContent?.includes('test-hintergrund.png')
  );
  await openTab(page, 'artworks');
  await page.fill('.museum-hub__upload-title', 'Test Bild');
  await page.fill('.museum-hub__upload-credit', 'Anna Beispiel');
  await page.setInputFiles('.museum-hub__upload-input', {
    name: 'Neues Bild.PNG',
    mimeType: 'image/png',
    buffer: makePng(600, 800, [40, 90, 160]),
  });
  const libraryItem = page.locator('.museum-hub__library-item[data-artwork-id="neues-bild"]');
  await libraryItem.waitFor({ timeout: 10_000 });
  const emptySlotId = await page
    .locator('.museum-hub__room.is-active .museum-hub__artwork.is-empty-slot')
    .first()
    .getAttribute('data-slot-id');
  await libraryItem.click();
  await settle(page);
  await page.locator(`.museum-hub__room.is-active .museum-hub__artwork[data-slot-id="${emptySlotId}"]`).click();
  await settle(page);
  const exported = await readExport(page);
  check(
    exported?.slots?.some((slot) => slot.id === emptySlotId && slot.artworkId === 'neues-bild'),
    `the new artwork is placed (${emptySlotId})`
  );

  await openTab(page, 'save');
  check(await saveButton.isEnabled(), '"Im Projekt speichern" is enabled for a valid layout');
  const reloaded = page.waitForEvent('load', { timeout: 120_000 });
  await saveButton.click();
  await page.waitForFunction(() => document.querySelector('.museum-hub__publish')?.dataset.publishStage === 'saved', null, {
    timeout: 120_000,
  });
  check(
    ((await page.locator('.museum-hub__publish-body .museum-hub__publish-status').first().textContent()) ?? '').includes('noch nicht online'),
    'the status says "Gespeichert ✓ · Lokal gespeichert – noch nicht online"'
  );

  const saved = JSON.parse(readFileSync(hubFile, 'utf8'));
  check(saved.background?.src === 'Backgrounds/test-hintergrund.png', 'museum-hub.json points to the new background');
  check(saved.slots?.some((slot) => slot.id === emptySlotId && slot.artworkId === 'neues-bild'), 'museum-hub.json places the new artwork');
  check(existsSync(join(PROJECT, 'customer-artworks', 'Backgrounds', 'test-hintergrund.png')), 'the background was written');
  check(existsSync(join(PROJECT, 'customer-artworks', 'inbox', 'neues-bild.png')), 'the artwork was written to the inbox');
  const sidecar = readFileSync(join(PROJECT, 'customer-artworks', 'inbox', 'neues-bild.txt'), 'utf8');
  check(sidecar.includes('Title: Test Bild') && sidecar.includes('Credit: Anna Beispiel'), 'the text file carries title and artist');
  const history = existsSync(join(PROJECT, 'customer-artworks', 'history')) ? readdirSync(join(PROJECT, 'customer-artworks', 'history')) : [];
  check(history.length === 1, `the previous museum-hub.json was kept in history (${history.join(', ')})`);
  check(
    readFileSync(join(PROJECT, 'customer-preview', 'customer-artworks.js'), 'utf8').includes('neues-bild'),
    'the gallery was updated with the new artwork'
  );
  check(
    readdirSync(join(PROJECT, 'customer-artworks'), { recursive: true }).every((name) => !String(name).endsWith('.freyraum-tmp')),
    'no temporary files were left behind'
  );

  await reloaded;
  await enterEditor(page);
  const after = await readExport(page);
  check(
    after?.background?.src === 'Backgrounds/test-hintergrund.png'
      && after?.slots?.some((slot) => slot.id === emptySlotId && slot.artworkId === 'neues-bild'),
    'the reloaded editor shows the saved state'
  );
  check(
    (await page.locator('.museum-hub__library-item[data-artwork-id="neues-bild"]').count()) === 1,
    'the imported artwork is in the library after reload'
  );
  check(pageErrors.length === 0, `no page errors (${pageErrors.join(' | ')})`);

  // Last, because Playwright keeps waiting for a navigation that was refused.
  const editorUrl = page.url();
  await page.evaluate(() => {
    window.location.href = 'file:///etc/hostname';
  });
  await new Promise((done) => setTimeout(done, 1000));
  const shownUrl = await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0]?.webContents.getURL());
  check(shownUrl === editorUrl, 'the window cannot navigate away from the app');
} finally {
  await app.close().catch(() => {});
  rmSync(TEMP, { recursive: true, force: true });
}

if (failures.length > 0) {
  console.error(`\nFAIL (${failures.length}):`);
  for (const failure of failures) console.error(`✗ ${failure}`);
  process.exit(1);
}
console.log('\nPASS: the desktop app is locked down and saves uploads and layout into the project folder.');
