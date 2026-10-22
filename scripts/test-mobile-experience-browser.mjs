#!/usr/bin/env node
/**
 * Phone browser regression for the v1.41 mobile experience: hub panorama
 * visibility and tappability, artwork-strip sync, no accidental open after a
 * drag, browser-bar colour, and how much of the gallery the controls cover.
 * Uses Chrome's mobile + touch emulation over raw CDP (no browser package).
 *
 * Run `npm run import:artworks && npm run build` first, then:
 * `FREYRAUM_CHROME_PATH=/path/to/chrome npm run test:mobile-browser`
 * Optional: FREYRAUM_MOBILE_URL (defaults to customer-preview/app.html) and
 * FREYRAUM_MOBILE_CAPTURE_DIR for PNG captures.
 */
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { once } from 'node:events';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { createServer } from 'node:net';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const chromePath = process.env.FREYRAUM_CHROME_PATH || '/usr/bin/google-chrome';
const previewUrl = process.env.FREYRAUM_MOBILE_URL
  || pathToFileURL(resolve(ROOT, 'customer-preview', 'app.html')).href;
const captureDir = process.env.FREYRAUM_MOBILE_CAPTURE_DIR;
if (captureDir) mkdirSync(captureDir, { recursive: true });

/** Phone portrait sizes get the panorama; the landscape size must not. */
const VIEWPORTS = [
  { name: 'phone-390x844', width: 390, height: 844, panorama: true, gallery: true },
  { name: 'phone-360x780', width: 360, height: 780, panorama: true, gallery: false },
  { name: 'phone-844x390', width: 844, height: 390, panorama: false, gallery: false },
];
/** Topbar + bottom chrome may cover at most this share of a portrait phone. */
const MAX_PORTRAIT_CHROME_SHARE = 0.24;

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
const tempProfile = mkdtempSync(join(tmpdir(), 'freyraum-mobile-chrome-'));
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

  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
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
    const { resolve: resolveMessage, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolveMessage(message.result);
  });
  const command = (method, params = {}) => new Promise((resolveCommand, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve: resolveCommand, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const response = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (response.exceptionDetails) {
      throw new Error(response.exceptionDetails.exception?.description ?? response.exceptionDetails.text);
    }
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
  const capture = async (filename) => {
    if (!captureDir) return;
    const screenshot = await command('Page.captureScreenshot', { format: 'png', fromSurface: true });
    writeFileSync(join(captureDir, filename), Buffer.from(screenshot.data, 'base64'));
  };
  /** Waits for an element's finite CSS animations (bounded; rAF may be starved headless). */
  const settleAnimations = (selector) => evaluate(`Promise.race([
    Promise.all(document.querySelector(${JSON.stringify(selector)}).getAnimations()
      .filter((animation) => Number.isFinite(animation.effect?.getComputedTiming().endTime ?? Infinity))
      .map((animation) => animation.finished.catch(() => undefined))),
    new Promise((resolveTimeout) => setTimeout(resolveTimeout, 8000)),
  ])`);
  const touch = (type, x, y) => command('Input.dispatchTouchEvent', {
    type,
    touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1, radiusX: 4, radiusY: 4, force: 1 }],
  });
  const tap = async (x, y) => {
    await touch('touchStart', x, y);
    await delay(60);
    await touch('touchEnd', x, y);
  };
  const drag = async (fromX, toX, y, steps = 10) => {
    await touch('touchStart', fromX, y);
    for (let step = 1; step <= steps; step += 1) {
      await delay(16);
      await touch('touchMove', fromX + ((toX - fromX) * step) / steps, y);
    }
    await touch('touchEnd', toX, y);
  };
  const readPan = () => evaluate(
    "Number.parseFloat(getComputedStyle(document.querySelector('.museum-hub__visual')).getPropertyValue('--hub-pan-x')) || 0"
  );
  /** Waits until the panorama pan stops moving (momentum may be rAF-starved headless). */
  const waitForPanSettled = async (timeoutMs = 30_000) => {
    const deadline = Date.now() + timeoutMs;
    let previous = Number.NaN;
    let stable = 0;
    while (Date.now() < deadline) {
      const pan = await readPan();
      stable = Math.abs(pan - previous) < 0.5 ? stable + 1 : 0;
      previous = pan;
      if (stable >= 4) return pan;
      await delay(250);
    }
    throw new Error(`Panorama pan did not settle (last ${previous})`);
  };

  await command('Page.enable');
  await command('Runtime.enable');

  for (const viewport of VIEWPORTS) {
    await command('Emulation.setDeviceMetricsOverride', {
      width: viewport.width, height: viewport.height, deviceScaleFactor: 2, mobile: true,
      screenOrientation: viewport.width > viewport.height
        ? { type: 'landscapePrimary', angle: 90 }
        : { type: 'portraitPrimary', angle: 0 },
    });
    await command('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    await command('Emulation.setEmulatedMedia', {
      features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }],
    });
    await command('Page.navigate', { url: previewUrl });
    await waitFor("document.readyState === 'complete' && !!document.querySelector('.loading-start-btn')", 30_000);

    const themeColor = await evaluate(
      "document.querySelector('meta[name=\"theme-color\"]')?.getAttribute('content') ?? ''"
    );
    assert.match(themeColor, /^#[0-9a-f]{6}$/i, `${viewport.name}: a theme-color meta colours the phone browser bar`);

    await waitFor("!document.querySelector('.loading-start-btn').disabled", 60_000);
    await evaluate("document.querySelector('.loading-start-btn').click()");
    await waitFor("!!document.querySelector('.museum-hub:not([hidden]) .museum-hub__artwork')", 30_000);
    await delay(800);

    const hub = await evaluate(`(() => ({
      panorama: document.querySelector('.museum-hub').classList.contains('is-panorama'),
      stripHidden: document.querySelector('.museum-hub__strip')?.hidden ?? true,
      stripItems: document.querySelectorAll('.museum-hub__strip-item').length,
    }))()`);
    assert.equal(hub.panorama, viewport.panorama, `${viewport.name}: panorama mode only on narrow portrait phones`);
    await capture(`${viewport.name}-hub.png`);

    if (!viewport.panorama) {
      // Landscape keeps the full room photo: every artwork of the room is on screen.
      const offscreen = await evaluate(`[...document.querySelectorAll('.museum-hub__artwork')]
        .filter((button) => !button.disabled && button.getClientRects().length > 0
          && getComputedStyle(button).visibility !== 'hidden')
        .map((button) => ({ id: button.dataset.slotId, rect: button.getBoundingClientRect().toJSON() }))
        .filter(({ rect }) => rect.width > 0 && (rect.right < 0 || rect.left > innerWidth))`);
      assert.deepEqual(offscreen, [], `${viewport.name}: no visible artwork lies outside the landscape viewport`);
      console.log(`✓ ${viewport.name}: full room view, theme-color ${themeColor}`);

      // v1.46 (C3): in the landscape gallery the timeline is a right-hand rail,
      // utilities sit in the phone menu, and the artwork keeps most of the height.
      await evaluate("document.querySelector('.museum-hub:not([hidden]) .museum-hub__artwork:not([disabled])').click()");
      await waitFor("!!document.querySelector('.timeline') && document.querySelector('.museum-hub')?.hidden !== false", 90_000);
      await delay(2_500);
      await capture(`${viewport.name}-gallery.png`);
      const rail = await evaluate(`(() => {
        const rect = (selector) => document.querySelector(selector)?.getBoundingClientRect().toJSON() ?? null;
        const refit = (window.__FREYRAUM_DIAGNOSTICS__?.getEntries?.() ?? [])
          .filter((entry) => entry.event === 'viewport-refit').at(-1)?.data?.viewport ?? null;
        return {
          timeline: rect('.timeline'),
          topbar: rect('.topbar'),
          item: rect('.timeline__item'),
          menuToggle: !!document.querySelector('.topbar .phone-menu__toggle'),
          navShown: getComputedStyle(document.querySelector('.nav-controls')).display !== 'none',
          refit,
          width: innerWidth,
          height: innerHeight,
        };
      })()`);
      assert.ok(
        rail.timeline.height > rail.timeline.width && rail.timeline.right <= rail.width && rail.timeline.left > rail.width * 0.8,
        `${viewport.name}: the timeline is a right-hand rail (${JSON.stringify(rail.timeline)})`
      );
      assert.ok(rail.timeline.top >= rail.topbar.bottom, `${viewport.name}: the rail starts below the topbar`);
      assert.ok(rail.item.width >= 44 && rail.item.height >= 44, `${viewport.name}: rail thumbnails keep 44 px touch targets`);
      assert.equal(rail.menuToggle, true, `${viewport.name}: utilities collapse into the phone menu`);
      assert.equal(rail.navShown, false, `${viewport.name}: the floating arrows give way to the swipe`);
      if (rail.refit) {
        assert.ok(
          rail.refit.usableH >= rail.height * 0.8,
          `${viewport.name}: the artwork keeps at least 80 % of the height (${JSON.stringify(rail.refit)})`
        );
      }
      console.log(`✓ ${viewport.name}: landscape gallery rail; artwork area ${rail.refit?.usableW}×${rail.refit?.usableH} px`);
      continue;
    }

    assert.equal(hub.stripHidden, false, `${viewport.name}: the artwork strip is shown in the panorama`);
    assert.ok(hub.stripItems >= 2, `${viewport.name}: the strip lists the room's artworks (${hub.stripItems})`);

    // Every strip entry glides its artwork on screen, where a tap can reach it.
    for (let index = 0; index < hub.stripItems; index += 1) {
      const itemCenter = await evaluate(`(() => {
        const rect = document.querySelectorAll('.museum-hub__strip-item')[${index}].getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      })()`);
      await tap(itemCenter.x, itemCenter.y);
      await waitFor(`document.querySelectorAll('.museum-hub__strip-item')[${index}]?.classList.contains('is-centered')`, 10_000);
      await waitForPanSettled();
      // v1.45: headless SwiftShader can starve rAF for over a second mid-glide,
      // which the stability check reads as "settled"; poll the end state.
      const readReach = () => evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork.is-strip-focus');
        if (!button) return null;
        const rect = button.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        return {
          id: button.dataset.slotId,
          inside: rect.left >= -1 && rect.right <= innerWidth + 1 && rect.top >= 0 && rect.bottom <= innerHeight,
          hit: document.elementFromPoint(x, y)?.closest('.museum-hub__artwork')?.dataset.slotId ?? null,
          rect: { left: Math.round(rect.left), right: Math.round(rect.right), top: Math.round(rect.top), bottom: Math.round(rect.bottom) },
          viewport: { width: innerWidth, height: innerHeight },
          pan: Number.parseFloat(getComputedStyle(document.querySelector('.museum-hub__visual')).getPropertyValue('--hub-pan-x')) || 0,
          visualWidth: document.querySelector('.museum-hub__visual').offsetWidth,
        };
      })()`);
      let reach = await readReach();
      for (const deadline = Date.now() + 20_000; reach && !reach.inside && Date.now() < deadline;) {
        await delay(250);
        reach = await readReach();
      }
      assert.ok(reach, `${viewport.name}: strip item ${index} focuses an artwork`);
      assert.ok(reach.inside, `${viewport.name}: ${reach.id} is fully on screen after its strip tap ${JSON.stringify(reach)}`);
      assert.equal(reach.hit, reach.id, `${viewport.name}: ${reach.id} is tappable at its centre`);
    }
    // v1.45: the settled strip position is announced for screen readers.
    await waitFor(`/^Bild ${hub.stripItems} von ${hub.stripItems}/.test(document.querySelector('.museum-hub__strip-announcement')?.textContent ?? '')`, 20_000);
    console.log(`✓ ${viewport.name}: ${hub.stripItems} strip entries glide their artwork on screen and stay tappable`);

    // A finger drag pans the panorama and never opens an artwork.
    const before = await waitForPanSettled();
    const stage = await evaluate(`(() => {
      const rect = document.querySelector('.museum-hub').getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height * 0.45 };
    })()`);
    const direction = before > 0 ? -1 : 1;
    await drag(stage.x - direction * 90, stage.x + direction * 90, stage.y);
    const after = await waitForPanSettled();
    assert.ok(Math.abs(after - before) > 20, `${viewport.name}: a finger drag pans the hub (${before} → ${after})`);
    await delay(600);
    assert.equal(
      await evaluate("!!document.querySelector('.museum-hub:not([hidden])') && !document.querySelector('.museum-hub').classList.contains('is-leaving')"),
      true,
      `${viewport.name}: releasing a drag over artwork does not open the gallery`
    );
    const stripSynced = await evaluate(`(() => {
      const centered = document.querySelector('.museum-hub__strip-item.is-centered');
      const focused = document.querySelectorAll('.museum-hub__artwork.is-strip-focus');
      return !!centered && focused.length === 1;
    })()`);
    assert.ok(stripSynced, `${viewport.name}: after a drag exactly one artwork is strip-focused and its thumbnail centred`);
    console.log(`✓ ${viewport.name}: drag pans (${before.toFixed(0)} → ${after.toFixed(0)} px) without opening`);

    if (!viewport.gallery) continue;

    // Open the centred artwork (a second strip tap opens it) and measure chrome coverage.
    const centered = await evaluate(`(() => {
      const rect = document.querySelector('.museum-hub__strip-item.is-centered').getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()`);
    await tap(centered.x, centered.y);
    await delay(400);
    if (await evaluate("!!document.querySelector('.museum-hub:not([hidden])')")) await tap(centered.x, centered.y);
    await waitFor("!!document.querySelector('.timeline') && document.querySelector('.museum-hub')?.hidden !== false", 90_000);
    await delay(2_500);
    await capture(`${viewport.name}-gallery.png`);
    const chrome = await evaluate(`(() => {
      const rectOf = (selector) => {
        const el = document.querySelector(selector);
        if (!el || el.hidden || el.getClientRects().length === 0) return null;
        const style = getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || Number.parseFloat(style.opacity) < 0.05) return null;
        return { selector, ...el.getBoundingClientRect().toJSON() };
      };
      const floating = ['.audio-controls', '.prefs__trigger', '.fullscreen-btn', '.topbar__help-btn',
        '.topbar__chrome-btn', '.topbar__room-view-btn', '.topbar__back-btn:not(.topbar__room-view-btn)',
        '.phone-menu__toggle'].map(rectOf).filter(Boolean);
      const topbar = document.querySelector('.topbar').getBoundingClientRect();
      const timeline = document.querySelector('.timeline').getBoundingClientRect();
      const topCover = Math.max(topbar.bottom, ...floating.map((rect) => rect.bottom));
      return {
        viewport: { width: innerWidth, height: innerHeight },
        floating,
        topCover,
        bottomCover: innerHeight - timeline.top,
      };
    })()`);
    const share = (chrome.topCover + chrome.bottomCover) / chrome.viewport.height;
    assert.ok(
      share <= MAX_PORTRAIT_CHROME_SHARE,
      `${viewport.name}: gallery chrome covers ${(share * 100).toFixed(1)} % of the height (max ${MAX_PORTRAIT_CHROME_SHARE * 100} %)`
    );
    for (const rect of chrome.floating) {
      assert.ok(
        rect.left >= 0 && rect.right <= chrome.viewport.width && rect.top >= 0,
        `${viewport.name}: ${rect.selector} stays inside the viewport (${JSON.stringify(rect)})`
      );
    }
    for (let a = 0; a < chrome.floating.length; a += 1) {
      for (let b = a + 1; b < chrome.floating.length; b += 1) {
        const first = chrome.floating[a];
        const second = chrome.floating[b];
        const overlapX = Math.min(first.right, second.right) - Math.max(first.left, second.left);
        const overlapY = Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top);
        assert.ok(
          overlapX <= 1 || overlapY <= 1,
          `${viewport.name}: ${first.selector} and ${second.selector} do not overlap`
        );
      }
    }
    console.log(`✓ ${viewport.name}: gallery chrome covers ${(share * 100).toFixed(1)} % with ${chrome.floating.length} non-overlapping controls`);

    // Phone "more" menu: utilities collapse behind one topbar button.
    const menuClosed = await evaluate(`(() => {
      const toggle = document.querySelector('.topbar .phone-menu__toggle');
      const panel = document.querySelector('.phone-menu__panel');
      return {
        toggleInTopbar: !!toggle && toggle.getClientRects().length > 0,
        panelHidden: !!panel?.hidden,
        utilitiesInPanel: ['.audio-controls', '.prefs', '.fullscreen-btn', '.topbar__help-btn']
          .every((selector) => panel?.contains(document.querySelector(selector))),
      };
    })()`);
    assert.deepEqual(
      menuClosed,
      { toggleInTopbar: true, panelHidden: true, utilitiesInPanel: true },
      `${viewport.name}: audio, settings, fullscreen and help sit in the closed phone menu`
    );
    const toggleCenter = await evaluate(`(() => {
      const rect = document.querySelector('.phone-menu__toggle').getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()`);
    await tap(toggleCenter.x, toggleCenter.y);
    await waitFor("document.querySelector('.phone-menu__panel')?.hidden === false", 5_000);
    // Measure after the open animation (its scale would shrink the rects).
    await settleAnimations('.phone-menu__panel');
    await capture(`${viewport.name}-menu.png`);
    const menuOpen = await evaluate(`(() => {
      const panel = document.querySelector('.phone-menu__panel').getBoundingClientRect();
      const items = [...document.querySelector('.phone-menu__panel').children]
        .filter((el) => el.getClientRects().length > 0)
        .map((el) => el.getBoundingClientRect().toJSON());
      return {
        expanded: document.querySelector('.phone-menu__toggle').getAttribute('aria-expanded'),
        panel: panel.toJSON(),
        items,
        viewportWidth: innerWidth,
      };
    })()`);
    assert.equal(menuOpen.expanded, 'true', `${viewport.name}: the menu toggle reports aria-expanded`);
    assert.ok(menuOpen.items.length >= 3, `${viewport.name}: the open menu shows its controls (${menuOpen.items.length})`);
    assert.ok(
      menuOpen.panel.left >= 0 && menuOpen.panel.right <= menuOpen.viewportWidth,
      `${viewport.name}: the open menu stays on screen (${JSON.stringify(menuOpen.panel)})`
    );
    for (const item of menuOpen.items) {
      assert.ok(item.width >= 44 && item.height >= 44, `${viewport.name}: menu controls keep 44 px touch targets`);
    }
    const prefsTrigger = await evaluate(`(() => {
      const rect = document.querySelector('.phone-menu__panel .prefs__trigger').getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()`);
    await tap(prefsTrigger.x, prefsTrigger.y);
    await waitFor("document.querySelector('.phone-menu__panel .prefs__panel')?.hidden === false", 5_000);
    await settleAnimations('.phone-menu__panel .prefs__panel');
    const prefsPanel = await evaluate(
      "document.querySelector('.phone-menu__panel .prefs__panel').getBoundingClientRect().toJSON()"
    );
    assert.ok(
      prefsPanel.left >= 0 && prefsPanel.right <= menuOpen.viewportWidth && prefsPanel.bottom <= chrome.viewport.height,
      `${viewport.name}: settings opened from the menu stay on screen (${JSON.stringify(prefsPanel)})`
    );
    // Outside both popovers: left of the right-aligned settings panel.
    await tap(Math.max(8, prefsPanel.left / 2), chrome.viewport.height * 0.5);
    await waitFor("document.querySelector('.phone-menu__panel')?.hidden === true", 5_000);
    assert.equal(
      await evaluate("document.querySelector('.prefs__panel').hidden"),
      true,
      `${viewport.name}: an outside tap also closes settings opened from the menu`
    );
    console.log(`✓ ${viewport.name}: phone menu opens with ${menuOpen.items.length} controls and closes on an outside tap`);

    // v1.46 (C4): a single tap on the artwork hides topbar and timeline together
    // and the artwork refits to the freed height; another tap brings them back.
    const lastUsableHeight = () => evaluate(`(() => {
      const refits = (window.__FREYRAUM_DIAGNOSTICS__?.getEntries?.() ?? [])
        .filter((entry) => entry.event === 'viewport-refit');
      return refits.at(-1)?.data?.viewport?.usableH ?? null;
    })()`);
    const chromeHidden = () => evaluate(`(() => ['.topbar', '.timeline'].map((selector) => {
      const style = getComputedStyle(document.querySelector(selector));
      return style.visibility === 'hidden' && style.pointerEvents === 'none';
    }))()`);
    const usableBefore = await lastUsableHeight();
    await delay(400);
    await tap(chrome.viewport.width * 0.5, chrome.viewport.height * 0.45);
    await waitFor("document.documentElement.dataset.phoneImmersive === 'true'", 5_000);
    await settleAnimations('.topbar');
    await settleAnimations('.timeline');
    await delay(400);
    assert.deepEqual(await chromeHidden(), [true, true], `${viewport.name}: a tap hides topbar and timeline together`);
    const usableImmersive = await lastUsableHeight();
    if (usableBefore !== null && usableImmersive !== null) {
      assert.ok(
        usableImmersive > usableBefore + 80,
        `${viewport.name}: the artwork refits to the freed height (${usableBefore} → ${usableImmersive} px)`
      );
    }
    await capture(`${viewport.name}-immersive.png`);
    await tap(chrome.viewport.width * 0.5, chrome.viewport.height * 0.45);
    await waitFor("document.documentElement.dataset.phoneImmersive !== 'true'", 5_000);
    await settleAnimations('.topbar');
    await settleAnimations('.timeline');
    await delay(400);
    assert.deepEqual(await chromeHidden(), [false, false], `${viewport.name}: a second tap restores the chrome`);
    const usableRestored = await lastUsableHeight();
    if (usableBefore !== null && usableRestored !== null) {
      assert.ok(
        Math.abs(usableRestored - usableBefore) <= 2,
        `${viewport.name}: the restored chrome gives the original artwork height back (${usableRestored} px)`
      );
    }
    console.log(`✓ ${viewport.name}: tap toggles immersive view (usable height ${usableBefore} → ${usableImmersive} → ${usableRestored} px)`);

    // Info bottom sheet: Info reveals it, pulling the handle up pins it open,
    // pulling down collapses and then dismisses it.
    const infoButton = await evaluate(`(() => {
      const rect = document.querySelector('.topbar__chrome-btn').getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()`);
    await tap(infoButton.x, infoButton.y);
    await waitFor("document.querySelector('.info-panel').classList.contains('is-revealed')", 5_000);
    await settleAnimations('.info-panel');
    const handleAt = () => evaluate(`(() => {
      const rect = document.querySelector('.info-panel__handle').getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, height: rect.height };
    })()`);
    const dragY = async (x, fromY, toY, steps = 8) => {
      await touch('touchStart', x, fromY);
      for (let step = 1; step <= steps; step += 1) {
        await delay(16);
        await touch('touchMove', x, fromY + ((toY - fromY) * step) / steps);
      }
      await touch('touchEnd', x, toY);
    };
    let handle = await handleAt();
    assert.ok(handle.width >= 44 && handle.height >= 24, `${viewport.name}: the sheet handle is a usable touch target`);
    await dragY(handle.x, handle.y, handle.y - 90);
    await waitFor("document.querySelector('.info-panel').classList.contains('is-expanded')", 5_000);
    await delay(5_000);
    const expandedSheet = await evaluate(`(() => {
      const panel = document.querySelector('.info-panel');
      const rect = panel.getBoundingClientRect();
      return {
        revealed: panel.classList.contains('is-revealed'),
        opacity: Number.parseFloat(getComputedStyle(panel).opacity),
        pointerEvents: getComputedStyle(panel).pointerEvents,
        ariaExpanded: panel.querySelector('.info-panel__handle').getAttribute('aria-expanded'),
        top: rect.top,
        bottom: rect.bottom,
        timelineTop: document.querySelector('.timeline').getBoundingClientRect().top,
        topbarBottom: document.querySelector('.topbar').getBoundingClientRect().bottom,
      };
    })()`);
    assert.equal(expandedSheet.revealed, true, `${viewport.name}: an expanded sheet stays open past the auto-hide delay`);
    assert.ok(
      expandedSheet.opacity > 0.9 && expandedSheet.pointerEvents !== 'none',
      `${viewport.name}: the revealed sheet is visible and interactive on touch (${JSON.stringify(expandedSheet)})`
    );
    assert.equal(expandedSheet.ariaExpanded, 'true', `${viewport.name}: the handle reports the expanded state`);
    assert.ok(
      expandedSheet.top >= expandedSheet.topbarBottom && expandedSheet.bottom <= expandedSheet.timelineTop,
      `${viewport.name}: the expanded sheet sits between topbar and timeline (${JSON.stringify(expandedSheet)})`
    );
    await capture(`${viewport.name}-info-sheet.png`);
    handle = await handleAt();
    await dragY(handle.x, handle.y, handle.y + 90);
    await waitFor("!document.querySelector('.info-panel').classList.contains('is-expanded')", 5_000);
    assert.equal(
      await evaluate("document.querySelector('.info-panel').classList.contains('is-revealed')"),
      true,
      `${viewport.name}: pulling an expanded sheet down collapses it first`
    );
    await settleAnimations('.info-panel');
    const sheetHeight = () => evaluate("document.querySelector('.info-panel').getBoundingClientRect().height");
    const halfHeight = await sheetHeight();
    assert.equal(
      await evaluate("document.querySelector('.info-panel').dataset.sheetStop"),
      'half',
      `${viewport.name}: the collapsed sheet rests on the half stop`
    );
    // v1.46 (C1): half → peek (title only) → dismissed.
    handle = await handleAt();
    await dragY(handle.x, handle.y, handle.y + 90);
    await waitFor("document.querySelector('.info-panel').dataset.sheetStop === 'peek'", 5_000);
    await settleAnimations('.info-panel');
    const peek = await evaluate(`(() => {
      const panel = document.querySelector('.info-panel');
      const title = panel.querySelector('.info-panel__title').getBoundingClientRect();
      const rect = panel.getBoundingClientRect();
      return {
        revealed: panel.classList.contains('is-revealed'),
        height: rect.height,
        titleInside: title.top >= rect.top - 1 && title.bottom <= rect.bottom + 1,
        overscroll: getComputedStyle(panel).overscrollBehaviorY,
      };
    })()`);
    assert.ok(
      peek.revealed && peek.height < halfHeight - 20 && peek.titleInside,
      `${viewport.name}: the peek stop is smaller than half and still shows the title (${JSON.stringify({ ...peek, halfHeight })})`
    );
    assert.equal(peek.overscroll, 'contain', `${viewport.name}: sheet scrolling does not chain to the page`);
    handle = await handleAt();
    await dragY(handle.x, handle.y, handle.y + 90);
    await waitFor("!document.querySelector('.info-panel').classList.contains('is-revealed')", 5_000);
    console.log(`✓ ${viewport.name}: info sheet expands, stays pinned, then steps half → peek → away`);

    // v1.46 (C2): at the fitted zoom a horizontal swipe changes the photo room.
    await evaluate("document.querySelector('.topbar__room-view-btn').click()");
    await waitFor("!document.querySelector('.gallery-room-view').hidden", 10_000);
    const roomState = () => evaluate(`(() => {
      const select = document.querySelector('.gallery-room-view__select');
      const scene = document.querySelector('.gallery-room-view__scene');
      return { index: select.selectedIndex, count: select.options.length, transform: getComputedStyle(scene).transform };
    })()`);
    const roomSettled = async (index) => {
      const deadline = Date.now() + 10_000;
      while (Date.now() < deadline) {
        const state = await roomState();
        if (state.index === index && (state.transform === 'none' || state.transform === 'matrix(1, 0, 0, 1, 0, 0)')) return state;
        await delay(200);
      }
      throw new Error(`${viewport.name}: photo room did not settle on room ${index} (${JSON.stringify(await roomState())})`);
    };
    const startRoom = await roomState();
    assert.ok(startRoom.count >= 2, `${viewport.name}: several photo rooms are configured`);
    const swipeY = viewport.height * 0.45;
    await drag(viewport.width * 0.8, viewport.width * 0.2, swipeY);
    await roomSettled(startRoom.index + 1);
    await drag(viewport.width * 0.2, viewport.width * 0.8, swipeY);
    await roomSettled(startRoom.index);
    // The first room has no left neighbour: the swipe springs back.
    await evaluate("(() => { const s = document.querySelector('.gallery-room-view__select'); s.selectedIndex = 0; s.dispatchEvent(new Event('change')); })()");
    await roomSettled(0);
    await drag(viewport.width * 0.2, viewport.width * 0.8, swipeY);
    await roomSettled(0);
    await evaluate("document.querySelector('.gallery-room-view__back')?.click()");
    console.log(`✓ ${viewport.name}: photo-room swipe changes rooms and springs back at the first room`);
  }
  console.log('PASS: mobile hub panorama, strip, drag safety, theme-color, phone chrome coverage, phone menu and info sheet.');
} finally {
  socket?.close();
  if (chrome && chrome.exitCode === null && chrome.signalCode === null) {
    chrome.kill('SIGTERM');
    await Promise.race([once(chrome, 'exit'), delay(5000)]);
  }
  await delay(500);
  rmSync(tempProfile, { recursive: true, force: true, maxRetries: 30, retryDelay: 200 });
}
