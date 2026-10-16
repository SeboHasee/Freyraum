#!/usr/bin/env node
/**
 * v1.38 browser test for online editing in the deployed placement editor.
 *
 * Serves `dist/` over http at /Freyraum/ (like GitHub Pages), fakes
 * `editor-online.json` and the save service with Playwright routes, and checks
 * that a customer can:
 *   1. see a read-only preview until logging in (wrong password is refused),
 *   2. log in,
 *   3. upload a background (lowercase safe name, pending upload),
 *   4. add an artwork with title + artist and place it immediately,
 *   5. press "Veröffentlichen" and send one package whose contents pass the
 *      same server-side validation the save service runs,
 *   6. see "Wartet auf Freigabe" (pull-request mode).
 *
 * Playwright is optional tooling (not a project dependency):
 *   npm i --no-save playwright   and FREYRAUM_CHROME_PATH=/usr/bin/google-chrome
 * Build first: npm run import:artworks && npm run build
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, '..');
const DIST = resolve(ROOT, 'dist');
const SERVICE = 'https://save.example.test';
const PASSWORD = 'geheim-und-lang';
const BASE_COMMIT = 'a'.repeat(40);
const VIEWPORT = { width: 1600, height: 900 };

const rules = await import(
  `data:text/javascript;base64,${Buffer.from(
    buildSync({
      entryPoints: [resolve(ROOT, 'src/online/publishRules.ts')],
      bundle: true,
      format: 'esm',
      platform: 'neutral',
      write: false,
      target: ['es2022'],
    }).outputFiles[0].text
  ).toString('base64')}`
);

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    console.error('Playwright is not installed: npm i --no-save playwright (and set FREYRAUM_CHROME_PATH).');
    process.exit(2);
  }
}

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

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
};

function startServer() {
  const server = createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost');
    if (!url.pathname.startsWith('/Freyraum/')) {
      response.writeHead(404).end();
      return;
    }
    const relative = decodeURIComponent(url.pathname.slice('/Freyraum/'.length)) || 'index.html';
    const file = resolve(DIST, relative);
    if (!file.startsWith(DIST + sep) || !existsSync(file) || !statSync(file).isFile()) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { 'Content-Type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream' });
    response.end(readFileSync(file));
  });
  return new Promise((done) => server.listen(0, '127.0.0.1', () => done(server)));
}

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

async function main() {
  if (!existsSync(resolve(DIST, 'placement-editor.html')) || !existsSync(resolve(DIST, 'customer-artworks.js'))) {
    console.error('Missing dist/placement-editor.html or dist/customer-artworks.js. Run: npm run import:artworks && npm run build');
    process.exit(2);
  }
  const { chromium } = await loadPlaywright();
  const server = await startServer();
  const origin = `http://127.0.0.1:${server.address().port}`;
  const executablePath = process.env.FREYRAUM_CHROME_PATH || undefined;
  const browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  const failures = [];
  const check = (condition, message) => {
    if (condition) console.log(`✓ ${message}`);
    else failures.push(message);
  };
  const published = [];
  const loginAttempts = [];
  try {
    const context = await browser.newContext({ viewport: VIEWPORT });
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    if (process.env.DEBUG_PUBLISH) page.on('console', (m) => console.log('console:', m.text()));
    if (process.env.DEBUG_PUBLISH) page.on('request', (r) => r.url().includes('save.example') && console.log('request:', r.method(), r.url()));
    if (process.env.DEBUG_PUBLISH) page.on('requestfailed', (r) => console.log('failed:', r.method(), r.url(), r.failure()?.errorText));

    await page.route('**/Freyraum/editor-online.json*', (route) =>
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ commit: BASE_COMMIT, builtAt: new Date().toISOString(), saveServiceUrl: SERVICE }),
      })
    );
    await page.route(`${SERVICE}/**`, async (route) => {
      const request = route.request();
      const cors = {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        Vary: 'Origin',
      };
      if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
      const path = new URL(request.url()).pathname;
      const reply = (status, body) =>
        route.fulfill({ status, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const authorized = request.headers()['authorization'] === 'Bearer ' + 'test-token';
      if (path === '/login') {
        const body = JSON.parse(request.postData() ?? '{}');
        loginAttempts.push(body.password);
        if (body.password !== PASSWORD) return reply(401, { error: 'Falsches Passwort.' });
        return reply(200, { token: 'test-token', expiresAt: new Date(Date.now() + 3_600_000).toISOString(), mode: 'pull-request' });
      }
      if (!authorized) return reply(401, { error: 'Bitte anmelden.' });
      if (path === '/publish') {
        published.push(JSON.parse(request.postData() ?? 'null'));
        return reply(200, {
          status: 'pending-review',
          commit: 'b'.repeat(40),
          liveCommit: null,
          pullRequest: { number: 7, url: 'https://github.com/SeboHasee/Freyraum/pull/7' },
          files: [],
        });
      }
      if (path === '/status') {
        return reply(200, {
          mode: 'pull-request',
          mainCommit: BASE_COMMIT,
          pendingPullRequest: { number: 7, url: 'https://github.com/SeboHasee/Freyraum/pull/7' },
          pullRequest: { number: 7, state: 'open', merged: false, mergeCommit: null, url: 'https://github.com/SeboHasee/Freyraum/pull/7' },
        });
      }
      if (path === '/history') return reply(200, { versions: [] });
      return reply(404, { error: 'Unbekannt.' });
    });

    await page.goto(`${origin}/Freyraum/placement-editor.html`);
    const start = page.locator('.loading-start-btn');
    await start.waitFor({ state: 'visible', timeout: 60_000 });
    await page.waitForFunction(() => !document.querySelector('.loading-start-btn')?.hasAttribute('disabled'));
    await start.click();
    await page.waitForSelector('.loading-overlay', { state: 'detached', timeout: 30_000 });
    await page.waitForSelector('.museum-hub__publish:not([hidden])', { timeout: 15_000 });

    // 1. Read-only preview until login.
    check(await page.locator('.museum-hub.is-editor-readonly').count() === 1, 'editor is a read-only preview before login');
    check(
      await page.evaluate(() => document.querySelector('.museum-hub__visual')?.inert === true),
      'the scene cannot be edited before login (inert)'
    );
    check(
      (await page.locator('#museum-hub-editor-tab-save').getAttribute('aria-selected')) === 'true',
      'the "Speichern" tab with "Bearbeiten anmelden" opens first'
    );
    await page.fill('.museum-hub__publish-password', 'falsch');
    await page.click('.museum-hub__publish-login button[type="submit"]');
    await page.waitForFunction(() => document.querySelector('.museum-hub__publish-error')?.textContent?.includes('Falsches'));
    check(true, 'a wrong password is refused with a message');

    // 2. Login.
    await page.fill('.museum-hub__publish-password', PASSWORD);
    await page.click('.museum-hub__publish-login button[type="submit"]');
    await page.waitForSelector('.museum-hub__publish-body:not([hidden])');
    check(await page.locator('.museum-hub.is-editor-readonly').count() === 0, 'login unlocks editing');
    check(
      await page.evaluate(() => sessionStorage.getItem('freyraum.editorSession')?.includes('test-token') === true),
      'the session token is kept in session storage'
    );

    // 3. Background upload.
    await openTab(page, 'room');
    await page.setInputFiles('.museum-hub__background-input', {
      name: 'Test Hintergrund.PNG',
      mimeType: 'image/png',
      buffer: makePng(1600, 900, [200, 190, 180]),
    });
    await page.waitForFunction(() =>
      document.querySelector('.museum-hub__calibration-background-info')?.textContent?.includes('test-hintergrund.png')
    );
    let exported = await readExport(page);
    check(exported?.background?.src === 'Backgrounds/test-hintergrund.png', `background points to a lowercase safe name (${exported?.background?.src})`);
    check(
      (await page.locator('.museum-hub__background-library option', { hasText: 'test-hintergrund.png (neu)' }).count()) === 1,
      'the background library lists the pending upload'
    );

    // 4. Artwork upload with title + artist, then place it.
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
    check(true, 'the uploaded artwork appears in the library with the importer ID "neues-bild"');
    const emptySlotId = await page
      .locator('.museum-hub__room.is-active .museum-hub__artwork.is-empty-slot')
      .first()
      .getAttribute('data-slot-id');
    await libraryItem.click();
    await settle(page);
    await page.locator(`.museum-hub__room.is-active .museum-hub__artwork[data-slot-id="${emptySlotId}"]`).click();
    await settle(page);
    exported = await readExport(page);
    check(
      exported?.slots?.some((slot) => slot.id === emptySlotId && slot.artworkId === 'neues-bild'),
      `the new artwork can be placed immediately (${emptySlotId})`
    );

    // 5. Pending list + publish.
    await openTab(page, 'save');
    const pendingText = (await page.locator('.museum-hub__publish .museum-hub__publish-pending').textContent()) ?? '';
    check(
      pendingText.includes('Geändertes Layout') && pendingText.includes('Neuer Hintergrund: test-hintergrund.png') && pendingText.includes('Neues Bild: Test Bild'),
      'the "Wird veröffentlicht" list shows layout, background, and artwork'
    );
    const publishButton = page.locator('.museum-hub__publish-button');
    check(await publishButton.isEnabled(), '"Veröffentlichen" is enabled for a valid layout');
    await publishButton.click();
    await page.waitForFunction(() => document.querySelector('.museum-hub__publish')?.dataset.publishStage === 'review', null, {
      timeout: 15_000,
    });
    check(
      (await page.locator('.museum-hub__publish > .museum-hub__publish-body .museum-hub__publish-status').textContent())?.includes('Wartet auf Freigabe'),
      'pull-request mode shows "Wartet auf Freigabe"'
    );
    check(published.length === 1, 'exactly one save package was sent');
    const pkg = published[0];
    const paths = (pkg?.files ?? []).map((file) => file.path).sort();
    check(pkg?.baseCommit === BASE_COMMIT, 'the package carries the opened version for the conflict check');
    check(
      JSON.stringify(paths) === JSON.stringify([
        'customer-artworks/Backgrounds/test-hintergrund.png',
        'customer-artworks/inbox/neues-bild.png',
        'customer-artworks/inbox/neues-bild.txt',
      ]),
      `package files are the background, image, and text file (${paths.join(', ')})`
    );
    const sidecar = Buffer.from(pkg?.files?.find((file) => file.path.endsWith('.txt'))?.contentBase64 ?? '', 'base64').toString('utf8');
    check(sidecar.includes('Title: Test Bild') && sidecar.includes('Credit: Anna Beispiel'), 'the text file carries title and artist');
    check(pkg?.config?.background?.src === 'Backgrounds/test-hintergrund.png', 'the config points to the new background');
    check(
      pkg?.config?.slots?.some((slot) => slot.id === emptySlotId && slot.artworkId === 'neues-bild'),
      'the config places the new artwork'
    );
    const shipping = JSON.parse(readFileSync(resolve(ROOT, 'customer-artworks/museum-hub.json'), 'utf8'));
    const verdict = rules.validatePublishPackage(pkg, {
      currentConfig: shipping,
      existingBackgrounds: readdirSync(resolve(ROOT, 'customer-artworks/Backgrounds')),
      existingInbox: readdirSync(resolve(ROOT, 'customer-artworks/inbox')),
    });
    check(verdict.errors.length === 0, `the package passes the save-service validation (${verdict.errors.join(' | ') || 'no errors'})`);
    check(loginAttempts.length === 2, 'login was attempted twice (wrong, then right)');
    check(pageErrors.length === 0, `no page errors (${pageErrors.join(' | ')})`);
  } finally {
    await browser.close();
    server.close();
  }
  if (failures.length > 0) {
    console.error(`\nFAIL (${failures.length}):`);
    for (const failure of failures) console.error(`✗ ${failure}`);
    process.exit(1);
  }
  console.log('\nPASS: login, background + artwork upload, placement, and publishing package are correct.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
