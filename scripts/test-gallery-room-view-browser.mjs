#!/usr/bin/env node
/**
 * Browser regression for the standalone room-view workflow. Requires Chrome
 * or Chromium and Node 22's built-in WebSocket client; no browser package is
 * added to the project.
 *
 * Run `npm run import:artworks && npm run build` first, then:
 * `FREYRAUM_CHROME_PATH=/path/to/chrome npm run test:gallery-room-view:browser`
 */
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { createServer } from 'node:net';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const chromePath = process.env.FREYRAUM_CHROME_PATH || '/usr/bin/google-chrome';
const previewUrl = process.env.FREYRAUM_ROOM_VIEW_URL
  || pathToFileURL(resolve(ROOT, 'index.html')).href;

async function unusedPort() {
  const server = createServer();
  await new Promise((resolveListen, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolveListen);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Could not allocate a Chrome debugging port');
  await new Promise((resolveClose, reject) => server.close((error) => error ? reject(error) : resolveClose()));
  return address.port;
}

const port = await unusedPort();
const tempProfile = mkdtempSync(join(tmpdir(), 'freyraum-room-view-chrome-'));
let chrome;
let socket;

try {
  chrome = spawn(chromePath, [
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempProfile}`,
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ], { stdio: 'ignore' });
  let launchError = null;
  chrome.once('error', (error) => { launchError = error; });
  let browserVersion = null;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (launchError) throw new Error(`Could not start Chrome at ${chromePath}: ${launchError.message}`);
    try {
      browserVersion = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
      break;
    } catch {
      await delay(250);
    }
  }
  if (!browserVersion) {
    throw new Error(`Chrome did not start from ${chromePath}. Set FREYRAUM_CHROME_PATH to Chrome or Chromium.`);
  }

  const targetResponse = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' });
  const target = await targetResponse.json();
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolveOpen, reject) => {
    socket.addEventListener('open', resolveOpen, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  let nextId = 0;
  const pending = new Map();
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  });
  const command = (method, params = {}) => new Promise((resolveCommand, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve: resolveCommand, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const response = await command('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
    return response.result?.value;
  };
  const waitFor = async (expression, timeoutMs = 20_000) => {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      if (await evaluate(expression)) return;
      await delay(200);
    }
    throw new Error(`Timed out waiting for ${expression}`);
  };

  await command('Page.enable');
  await command('Runtime.enable');
  await command('Page.navigate', { url: previewUrl });
  await waitFor("location.pathname.endsWith('/customer-preview/app.html') && !!document.querySelector('.loading-start-btn')", 30_000);
  await waitFor("!document.querySelector('.loading-start-btn').disabled", 60_000);
  await evaluate("document.querySelector('.loading-start-btn').click()");
  await waitFor("!!document.querySelector('.museum-hub:not([hidden])')", 30_000);
  await evaluate("document.querySelector('.museum-hub__destination:not([disabled])')?.click()");
  await waitFor("document.querySelector('#app').dataset.experience === 'gallery'", 30_000);
  await evaluate("document.querySelector('.topbar__room-view-btn').click()");
  await waitFor("!document.querySelector('.gallery-room-view').hidden", 5000);

  for (const [roomId, filename] of [['bedroom', 'gallery-bedroom.png'], ['wohnraum', 'gallery-wohnraum.png']]) {
    await evaluate(`(() => {
      const select = document.querySelector('.gallery-room-view__select');
      select.value = '${roomId}';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    })()`);
    await waitFor(
      `document.querySelector('.gallery-room-view__background').complete
        && document.querySelector('.gallery-room-view__background').currentSrc.endsWith('/${filename}')`,
      20_000
    );
    const image = await evaluate(`(() => {
      const root = document.querySelector('.gallery-room-view');
      const background = root.querySelector('.gallery-room-view__background');
      return {
        decoded: background.naturalWidth > 0,
        source: background.currentSrc,
        status: root.querySelector('.gallery-room-view__status').textContent,
      };
    })()`);
    assert.equal(image.decoded, true, `${roomId} photo decodes in the local preview`);
    assert.equal(image.status, '', `${roomId} photo has no load or projection error`);
    console.log(`✓ ${roomId} photo loaded from ${image.source}`);
  }

  for (const [roomId, width, height] of [
    ['bedroom', 1440, 900], ['wohnraum', 1440, 900],
    ['bedroom', 768, 1024], ['wohnraum', 768, 1024],
    ['bedroom', 390, 844], ['wohnraum', 390, 844],
    ['bedroom', 844, 390], ['wohnraum', 844, 390],
  ]) {
    await command('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < height,
    });
    await evaluate(`(() => {
      const select = document.querySelector('.gallery-room-view__select');
      select.value = '${roomId}';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    })()`);
    await delay(100);
    const layout = await evaluate(`(() => {
      const root = document.querySelector('.gallery-room-view');
      const art = root.querySelector('.gallery-room-view__artwork').getBoundingClientRect();
      const controls = root.querySelector('.gallery-room-view__controls').getBoundingClientRect();
      return {
        viewport: [innerWidth, innerHeight],
        art: { x: art.x, y: art.y, width: art.width, height: art.height },
        controls: { x: controls.x, y: controls.y, width: controls.width, height: controls.height },
      };
    })()`);
    const art = layout.art;
    const controls = layout.controls;
    const overlap = controls.x < art.x + art.width && controls.x + controls.width > art.x
      && controls.y < art.y + art.height && controls.y + controls.height > art.y;
    assert.equal(overlap, false, `${roomId} controls do not cover the artwork at ${width}x${height}`);
    assert.ok(controls.x >= 0 && controls.y >= 0
      && controls.x + controls.width <= width && controls.y + controls.height <= height,
    `${roomId} controls remain on screen at ${width}x${height}`);
    console.log(`✓ ${roomId} controls clear at ${width}x${height}`);
  }

  await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await evaluate(`document.querySelector('.gallery-room-view__select').value = 'wohnraum'`);
  await evaluate(`document.querySelector('.gallery-room-view__select').dispatchEvent(new Event('change',{bubbles:true}))`);

  const initialArtwork = await evaluate("document.querySelector('.gallery-room-view__artwork').currentSrc");
  await evaluate(`document.querySelector('.gallery-room-view__artwork-nav[aria-label="Nächstes Kunstwerk anzeigen"]').click()`);
  await waitFor(`document.querySelector('.gallery-room-view__artwork').complete
    && document.querySelector('.gallery-room-view__artwork').currentSrc !== ${JSON.stringify(initialArtwork)}`);
  const nextArtwork = await evaluate(`(() => {
    const image = document.querySelector('.gallery-room-view__artwork');
    return { source: image.currentSrc, decoded: image.naturalWidth > 0 };
  })()`);
  assert.equal(nextArtwork.decoded, true, 'next artwork loads in the photo room');
  await evaluate(`document.querySelector('.gallery-room-view__artwork-nav[aria-label="Vorheriges Kunstwerk anzeigen"]').click()`);
  await waitFor(`document.querySelector('.gallery-room-view__artwork').complete
    && document.querySelector('.gallery-room-view__artwork').currentSrc === ${JSON.stringify(initialArtwork)}`);
  console.log('✓ previous/next artwork navigation');

  await evaluate(`document.querySelector('.gallery-room-view [aria-label="Vergrößern"]').click()`);
  let camera = await evaluate("document.querySelector('.gallery-room-view__scene').style.transform");
  assert.match(camera, /scale\(1\.25\)/, 'zoom control zooms the photo camera');
  await command('Input.dispatchMouseEvent', { type: 'mousePressed', x: 290, y: 500, button: 'left', buttons: 1 });
  await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 230, y: 440, button: 'left', buttons: 1 });
  await command('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 230, y: 440, button: 'left', buttons: 0 });
  camera = await evaluate("document.querySelector('.gallery-room-view__scene').style.transform");
  assert.doesNotMatch(camera, /translate3d\(0px, 0px/, 'drag pans the photo');
  await evaluate(`document.querySelector('.gallery-room-view [aria-label="Ansicht zurücksetzen"]').click()`);
  camera = await evaluate("document.querySelector('.gallery-room-view__scene').style.transform");
  assert.match(camera, /translate3d\(0px, 0px, 0px\) scale\(1\)/, 'reset restores the photo camera');
  await evaluate(`(() => {
    const close = document.querySelector('.gallery-room-view__close');
    close.focus();
    close.dispatchEvent(new KeyboardEvent('keydown', { key: '+', bubbles: true }));
  })()`);
  camera = await evaluate("document.querySelector('.gallery-room-view__scene').style.transform");
  assert.match(camera, /scale\(1\.25\)/, 'keyboard shortcut zooms without invoking gallery zoom');
  await evaluate(`document.querySelector('.gallery-room-view [aria-label="Ansicht zurücksetzen"]').click()`);
  console.log('✓ photo zoom, drag pan, reset, and keyboard zoom');

  await command('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 2 });
  await command('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [
      { id: 1, x: 100, y: 400, radiusX: 2, radiusY: 2, force: 1 },
      { id: 2, x: 220, y: 400, radiusX: 2, radiusY: 2, force: 1 },
    ],
  });
  await command('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [
      { id: 1, x: 60, y: 400, radiusX: 2, radiusY: 2, force: 1 },
      { id: 2, x: 260, y: 400, radiusX: 2, radiusY: 2, force: 1 },
    ],
  });
  camera = await evaluate("document.querySelector('.gallery-room-view__scene').style.transform");
  assert.match(camera, /scale\(1\.[1-9]/, 'touch pinch zooms the photo camera');
  await command('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await evaluate("document.querySelector('.gallery-room-view__close').click()");
  assert.equal(
    await evaluate("document.querySelector('.gallery-room-view').hidden && document.activeElement === document.querySelector('.topbar__room-view-btn')"),
    true,
    'close returns to the gallery and restores focus to the room-view toggle'
  );
  console.log('✓ touch pinch and accessible close/focus restoration');
} finally {
  socket?.close();
  chrome?.kill('SIGTERM');
  rmSync(tempProfile, { recursive: true, force: true });
}
