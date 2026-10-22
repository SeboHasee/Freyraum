#!/usr/bin/env node
/**
 * v1.45 — zoom-work measurement for the gallery and the photo room.
 *
 * Headless frame counts say nothing about DOM-camera smoothness (SwiftShader
 * starves rAF in every variant, lesson 130). This script traces the browser
 * work that does matter — raster, paint, image decode, style recalculation
 * and layout — for the same zoom gestures in both views and prints a table.
 *
 * Run `npm run build` first, then:
 * `FREYRAUM_CHROME_PATH=/path/to/chrome npm run measure:room-zoom`
 * Optional: FREYRAUM_MEASURE_URL (defaults to customer-preview/app.html),
 * FREYRAUM_MEASURE_JSON=path to also write the numbers as JSON.
 */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { createServer } from 'node:net';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const chromePath = process.env.FREYRAUM_CHROME_PATH || '/usr/bin/google-chrome';
const pageUrl = process.env.FREYRAUM_MEASURE_URL
  || pathToFileURL(resolve(ROOT, 'customer-preview', 'app.html')).href;
const TRACE_CATEGORIES = [
  'devtools.timeline',
  'disabled-by-default-devtools.timeline',
  'cc',
].join(',');
/** Trace event name → reported column. */
const COUNTED = {
  RasterTask: 'raster',
  Paint: 'paint',
  ImageDecodeTask: 'decode',
  'Decode Image': 'decode',
  UpdateLayoutTree: 'style',
  Layout: 'layout',
};

async function unusedPort() {
  const server = createServer();
  await new Promise((resolveListen, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolveListen);
  });
  const address = server.address();
  await new Promise((resolveClose) => server.close(resolveClose));
  return address.port;
}

const port = await unusedPort();
const profile = mkdtempSync(join(tmpdir(), 'freyraum-measure-chrome-'));
let chrome;
let socket;
try {
  chrome = spawn(chromePath, [
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--no-first-run',
    'about:blank',
  ], { stdio: 'ignore' });
  let version = null;
  for (let attempt = 0; attempt < 80 && !version; attempt += 1) {
    try {
      version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
    } catch {
      await delay(250);
    }
  }
  if (!version) throw new Error(`Chrome did not start from ${chromePath}; set FREYRAUM_CHROME_PATH.`);
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolveOpen, reject) => {
    socket.addEventListener('open', resolveOpen, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  let nextId = 0;
  const pending = new Map();
  const eventListeners = new Set();
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (message.id && pending.has(message.id)) {
      const { resolveMessage, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolveMessage(message.result);
      return;
    }
    for (const listener of eventListeners) listener(message);
  });
  const command = (method, params = {}) => new Promise((resolveMessage, reject) => {
    const id = ++nextId;
    pending.set(id, { resolveMessage, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const response = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (response.exceptionDetails) {
      throw new Error(response.exceptionDetails.exception?.description ?? response.exceptionDetails.text);
    }
    return response.result?.value;
  };
  const waitFor = async (expression, timeoutMs = 30_000) => {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      if (await evaluate(expression)) return;
      await delay(200);
    }
    throw new Error(`Timed out waiting for ${expression}`);
  };

  /** Traces `action`, waits until `settled` holds, returns counted events. */
  const measure = async (action, settled) => {
    const counts = { raster: 0, paint: 0, decode: 0, style: 0, layout: 0 };
    const done = new Promise((resolveDone) => {
      const listener = (message) => {
        if (message.method === 'Tracing.dataCollected') {
          for (const event of message.params.value) {
            const column = COUNTED[event.name];
            if (column && (event.ph === 'X' || event.ph === 'B')) counts[column] += 1;
          }
        } else if (message.method === 'Tracing.tracingComplete') {
          eventListeners.delete(listener);
          resolveDone();
        }
      };
      eventListeners.add(listener);
    });
    await command('Tracing.start', { categories: TRACE_CATEGORIES, transferMode: 'ReportEvents' });
    const startedAt = Date.now();
    await action();
    await waitFor(settled, 90_000);
    await delay(400);
    const durationMs = Date.now() - startedAt;
    await command('Tracing.end');
    await done;
    return { ...counts, durationMs };
  };

  await command('Page.enable');
  await command('Runtime.enable');
  await command('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await command('Page.navigate', { url: pageUrl });
  await waitFor("!!document.querySelector('.loading-start-btn') && !document.querySelector('.loading-start-btn').disabled", 60_000);
  await evaluate("document.querySelector('.loading-start-btn').click()");
  await waitFor("!!document.querySelector('.museum-hub:not([hidden]) .museum-hub__artwork')", 60_000);
  await evaluate(`(document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.b"]')
    ?? document.querySelector('.museum-hub__artwork:not(:disabled)')).click()`);
  await waitFor("document.querySelector('#app')?.dataset.experience === 'gallery'", 60_000);
  await delay(2000);

  const wheel = async (x, y, deltaY, notches) => {
    for (let notch = 0; notch < notches; notch += 1) {
      await command('Input.dispatchMouseEvent', { type: 'mouseWheel', x, y, deltaX: 0, deltaY });
      await delay(60);
    }
  };
  const doubleClick = async (x, y) => {
    for (const clickCount of [1, 2]) {
      await command('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', buttons: 1, clickCount });
      await command('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', buttons: 0, clickCount });
    }
  };
  const results = {};

  // Gallery (WebGL): settles when the canvas stops requesting frames for a while.
  const galleryIdle = `new Promise((resolveIdle) => setTimeout(() => resolveIdle(true), 1500))`;
  results['gallery wheel in ×6'] = await measure(() => wheel(720, 450, -100, 6), galleryIdle);
  results['gallery wheel out ×6'] = await measure(() => wheel(720, 450, 100, 6), galleryIdle);
  results['gallery double-click in'] = await measure(() => doubleClick(720, 450), galleryIdle);
  results['gallery double-click out'] = await measure(() => doubleClick(720, 450), galleryIdle);

  await evaluate("document.querySelector('.topbar__room-view-btn')?.click()");
  await waitFor("!!document.querySelector('.gallery-room-view:not([hidden])') && document.querySelector('.gallery-room-view__artwork')?.complete", 60_000);
  await delay(1500);
  const sceneScale = "Number(document.querySelector('.gallery-room-view__scene').style.transform.split(' scale(')[1]?.slice(0, -1) || 1)";
  const roomSettled = `!document.querySelector('.gallery-room-view__scene').classList.contains('is-camera-moving')`;
  const atRest = `document.querySelector('.gallery-room-view__scene').style.transform === 'translate3d(0px, 0px, 0px) scale(1)'`;
  results['room wheel in ×6'] = await measure(() => wheel(720, 450, -100, 6), `${roomSettled} && ${sceneScale} > 1.5`);
  results['room wheel out ×6'] = await measure(() => wheel(720, 450, 100, 6), `${roomSettled} && ${sceneScale} < 1.01`);
  results['room button in ×3'] = await measure(async () => {
    for (let press = 0; press < 3; press += 1) {
      await evaluate(`document.querySelector('.gallery-room-view [aria-label="Vergrößern"]').click()`);
      await delay(80);
    }
  }, `${roomSettled} && ${sceneScale} > 1.9`);
  results['room reset'] = await measure(
    () => evaluate(`document.querySelector('.gallery-room-view [aria-label="Fotoansicht zurücksetzen"]').click()`),
    `${roomSettled} && ${atRest}`
  );
  results['room double-click in'] = await measure(() => doubleClick(860, 500), `${roomSettled} && Math.abs(${sceneScale} - 2.5) < 0.001`);
  results['room double-click out'] = await measure(() => doubleClick(860, 500), `${roomSettled} && ${atRest}`);

  const header = ['scenario', 'raster', 'paint', 'decode', 'style', 'layout', 'ms'];
  const rows = Object.entries(results).map(([name, value]) => [
    name, value.raster, value.paint, value.decode, value.style, value.layout, value.durationMs,
  ]);
  const widths = header.map((title, column) => Math.max(title.length, ...rows.map((row) => String(row[column]).length)));
  const line = (cells) => cells.map((cell, column) => String(cell).padEnd(widths[column])).join('  ');
  console.log(`Chrome ${version.Browser}, 1440×900, ${pageUrl}`);
  console.log(line(header));
  for (const row of rows) console.log(line(row));
  if (process.env.FREYRAUM_MEASURE_JSON) {
    writeFileSync(process.env.FREYRAUM_MEASURE_JSON, `${JSON.stringify({ browser: version.Browser, results }, null, 2)}\n`);
  }
} finally {
  try { socket?.close(); } catch { /* already closed */ }
  chrome?.kill('SIGKILL');
  await delay(200);
  rmSync(profile, { recursive: true, force: true });
}
