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
const previewUrl = process.env.FREYRAUM_ROOM_VIEW_URL
  || pathToFileURL(resolve(ROOT, 'index.html')).href;
const captureDir = process.env.FREYRAUM_ROOM_VIEW_CAPTURE_DIR;
if (captureDir) mkdirSync(captureDir, { recursive: true });

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
  const capture = async (filename) => {
    if (!captureDir) return;
    await evaluate('new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
    const screenshot = await command('Page.captureScreenshot', { format: 'png', fromSurface: true });
    writeFileSync(join(captureDir, filename), Buffer.from(screenshot.data, 'base64'));
  };
  const readArtworkScreenCenter = () => evaluate(`(() => {
    const frame = document.querySelector('.gallery-room-view__artwork-frame');
    const scene = document.querySelector('.gallery-room-view__scene');
    const image = frame.querySelector('img');
    const matrix = frame.style.transform.slice(9, -1).split(',').map(Number);
    const x = image.naturalWidth / 2;
    const y = image.naturalHeight / 2;
    const denominator = matrix[3] * x + matrix[7] * y + matrix[15];
    const localX = (matrix[0] * x + matrix[4] * y + matrix[12]) / denominator;
    const localY = (matrix[1] * x + matrix[5] * y + matrix[13]) / denominator;
    const [translation, scaleText] = scene.style.transform.split(' scale(');
    const [offsetX, offsetY] = translation.slice('translate3d('.length, -1).split(', ').map(Number.parseFloat);
    const scale = Number.parseFloat(scaleText);
    return {
      x: offsetX + localX * scale,
      y: offsetY + localY * scale,
      scale,
      offsetX,
      offsetY,
      viewport: { width: innerWidth, height: innerHeight },
    };
  })()`);
  const sampleArtworkCenterPath = (frameCount = 36) => evaluate(`new Promise((resolve) => {
    const samples = [];
    let frameNumber = 0;
    const tick = () => {
      if (frameNumber % 2 === 0) {
        const frame = document.querySelector('.gallery-room-view__artwork-frame');
        const scene = document.querySelector('.gallery-room-view__scene');
        const image = frame.querySelector('img');
        const matrix = frame.style.transform.slice(9, -1).split(',').map(Number);
        const x = image.naturalWidth / 2;
        const y = image.naturalHeight / 2;
        const denominator = matrix[3] * x + matrix[7] * y + matrix[15];
        const localX = (matrix[0] * x + matrix[4] * y + matrix[12]) / denominator;
        const localY = (matrix[1] * x + matrix[5] * y + matrix[13]) / denominator;
        const [translation, scaleText] = scene.style.transform.split(' scale(');
        const [offsetX, offsetY] = translation.slice('translate3d('.length, -1).split(', ').map(Number.parseFloat);
        const scale = Number.parseFloat(scaleText);
        samples.push({
          x: offsetX + localX * scale,
          y: offsetY + localY * scale,
          scale,
          offsetX,
          offsetY,
          viewport: { width: innerWidth, height: innerHeight },
        });
      }
      frameNumber += 1;
      if (frameNumber >= ${frameCount}) resolve(samples);
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  })()`);
  const maxPathDeviation = (samples, target) => {
    const start = samples[0];
    const dx = target.x - start.x;
    const dy = target.y - start.y;
    const length = Math.hypot(dx, dy);
    if (length < 1) return 0;
    return Math.max(...samples.map((point) => Math.abs(
      dx * (point.y - start.y) - dy * (point.x - start.x)
    ) / length));
  };
  const waitForArtworkCenter = async (timeoutMs = 10_000) => {
    const deadline = Date.now() + timeoutMs;
    let latestCenter;
    let previousTransform = '';
    let stableFrames = 0;
    while (Date.now() < deadline) {
      const center = await readArtworkScreenCenter();
      latestCenter = center;
      const transform = await evaluate("document.querySelector('.gallery-room-view__scene').style.transform");
      stableFrames = transform === previousTransform ? stableFrames + 1 : 0;
      previousTransform = transform;
      if (stableFrames >= 3
        && Math.abs(center.x - center.viewport.width / 2) < 2
        && Math.abs(center.y - center.viewport.height / 2)
          < Math.max(2, center.viewport.height * 0.03)) return center;
      await delay(100);
    }
    throw new Error(`Timed out waiting for the photo-room artwork to recenter: ${JSON.stringify(latestCenter)}`);
  };
  const waitFor = async (expression, timeoutMs = 20_000) => {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      if (await evaluate(expression)) return;
      await delay(200);
    }
    const camera = await evaluate(
      "document.querySelector('.gallery-room-view__scene')?.style.transform ?? null"
    );
    throw new Error(`Timed out waiting for ${expression}; camera=${camera}`);
  };

  await command('Page.enable');
  await command('Runtime.enable');
  await command('Page.navigate', { url: previewUrl });
  await waitFor("location.pathname.endsWith('/customer-preview/app.html') && !!document.querySelector('.loading-start-btn')", 30_000);
  await waitFor("!document.querySelector('.loading-start-btn').disabled", 60_000);
  await evaluate("document.querySelector('.loading-start-btn').click()");
  await waitFor("!!document.querySelector('.museum-hub:not([hidden])')", 30_000);
  await waitFor("!!document.querySelector('.museum-hub__artwork')", 30_000);
  await waitFor(`(() => {
    const image = document.querySelector('.museum-hub__art');
    return Boolean(image && image.complete && image.naturalWidth > 0);
  })()`, 30_000);
  const hubButtonLabel = await evaluate(
    "document.querySelector('.topbar__room-view-btn').getAttribute('aria-label')"
  );
  assert.equal(hubButtonLabel, 'Fotoraum mit Wandbildern öffnen', 'room-view entry clearly names the photo room');
  for (const [width, height, mobile] of [[1440, 900, false], [390, 844, true]]) {
    await command('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile,
    });
    const shadow = await evaluate(`(() => {
      const button = document.querySelector('.museum-hub__artwork');
      const path = document.querySelector(\`.museum-hub__shadow-path[data-slot-id="\${button.dataset.slotId}"]\`);
      const svg = path?.ownerSVGElement;
      return {
        path: path?.getAttribute('d') ?? '',
        filter: path ? getComputedStyle(path).filter : '',
        pointerEvents: path ? getComputedStyle(path).pointerEvents : '',
        buttonFilter: getComputedStyle(button).filter,
        clipPath: button.style.clipPath,
        stage: (() => { const rect = document.querySelector('.museum-hub__stage').getBoundingClientRect();
          return { width: rect.width, height: rect.height }; })(),
        shadowLayer: svg ? (() => { const rect = svg.getBoundingClientRect();
          return { width: rect.width, height: rect.height }; })() : null,
      };
    })()`);
    assert.match(shadow.path, /^M.+Z$/, `hub shadow has a projected path at ${width}x${height}`);
    assert.match(shadow.filter, /drop-shadow/, 'unclipped shadow layer renders layered wall shadows');
    assert.equal(shadow.pointerEvents, 'none', 'shadow layer cannot change artwork click targets');
    assert.equal(shadow.buttonFilter, 'none', 'clipped artwork button no longer owns the shadow filter');
    assert.ok(shadow.clipPath.startsWith('polygon('), 'artwork keeps its exact projective hit-area clip');
    assert.ok(shadow.shadowLayer.width > 0 && shadow.shadowLayer.height > 0, 'shadow SVG spans the room stage');
    assert.ok(shadow.stage.width > 0 && shadow.stage.height > 0);
    if (width === 1440) {
      await command('Emulation.setEmulatedMedia', {
        features: [
          { name: 'hover', value: 'hover' },
          { name: 'pointer', value: 'fine' },
        ],
      });
      const baselineFilter = shadow.filter;
      await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork');
        button.dispatchEvent(new PointerEvent('pointerenter', {
          pointerType: 'mouse',
          bubbles: false,
        }));
      })()`);
      await delay(350);
      const hoveredShadow = await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork');
        const path = document.querySelector(\`.museum-hub__shadow-path[data-slot-id="\${button.dataset.slotId}"]\`);
        return { filter: getComputedStyle(path).filter, hovered: path.classList.contains('is-hovered') };
      })()`);
      assert.equal(hoveredShadow.hovered, true, 'fine-pointer hover marks only the matching projected shadow');
      assert.notEqual(hoveredShadow.filter, baselineFilter, 'hover smoothly intensifies the matching wall shadow');
      await capture(`hub-${width}x${height}-hovered.png`);
      await evaluate("document.querySelector('.museum-hub__artwork').focus()");
      await delay(350);
      const focusedShadow = await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork');
        const path = document.querySelector(\`.museum-hub__shadow-path[data-slot-id="\${button.dataset.slotId}"]\`);
        return { focused: path.classList.contains('is-focused'), filter: getComputedStyle(path).filter };
      })()`);
      assert.equal(focusedShadow.focused, true, 'keyboard focus reaches the matching projected shadow');
      assert.notEqual(focusedShadow.filter, baselineFilter, 'keyboard focus receives the same shadow feedback');
      const selectedFilter = await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork');
        const path = document.querySelector(\`.museum-hub__shadow-path[data-slot-id="\${button.dataset.slotId}"]\`);
        button.classList.add('is-selected');
        path.classList.add('is-selected');
        return getComputedStyle(path).filter;
      })()`);
      assert.notEqual(selectedFilter, hoveredShadow.filter, 'selected shadow treatment takes precedence over hover');
      await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork');
        const path = document.querySelector(\`.museum-hub__shadow-path[data-slot-id="\${button.dataset.slotId}"]\`);
        button.classList.remove('is-selected');
        path.classList.remove('is-selected', 'is-hovered', 'is-focused');
        button.blur();
      })()`);
      await command('Emulation.setEmulatedMedia', {
        features: [
          { name: 'hover', value: 'none' },
          { name: 'pointer', value: 'coarse' },
        ],
      });
      await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork');
        button.dispatchEvent(new PointerEvent('pointerenter', {
          pointerType: 'touch',
          bubbles: false,
        }));
      })()`);
      await delay(350);
      const touchShadow = await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork');
        const path = document.querySelector(\`.museum-hub__shadow-path[data-slot-id="\${button.dataset.slotId}"]\`);
        return { filter: getComputedStyle(path).filter };
      })()`);
      assert.equal(touchShadow.filter, baselineFilter, 'touch-only hover does not intensify artwork shadows');
      await command('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
      });
      const reducedMotion = await evaluate(
        "getComputedStyle(document.querySelector('.museum-hub__shadow-path')).transitionDuration"
      );
      assert.ok(
        reducedMotion.split(',').every((duration) => Number.parseFloat(duration) === 0),
        'reduced motion removes the shadow transition'
      );
      await command('Emulation.setEmulatedMedia', { features: [] });
      console.log('✓ hub artwork hover, keyboard focus, selected precedence, touch, and reduced motion');
    }
    await capture(`hub-${width}x${height}-ordinary.png`);
    await evaluate(`(() => {
      const button = document.querySelector('.museum-hub__artwork');
      button.classList.add('is-selected');
      const path = document.querySelector(\`.museum-hub__shadow-path[data-slot-id="\${button.dataset.slotId}"]\`);
      if (!getComputedStyle(path).filter.includes('drop-shadow')) throw new Error('selected artwork shadow disappeared');
    })()`);
    await capture(`hub-${width}x${height}-selected.png`);
    await evaluate("document.querySelector('.museum-hub__artwork').classList.remove('is-selected')");
    console.log(`✓ projected hub shadow remains visible and non-interactive at ${width}x${height}`);
  }
  await command('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await evaluate("document.querySelector('.museum-hub__destination:not([disabled])')?.click()");
  await waitFor("document.querySelector('#app').dataset.experience === 'gallery'", 30_000);
  const roomEntry = await evaluate(`(() => {
    const button = document.querySelector('.topbar__room-view-btn');
    const label = [...button.querySelectorAll('span')].find((span) => getComputedStyle(span).display !== 'none')?.textContent.trim();
    return { label, pressed: button.getAttribute('aria-pressed'),
      emphasis: getComputedStyle(button).borderColor };
  })()`);
  assert.equal(roomEntry.pressed, 'false', 'room-view entry exposes its inactive state');
  assert.ok(
    roomEntry.label === 'Fotoraum' || roomEntry.label === 'Raum',
    'room-view entry has a recognizable visible full or compact label'
  );
  const entryModes = await evaluate(`(() => {
    const button = document.querySelector('.topbar__room-view-btn');
    const root = document.documentElement;
    const oldChrome = root.dataset.chromeMode;
    const oldPresentation = root.dataset.presentation;
    const oldLayoutTier = root.dataset.layoutTier;
    root.dataset.chromeMode = 'clean';
    const cleanDisplay = getComputedStyle(button).display;
    root.dataset.chromeMode = 'visible';
    const visibleDisplay = getComputedStyle(button).display;
    root.dataset.presentation = 'on';
    const presentationDisplay = getComputedStyle(button).display;
    root.dataset.presentation = oldPresentation ?? '';
    root.dataset.chromeMode = oldChrome ?? '';
    root.dataset.layoutTier = 'phone-portrait';
    const shortLabelVisible = getComputedStyle(button.querySelector('.topbar__back-btn-label--short')).display !== 'none';
    root.dataset.layoutTier = oldLayoutTier ?? '';
    const rect = button.getBoundingClientRect();
    return { cleanDisplay, visibleDisplay, presentationDisplay, shortLabelVisible, width: rect.width };
  })()`);
  assert.ok(
    [entryModes.cleanDisplay, entryModes.visibleDisplay, entryModes.presentationDisplay].every((display) => display !== 'none'),
    'primary room-view entry remains discoverable in clean, visible-chrome, and presentation modes'
  );
  assert.equal(entryModes.shortLabelVisible, true, 'room-view entry keeps a visible label on compact phones');
  assert.ok(entryModes.width > 0, 'primary room-view entry has a visible touch target');
  await evaluate("document.querySelector('.topbar__room-view-btn').click()");
  await waitFor("!document.querySelector('.gallery-room-view').hidden", 5000);
  const activeRoomEntry = await evaluate(`(() => {
    const button = document.querySelector('.topbar__room-view-btn');
    const label = [...button.querySelectorAll('span')].find((span) => getComputedStyle(span).display !== 'none')?.textContent.trim();
    return { label, pressed: button.getAttribute('aria-pressed'),
      emphasis: getComputedStyle(button).borderColor };
  })()`);
  assert.equal(activeRoomEntry.pressed, 'true', 'room-view toggle exposes its active state');
  assert.ok(
    activeRoomEntry.label === 'Fotoraum aktiv' || activeRoomEntry.label === 'Raum aktiv',
    'active toggle exposes the active room-view state in full or compact form'
  );
  assert.notEqual(activeRoomEntry.emphasis, roomEntry.emphasis, 'active room-view control has a distinct visual state');
  const controls = await evaluate(`(() => {
    const root = document.querySelector('.gallery-room-view');
    return {
      roomLabel: root.querySelector('.gallery-room-view__room-label').textContent,
      frameRole: root.querySelector('.gallery-room-view__artwork-frame').getAttribute('role'),
      frameFocusable: root.querySelector('.gallery-room-view__artwork-frame').tabIndex === 0,
      returnLabel: root.querySelector('.gallery-room-view__back').getAttribute('aria-label'),
      audioControlInsideOverlay: Boolean(root.querySelector('.gallery-room-view__utilities .audio-controls')),
      settingsLabel: root.querySelector('.gallery-room-view__utilities .prefs__trigger')?.getAttribute('aria-label'),
      fullscreenLabel: root.querySelector('.gallery-room-view__utilities .fullscreen-btn')?.getAttribute('aria-label'),
      contextualHelp: root.querySelector('.gallery-room-view__utilities .topbar__help-btn')?.getAttribute('aria-label'),
      timelineIsShared: root.querySelector('.timeline') === document.querySelector('#app .timeline'),
    };
  })()`);
  assert.deepEqual(controls, {
    roomLabel: 'Raum',
    frameRole: 'img',
    frameFocusable: true,
    returnLabel: 'Zurück zur Galerie',
    audioControlInsideOverlay: true,
    settingsLabel: 'Einstellungen öffnen',
    fullscreenLabel: 'Vollbild umschalten',
    contextualHelp: 'Tastaturkürzel anzeigen',
    timelineIsShared: true,
  });
  const utilityBounds = await evaluate(`(() => {
    const rect = document.querySelector('.gallery-room-view__utilities').getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      viewport: [innerWidth, innerHeight],
    };
  })()`);
  assert.ok(
    utilityBounds.left >= 0 && utilityBounds.top >= 0
      && utilityBounds.right <= utilityBounds.viewport[0] && utilityBounds.bottom <= utilityBounds.viewport[1],
    `room utility controls remain within the viewport (${JSON.stringify(utilityBounds)})`
  );
  assert.ok(
    await evaluate(`(() => {
      const bounds = (selector) => document.querySelector(selector).getBoundingClientRect();
      const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      return !overlaps(bounds('.gallery-room-view__header'), bounds('.gallery-room-view__utilities'))
        && !overlaps(bounds('.timeline'), bounds('.gallery-room-view__zoom-controls'));
    })()`),
    'room header/utilities and timeline/zoom groups do not collide'
  );
  assert.ok(
    await evaluate(`(() => {
      const help = document.querySelector('.gallery-room-view__utilities .topbar__help-btn').getBoundingClientRect();
      return help.width >= 44 && help.height >= 44;
    })()`),
    'contextual help has a touch-sized target'
  );
  await evaluate("document.querySelector('.gallery-room-view__utilities .topbar__help-btn').click()");
  await waitFor("!document.querySelector('.keyboard-help').hidden");
  const roomHelp = await evaluate(`(() => {
    const dialog = document.querySelector('.keyboard-help');
    return {
      title: dialog.querySelector('.keyboard-help__title').textContent,
      rows: [...dialog.querySelectorAll('tbody tr')].map((row) => row.textContent.trim()),
      keycaps: dialog.querySelectorAll('tbody kbd').length,
      focusedControl: document.activeElement.getAttribute('aria-label'),
    };
  })()`);
  assert.equal(roomHelp.title, 'Bedienung im Fotoraum');
  assert.ok(roomHelp.rows.some((row) => row.includes('Mausrad') && row.includes('Kunstwerk')));
  assert.ok(roomHelp.rows.some((row) => row.includes('verschieben') && row.includes('Ziehen')));
  assert.ok(roomHelp.rows.some((row) => row.includes('zurücksetzen') && row.includes('Doppelklick')));
  assert.ok(!roomHelp.rows.some((row) => row.includes('Vorheriges / nächstes Bild') || row.includes('Vollbild')));
  assert.ok(roomHelp.keycaps >= roomHelp.rows.length, 'help presents controls in semantic keycaps');
  assert.equal(roomHelp.focusedControl, 'Hilfe schließen', 'room help initially focuses its close control');
  await evaluate("document.querySelector('.keyboard-help__close').click()");
  assert.equal(
    await evaluate("document.activeElement.getAttribute('aria-label')"),
    'Tastaturkürzel anzeigen',
    'closing contextual help restores focus to its opener'
  );
  await evaluate("document.querySelector('.gallery-room-view .prefs__trigger').click()");
  await waitFor("!document.querySelector('.gallery-room-view .prefs__panel').hidden");
  await evaluate("document.querySelector('.gallery-room-view .prefs__panel input').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))");
  await waitFor("document.querySelector('.gallery-room-view .prefs__panel').hidden");
  assert.equal(
    await evaluate("!document.querySelector('.gallery-room-view').hidden"),
    true,
    'Escape closes settings without leaving the photo room'
  );
  assert.equal(
    await evaluate(`(() => [...document.querySelectorAll('.gallery-room-view__zoom-controls .zoom-controls__btn')]
      .every((button) => {
        const icon = button.querySelector('.zoom-controls__icon');
        const buttonRect = button.getBoundingClientRect();
        const iconRect = icon.getBoundingClientRect();
        return Math.abs(iconRect.left + iconRect.width / 2 - buttonRect.left - buttonRect.width / 2) < 1
          && Math.abs(iconRect.top + iconRect.height / 2 - buttonRect.top - buttonRect.height / 2) < 1;
      }))()`),
    true,
    'room-control icons are centered within their touch targets'
  );

  for (const [roomId, filename] of [
    ['bedroom', 'gallery-bedroom.png'],
    ['wohnraum', 'gallery-wohnraum.png'],
    ['wohn-bereich', 'gallery-wohn-bereich.png'],
    ['buero', 'gallery-buero.png'],
  ]) {
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
      const backgroundStyle = getComputedStyle(background);
      const backgroundRect = background.getBoundingClientRect();
      const sampleElement = document.elementFromPoint(Math.round(innerWidth * 0.08), Math.round(innerHeight * 0.3));
      return {
        decoded: background.naturalWidth > 0,
        source: background.currentSrc,
        display: backgroundStyle.display,
        visibility: backgroundStyle.visibility,
        opacity: backgroundStyle.opacity,
        bounds: [backgroundRect.x, backgroundRect.y, backgroundRect.width, backgroundRect.height],
        sampleElement: sampleElement?.className ?? sampleElement?.tagName,
        status: root.querySelector('.gallery-room-view__status').textContent,
      };
    })()`);
    assert.equal(image.decoded, true, `${roomId} photo decodes in the local preview`);
    assert.equal(image.status, '', `${roomId} photo has no load or projection error`);
    assert.equal(image.display, 'block', `${roomId} photo is visibly rendered`);
    assert.equal(image.visibility, 'visible', `${roomId} photo is not hidden`);
    assert.equal(image.opacity, '1', `${roomId} photo is not transparent`);
    assert.equal(image.sampleElement, 'gallery-room-view__background', `${roomId} photo covers the room scene`);
    console.log(`✓ ${roomId} photo loaded and rendered from ${image.source}`);
  }

  for (const [roomId, width, height] of [
    ['wohn-bereich', 2000, 1080],
    ['bedroom', 1440, 900], ['wohnraum', 1440, 900],
    ['wohn-bereich', 1440, 900], ['buero', 1440, 900],
    ['bedroom', 768, 1024], ['wohnraum', 768, 1024],
    ['wohn-bereich', 768, 1024], ['buero', 768, 1024],
    ['bedroom', 320, 568], ['wohnraum', 320, 568],
    ['wohn-bereich', 320, 568], ['buero', 320, 568],
    ['bedroom', 390, 844], ['wohnraum', 390, 844],
    ['wohn-bereich', 390, 844], ['buero', 390, 844],
    ['bedroom', 390, 320], ['wohnraum', 390, 320],
    ['wohn-bereich', 390, 320], ['buero', 390, 320],
    ['bedroom', 844, 390], ['wohnraum', 844, 390],
    ['wohn-bereich', 844, 390], ['buero', 844, 390],
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
    const filename = {
      bedroom: 'gallery-bedroom.png',
      wohnraum: 'gallery-wohnraum.png',
      'wohn-bereich': 'gallery-wohn-bereich.png',
      buero: 'gallery-buero.png',
    }[roomId];
    await waitFor(
      `(() => {
        const background = document.querySelector('.gallery-room-view__background');
        return background.complete && background.naturalWidth > 0
          && background.currentSrc.endsWith('/${filename}');
      })()`,
      20_000
    );
    await evaluate(`document.querySelector('.gallery-room-view [aria-label="Fotoansicht zurücksetzen"]').click()`);
    await waitFor(
      "document.querySelector('.gallery-room-view__scene').style.transform === 'translate3d(0px, 0px, 0px) scale(1)'",
      10_000
    );
    await delay(100);
    const layout = await evaluate(`(() => {
      const root = document.querySelector('.gallery-room-view');
      const art = root.querySelector('.gallery-room-view__artwork-frame').getBoundingClientRect();
      const controls = root.querySelector('.gallery-room-view__header').getBoundingClientRect();
      const timeline = root.querySelector('.timeline').getBoundingClientRect();
      const zoom = root.querySelector('.gallery-room-view__zoom-controls').getBoundingClientRect();
      const utilities = root.querySelector('.gallery-room-view__utilities').getBoundingClientRect();
      const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      return {
        viewport: [innerWidth, innerHeight],
        art: { x: art.x, y: art.y, width: art.width, height: art.height },
        controls: { x: controls.x, y: controls.y, width: controls.width, height: controls.height },
        timeline: { x: timeline.x, y: timeline.y, width: timeline.width, height: timeline.height },
        zoom: { x: zoom.x, y: zoom.y, width: zoom.width, height: zoom.height },
        utilities: { x: utilities.x, y: utilities.y, width: utilities.width, height: utilities.height },
        headerUtilitiesOverlap: overlaps(controls, utilities),
        timelineZoomOverlap: overlaps(timeline, zoom),
      };
    })()`);
    const controls = layout.controls;
    const utilities = layout.utilities;
    assert.ok(
      layout.art.x >= -1 && layout.art.y >= -1
        && layout.art.x + layout.art.width <= width + 1
        && layout.art.y + layout.art.height <= height + 1,
      `${roomId} complete artwork remains visible at ${width}x${height}`
    );
    for (const [name, bounds] of Object.entries({ controls, timeline: layout.timeline, zoom: layout.zoom })) {
      assert.ok(bounds.x >= 0 && bounds.y >= 0
        && bounds.x + bounds.width <= width && bounds.y + bounds.height <= height,
      `${roomId} ${name} remains on screen at ${width}x${height}`);
    }
    assert.ok(utilities.x >= 0 && utilities.y >= 0
      && utilities.x + utilities.width <= width && utilities.y + utilities.height <= height,
    `${roomId} utility controls remain on screen at ${width}x${height}`);
    assert.equal(layout.headerUtilitiesOverlap, false,
      `${roomId} header and utility groups do not collide at ${width}x${height}`);
    assert.equal(layout.timelineZoomOverlap, false,
      `${roomId} timeline and zoom groups do not collide at ${width}x${height}`);
    await capture(`room-${roomId}-${width}x${height}.png`);
    console.log(`✓ ${roomId} controls clear at ${width}x${height}`);
    if (width <= 420 || height <= 420) {
      await evaluate("document.querySelector('.gallery-room-view__utilities .topbar__help-btn').click()");
      const helpBounds = await evaluate(`(() => {
        const panel = document.querySelector('.keyboard-help__panel').getBoundingClientRect();
        return { left: panel.left, top: panel.top, right: panel.right, bottom: panel.bottom };
      })()`);
      assert.ok(
        helpBounds.left >= 0 && helpBounds.top >= 0
          && helpBounds.right <= width && helpBounds.bottom <= height,
        `contextual help fits the ${width}x${height} viewport (${JSON.stringify(helpBounds)})`
      );
      await evaluate("document.querySelector('.keyboard-help__close').click()");
    }
  }

  await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await evaluate(`document.querySelector('.gallery-room-view__select').value = 'wohnraum'`);
  await evaluate(`document.querySelector('.gallery-room-view__select').dispatchEvent(new Event('change',{bubbles:true}))`);

  const initialArtwork = await evaluate("document.querySelector('.gallery-room-view__artwork').currentSrc");
  await evaluate(`document.querySelector('.gallery-room-view .timeline__thumb[data-index="1"]').click()`);
  await waitFor(`document.querySelector('.gallery-room-view__artwork').complete
    && document.querySelector('.gallery-room-view__artwork').currentSrc !== ${JSON.stringify(initialArtwork)}`);
  const nextArtwork = await evaluate(`(() => {
    const image = document.querySelector('.gallery-room-view__artwork');
    return { source: image.currentSrc, decoded: image.naturalWidth > 0 };
  })()`);
  assert.equal(nextArtwork.decoded, true, 'next artwork loads in the photo room');
  assert.equal(
    await evaluate(`document.querySelector('.gallery-room-view .timeline__thumb[data-index="1"]').getAttribute('aria-current')`),
    'true',
    'room timeline marks the selected work active'
  );
  await evaluate(`document.querySelector('.gallery-room-view .timeline__thumb[data-index="0"]').click()`);
  await waitFor(`document.querySelector('.gallery-room-view__artwork').complete
    && document.querySelector('.gallery-room-view__artwork').currentSrc === ${JSON.stringify(initialArtwork)}`);
  const artworkDimensions = await evaluate(`(() => {
    const frame = document.querySelector('.gallery-room-view__artwork-frame');
    return [frame.style.width, frame.style.height];
  })()`);
  assert.equal(
    await evaluate(`document.querySelector('.gallery-room-view .timeline__thumb[data-index="0"]').getAttribute('aria-current')`),
    'true',
    'returning to the first work synchronizes the active timeline item'
  );
  console.log('✓ room, shared artwork timeline, camera controls and selection state');

  await evaluate(`document.querySelector('.gallery-room-view [aria-label="Vergrößern"]').click()`);
  await waitFor(`(() => {
    const scale = Number.parseFloat(document.querySelector('.gallery-room-view__scene').style.transform
      .split(' scale(')[1]?.slice(0, -1));
    return scale > 1.001 && scale < 1.25;
  })()`);
  const projectedArtworkTransform = await evaluate(
    "document.querySelector('.gallery-room-view__artwork-frame').style.transform"
  );
  await waitFor("document.querySelector('.gallery-room-view__scene').style.transform.includes('scale(1.25)')");
  let camera = await evaluate("document.querySelector('.gallery-room-view__scene').style.transform");
  assert.match(camera, /scale\(1\.25\)/, 'zoom control zooms the photo camera');
  await waitForArtworkCenter();
  let artworkScreenCenter = await readArtworkScreenCenter();
  assert.ok(
    Math.abs(artworkScreenCenter.x - artworkScreenCenter.viewport.width / 2) < 2
      && Math.abs(artworkScreenCenter.y - artworkScreenCenter.viewport.height / 2)
        < Math.max(2, artworkScreenCenter.viewport.height * 0.03),
    `zoom button centers the projective artwork center in the viewport (${JSON.stringify(artworkScreenCenter)})`
  );
  assert.equal(
    await evaluate("document.querySelector('.gallery-room-view__artwork-frame').style.transform"),
    projectedArtworkTransform,
    'zoom changes the shared photo scene without adding a second transform to artwork'
  );
  assert.deepEqual(
    await evaluate(`(() => {
      const frame = document.querySelector('.gallery-room-view__artwork-frame');
      return [frame.style.width, frame.style.height];
    })()`),
    artworkDimensions,
    'camera zoom does not change the artwork dimensions in its wall coordinate space'
  );
  const wheelFocus = await evaluate(`({ x: Math.round(innerWidth / 2), y: Math.round(innerHeight / 2) })`);
  const beforeWheel = await readArtworkScreenCenter();
  const wheelDeltaY = -100;
  const expectedWheelScale = beforeWheel.scale * Math.exp(-wheelDeltaY * 0.001);
  await command('Input.dispatchMouseEvent', {
    type: 'mouseWheel',
    x: wheelFocus.x,
    y: wheelFocus.y,
    deltaX: 0,
    deltaY: wheelDeltaY,
  });
  await waitFor(`Math.abs(Number(document.querySelector('.gallery-room-view__scene').style.transform
    .split(' scale(')[1]?.slice(0, -1)) - ${expectedWheelScale}) < 0.001`);
  await waitForArtworkCenter();
  const afterWheel = await readArtworkScreenCenter();
  const expectedWheelOffsetX = beforeWheel.viewport.width * 0.5
    - (beforeWheel.x - beforeWheel.offsetX) * expectedWheelScale / beforeWheel.scale;
  const expectedWheelOffsetY = beforeWheel.viewport.height * 0.5
    - (beforeWheel.y - beforeWheel.offsetY) * expectedWheelScale / beforeWheel.scale;
  assert.ok(
    Math.abs(afterWheel.scale - expectedWheelScale) < 0.001
      && Math.abs(afterWheel.offsetX - expectedWheelOffsetX) < 1
      && Math.abs(afterWheel.offsetY - expectedWheelOffsetY) < 1
      && Math.abs(afterWheel.x - afterWheel.viewport.width / 2) < 2
      && Math.abs(afterWheel.y - afterWheel.viewport.height / 2) < 2,
    `wheel zoom eases toward the projected artwork center instead of the pointer: ${JSON.stringify({
      beforeWheel, afterWheel, expectedWheelScale, expectedWheelOffsetX, expectedWheelOffsetY,
    })}`
  );
  await command('Input.dispatchMouseEvent', { type: 'mousePressed', x: 290, y: 500, button: 'left', buttons: 1 });
  await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 230, y: 440, button: 'left', buttons: 1 });
  await command('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 230, y: 440, button: 'left', buttons: 0 });
  camera = await evaluate("document.querySelector('.gallery-room-view__scene').style.transform");
  assert.doesNotMatch(camera, /translate3d\(0px, 0px/, 'drag pans the photo');
  assert.equal(
    await evaluate("document.querySelector('.gallery-room-view__artwork-frame').style.transform"),
    projectedArtworkTransform,
    'panning keeps the artwork projection in the same photo coordinate space'
  );
  await evaluate(`document.querySelector('.gallery-room-view [aria-label="Fotoansicht zurücksetzen"]').click()`);
  await evaluate(`(() => {
    const zoomIn = document.querySelector('.gallery-room-view [aria-label="Vergrößern"]');
    zoomIn.click();
    zoomIn.click();
  })()`);
  await waitFor("document.querySelector('.gallery-room-view__scene').style.transform.includes('scale(1.5625)')");
  await waitForArtworkCenter();
  console.log('✓ interrupted button zoom smoothly retargets without restarting from stale camera state');
  await evaluate(`document.querySelector('.gallery-room-view [aria-label="Fotoansicht zurücksetzen"]').click()`);
  await evaluate(`document.querySelector('.gallery-room-view [aria-label="Vergrößern"]').click()`);
  await waitFor("document.querySelector('.gallery-room-view__scene').style.transform.includes('scale(1.25)')");
  await waitForArtworkCenter();
  await command('Input.dispatchMouseEvent', { type: 'mousePressed', x: 290, y: 500, button: 'left', buttons: 1 });
  await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 230, y: 440, button: 'left', buttons: 1 });
  await command('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 230, y: 440, button: 'left', buttons: 0 });
  const beforeRepeatedZoom = await readArtworkScreenCenter();
  const scaleBeforeRepeatedZoom = beforeRepeatedZoom.scale;
  await evaluate(`document.querySelector('.gallery-room-view [aria-label="Vergrößern"]').click()`);
  const repeatedZoomPath = await sampleArtworkCenterPath();
  const zoomPathDeviation = maxPathDeviation(repeatedZoomPath, {
    x: beforeRepeatedZoom.viewport.width / 2,
    y: beforeRepeatedZoom.viewport.height / 2,
  });
  assert.ok(
    zoomPathDeviation < 2,
    `artwork center follows a straight path during off-center zoom (max deviation ${zoomPathDeviation.toFixed(2)}px)`
  );
  await waitFor(`Math.abs(Number(document.querySelector('.gallery-room-view__scene').style.transform
    .split(' scale(')[1]?.slice(0, -1)) - ${scaleBeforeRepeatedZoom * 1.25}) < 0.001`);
  artworkScreenCenter = await waitForArtworkCenter();
  assert.ok(
    Math.abs(artworkScreenCenter.x - artworkScreenCenter.viewport.width / 2) < 2
      && Math.abs(artworkScreenCenter.y - artworkScreenCenter.viewport.height / 2)
        < Math.max(2, artworkScreenCenter.viewport.height * 0.03),
    'repeated button zoom recenters the artwork after an off-center pan'
  );
  await evaluate(`document.querySelector('.gallery-room-view [aria-label="Fotoansicht zurücksetzen"]').click()`);
  await evaluate(`document.querySelector('.gallery-room-view__room-controls select').value = 'wohnraum';
    document.querySelector('.gallery-room-view__room-controls select').dispatchEvent(new Event('change', { bubbles: true }));`);
  await waitFor("document.querySelector('.gallery-room-view__scene').style.transform === 'translate3d(0px, 0px, 0px) scale(1)'");
  await evaluate(`document.querySelector('.gallery-room-view [aria-label="Vergrößern"]').click()`);
  await waitFor("document.querySelector('.gallery-room-view__scene').style.transform.includes('scale(1.25)')");
  await waitForArtworkCenter();
  artworkScreenCenter = await readArtworkScreenCenter();
  assert.ok(
    Math.abs(artworkScreenCenter.x - artworkScreenCenter.viewport.width / 2) < 2
      && Math.abs(artworkScreenCenter.y - artworkScreenCenter.viewport.height / 2)
        < Math.max(2, artworkScreenCenter.viewport.height * 0.03),
    'zoom button centers the other room artwork using its own projective center'
  );
  const otherRoomBeforeWheel = await readArtworkScreenCenter();
  const otherRoomWheelScale = otherRoomBeforeWheel.scale * Math.exp(0.1);
  const otherRoomWheelPoint = await evaluate(
    `({ x: innerWidth - 80, y: Math.round(innerHeight * 0.38) })`
  );
  await evaluate(`(() => {
    const target = document.elementFromPoint(${otherRoomWheelPoint.x}, ${otherRoomWheelPoint.y});
    target.dispatchEvent(new WheelEvent('wheel', { deltaY: -100, bubbles: true, cancelable: true }));
  })()`);
  await waitFor(`Math.abs(Number(document.querySelector('.gallery-room-view__scene').style.transform
    .split(' scale(')[1]?.slice(0, -1)) - ${otherRoomWheelScale}) < 0.001`);
  const otherRoomAfterWheel = await waitForArtworkCenter();
  assert.ok(
    Math.abs(otherRoomAfterWheel.x - otherRoomAfterWheel.viewport.width / 2) < 2
      && Math.abs(otherRoomAfterWheel.y - otherRoomAfterWheel.viewport.height / 2) < 2,
    `off-center wheel zoom targets the mapped artwork center in the other room (${JSON.stringify({
      before: otherRoomBeforeWheel,
      after: otherRoomAfterWheel,
      wheelPoint: otherRoomWheelPoint,
    })})`
  );
  assert.ok(otherRoomAfterWheel.scale > otherRoomBeforeWheel.scale, 'wheel zoom increases the camera scale in the other room');
  await evaluate(`document.querySelector('.gallery-room-view [aria-label="Fotoansicht zurücksetzen"]').click()`);
  await evaluate(`document.querySelector('.gallery-room-view__room-controls select').value = 'bedroom';
    document.querySelector('.gallery-room-view__room-controls select').dispatchEvent(new Event('change', { bubbles: true }));`);
  await waitFor("document.querySelector('.gallery-room-view__scene').style.transform === 'translate3d(0px, 0px, 0px) scale(1)'");
  const bedroomProjectionTransform = await evaluate(
    "document.querySelector('.gallery-room-view__artwork-frame').style.transform"
  );
  camera = await evaluate("document.querySelector('.gallery-room-view__scene').style.transform");
  assert.match(camera, /translate3d\(0px, 0px, 0px\) scale\(1\)/, 'reset restores the photo camera');
  await evaluate(`(() => {
    const close = document.querySelector('.gallery-room-view__back');
    close.focus();
    close.dispatchEvent(new KeyboardEvent('keydown', { key: '+', bubbles: true }));
  })()`);
  await waitFor("document.querySelector('.gallery-room-view__scene').style.transform.includes('scale(1.25)')");
  camera = await evaluate("document.querySelector('.gallery-room-view__scene').style.transform");
  assert.match(camera, /scale\(1\.25\)/, 'keyboard shortcut zooms without invoking gallery zoom');
  await evaluate(`document.querySelector('.gallery-room-view [aria-label="Fotoansicht zurücksetzen"]').click()`);
  await evaluate(`(() => {
    const zoom = document.querySelector('.gallery-room-view [aria-label="Vergrößern"]');
    for (let index = 0; index < 12; index += 1) zoom.click();
  })()`);
  await waitFor(`Number(document.querySelector('.gallery-room-view__scene').style.transform
    .split(' scale(')[1]?.slice(0, -1)) > 5.9`);
  await evaluate(`(() => {
    const zoom = document.querySelector('.gallery-room-view [aria-label="Vergrößern"]');
    if (!zoom.disabled) zoom.click();
  })()`);
  await waitFor(`Math.abs(Number(document.querySelector('.gallery-room-view__scene').style.transform
    .split(' scale(')[1]?.slice(0, -1)) - 6) < 0.001`);
  const transformAtMaximumZoom = await evaluate(
    "document.querySelector('.gallery-room-view__artwork-frame').style.transform"
  );
  camera = await evaluate("document.querySelector('.gallery-room-view__scene').style.transform");
  assert.match(camera, /scale\(6\)/, 'camera reaches the expanded maximum zoom');
  assert.equal(
    transformAtMaximumZoom,
    bedroomProjectionTransform,
    'maximum zoom keeps wall projection scene-local'
  );
  assert.match(
    await evaluate("getComputedStyle(document.querySelector('.gallery-room-view__artwork')).filter"),
    /drop-shadow/,
    'wall-contact shadows remain present at maximum zoom'
  );
  await evaluate(`document.querySelector('.gallery-room-view [aria-label="Fotoansicht zurücksetzen"]').click()`);
  await waitFor("document.querySelector('.gallery-room-view__scene').style.transform === 'translate3d(0px, 0px, 0px) scale(1)'");
  console.log('✓ photo zoom, drag pan, reset, and keyboard zoom');

  await command('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await delay(150);
  const interaction = await evaluate(`(() => {
    const frame = document.querySelector('.gallery-room-view__artwork-frame');
    const image = frame.querySelector('.gallery-room-view__artwork');
    const bounds = frame.getBoundingClientRect();
    return { x: bounds.left + bounds.width * 0.78, y: bounds.top + bounds.height * 0.3 };
  })()`);
  await command('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: interaction.x,
    y: interaction.y,
  });
  const hover = await evaluate(`(() => {
    const frame = document.querySelector('.gallery-room-view__artwork-frame');
    const image = frame.querySelector('.gallery-room-view__artwork');
    return {
      tilt: image.style.getPropertyValue('--artwork-tilt-y'),
      filter: getComputedStyle(image).filter,
      role: frame.getAttribute('role'),
      label: frame.getAttribute('aria-label'),
    };
  })()`);
  assert.notEqual(hover.tilt, '0deg', 'hover tilts the artwork within the bounded interactive range');
  assert.ok(Math.abs(Number.parseFloat(hover.tilt)) <= 0.2, 'artwork hover tilt stays barely noticeable');
  assert.match(hover.filter, /drop-shadow/, 'artwork has layered wall and contact shadows');
  assert.ok(hover.label.length > 0, 'interactive artwork has an accessible label');
  const nearbyHover = await evaluate(`(() => {
    const frame = document.querySelector('.gallery-room-view__artwork-frame');
    const rect = frame.getBoundingClientRect();
    const x = rect.left > 480 ? rect.left - 450 : rect.right + 450;
    return { x, y: rect.top + rect.height / 2 };
  })()`);
  await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: nearbyHover.x, y: nearbyHover.y });
  const nearbyState = await evaluate(`(() => ({
    point: ${JSON.stringify(nearbyHover)},
    bounds: (() => { const r = document.querySelector('.gallery-room-view__artwork-frame').getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom }; })(),
    inScene: document.querySelector('.gallery-room-view__scene').classList.contains('has-artwork-proximity'),
    tilt: document.querySelector('.gallery-room-view__artwork').style.getPropertyValue('--artwork-tilt-y'),
  }))()`);
  assert.equal(
    nearbyState.inScene,
    true,
    `artwork hover response begins outside its visible bounds (${JSON.stringify(nearbyState)})`
  );
  const nearbyTilt = await evaluate(
    "Number.parseFloat(document.querySelector('.gallery-room-view__artwork').style.getPropertyValue('--artwork-tilt-y'))"
  );
  assert.ok(Math.abs(nearbyTilt) < 0.14, 'proximity tilt remains low amplitude');
  const controlPoint = await evaluate(`(() => {
    const rect = document.querySelector('.gallery-room-view__utilities .topbar__help-btn').getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  })()`);
  await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: controlPoint.x, y: controlPoint.y });
  assert.equal(
    await evaluate("document.querySelector('.gallery-room-view__scene').classList.contains('has-artwork-proximity')"),
    false,
    'moving over utility controls does not activate artwork motion'
  );
  const farPointer = await evaluate(`(() => {
    const rect = document.querySelector('.gallery-room-view__artwork-frame').getBoundingClientRect();
    return { x: 8, y: 8 };
  })()`);
  await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: farPointer.x, y: farPointer.y });
  assert.equal(
    await evaluate("document.querySelector('.gallery-room-view__scene').classList.contains('has-artwork-proximity')"),
    false,
    'hover response returns to neutral outside the influence radius'
  );
  assert.match(
    await evaluate("getComputedStyle(document.querySelector('.gallery-room-view__artwork')).transitionDuration"),
    /1\.1s/,
    'artwork tilt returns with a longer eased transition'
  );
  await waitFor(
    "getComputedStyle(document.querySelector('.gallery-room-view__artwork')).transform === 'none'",
    5000
  );
  assert.equal(
    await evaluate("getComputedStyle(document.querySelector('.gallery-room-view__artwork')).transform"),
    'none',
    'artwork tilt settles back to its original position'
  );

  await evaluate("document.querySelector('.gallery-room-view__back').focus()");
  await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await command('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  assert.equal(
    await evaluate("document.activeElement === document.querySelector('.gallery-room-view__select')"),
    true,
    'keyboard tab order moves from return to the separate room selector'
  );
  await command('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  });
  const reducedMotionTransform = await evaluate(
    "getComputedStyle(document.querySelector('.gallery-room-view__artwork')).transform"
  );
  assert.equal(reducedMotionTransform, 'none', 'reduced motion disables the hover tilt');
  await evaluate(`document.querySelector('.gallery-room-view [aria-label="Vergrößern"]').click()`);
  assert.match(
    await evaluate("document.querySelector('.gallery-room-view__scene').style.transform"),
    /scale\(1\.25\)/,
    'reduced motion skips camera zoom animation'
  );
  await evaluate(`document.querySelector('.gallery-room-view [aria-label="Fotoansicht zurücksetzen"]').click()`);
  await command('Emulation.setEmulatedMedia', { features: [] });
  console.log('✓ bounded artwork hover, keyboard focus, layered shadows, and reduced motion');

  await command('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await command('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 2 });
  const motionBounds = await evaluate(`(() => {
    const button = document.querySelector('.gallery-room-view__motion-toggle');
    const rect = button.getBoundingClientRect();
    return {
      display: getComputedStyle(button).display,
      width: rect.width,
      height: rect.height,
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
    };
  })()`);
  assert.equal(motionBounds.display, 'flex', 'motion tilt is opt-in and visible for coarse-pointer devices');
  assert.ok(motionBounds.width >= 44 && motionBounds.height >= 44,
    'motion tilt has a comfortable touch target');
  assert.ok(motionBounds.left >= 0 && motionBounds.top >= 0
    && motionBounds.right <= 390 && motionBounds.bottom <= 844,
  `motion toggle remains within the phone viewport (${JSON.stringify(motionBounds)})`);
  await evaluate(`(() => {
    const toggle = document.querySelector('.gallery-room-view__motion-toggle');
    Object.defineProperty(window, 'DeviceOrientationEvent', {
      configurable: true,
      value: undefined,
    });
    toggle.click();
  })()`);
  await waitFor("document.querySelector('.gallery-room-view__status').textContent.includes('nicht verfügbar')");
  assert.equal(
    await evaluate("document.querySelector('.gallery-room-view__motion-toggle').getAttribute('aria-pressed')"),
    'false',
    'unavailable orientation sensors leave motion tilt disabled'
  );
  await evaluate(`(() => {
    function MockDeviceOrientationEvent() {}
    MockDeviceOrientationEvent.requestPermission = () => Promise.resolve('denied');
    Object.defineProperty(window, 'DeviceOrientationEvent', {
      configurable: true,
      value: MockDeviceOrientationEvent,
    });
    document.querySelector('.gallery-room-view__motion-toggle').click();
  })()`);
  await waitFor("document.querySelector('.gallery-room-view__status').textContent.includes('nicht erlaubt')");
  assert.equal(
    await evaluate("document.querySelector('.gallery-room-view__motion-toggle').getAttribute('aria-pressed')"),
    'false',
    'denied orientation permission does not enable motion tilt'
  );
  await evaluate(`(() => {
    window.DeviceOrientationEvent.requestPermission = () => Promise.resolve('granted');
    document.querySelector('.gallery-room-view__motion-toggle').click();
  })()`);
  await waitFor("document.querySelector('.gallery-room-view__motion-toggle').getAttribute('aria-pressed') === 'true'");
  await evaluate(`(() => {
    const dispatch = (beta, gamma) => {
      const event = new Event('deviceorientation');
      Object.defineProperties(event, { beta: { value: beta }, gamma: { value: gamma } });
      window.dispatchEvent(event);
    };
    dispatch(0, 0);
    dispatch(12, -7);
  })()`);
  await waitFor(`(() => {
    const image = document.querySelector('.gallery-room-view__artwork');
    return Number.parseFloat(image.style.getPropertyValue('--artwork-tilt-x')) !== 0;
  })()`);
  const motionTilt = await evaluate(`(() => {
    const image = document.querySelector('.gallery-room-view__artwork');
    return [
      Number.parseFloat(image.style.getPropertyValue('--artwork-tilt-x')),
      Number.parseFloat(image.style.getPropertyValue('--artwork-tilt-y')),
    ];
  })()`);
  assert.ok(motionTilt.every((tilt) => Number.isFinite(tilt) && Math.abs(tilt) <= 1.2),
    `sensor tilt stays inside the subtle angle range (${motionTilt})`);
  await evaluate(`(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  })()`);
  assert.equal(
    await evaluate("document.querySelector('.gallery-room-view__artwork').style.getPropertyValue('--artwork-tilt-x')"),
    '0deg',
    'hiding the page immediately clears sensor-driven tilt'
  );
  await evaluate(`(() => {
    delete document.hidden;
    document.dispatchEvent(new Event('visibilitychange'));
    const dispatch = (beta, gamma) => {
      const event = new Event('deviceorientation');
      Object.defineProperties(event, { beta: { value: beta }, gamma: { value: gamma } });
      window.dispatchEvent(event);
    };
    dispatch(0, 0);
    dispatch(8, 0);
  })()`);
  await waitFor(`Number.parseFloat(document.querySelector('.gallery-room-view__artwork')
    .style.getPropertyValue('--artwork-tilt-x')) !== 0`);
  await evaluate("document.documentElement.dataset.motion = 'reduced'");
  await waitFor("document.querySelector('.gallery-room-view__motion-toggle').getAttribute('aria-pressed') === 'false'");
  await evaluate("delete document.documentElement.dataset.motion");
  console.log('✓ opt-in motion tilt handles unavailable, denied, granted, and reduced-motion states');
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
  await evaluate(`(() => {
    const close = document.querySelector('.gallery-room-view__back');
    close.focus();
    close.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  })()`);
  assert.equal(
    await evaluate("document.querySelector('.gallery-room-view').hidden && document.activeElement === document.querySelector('.topbar__room-view-btn')"),
    true,
    'close returns to the gallery and restores focus to the room-view toggle'
  );
  assert.equal(
    await evaluate(`(() => {
      const timeline = document.querySelector('#app > .timeline');
      return Boolean(timeline) && timeline.querySelector('.timeline__thumb[data-index="0"]')?.getAttribute('aria-current') === 'true';
    })()`),
    true,
    'closing the room view restores the same selected timeline to its gallery parent'
  );
  assert.equal(
    await evaluate("document.querySelector('#app > .prefs') !== null && document.querySelector('#app > .fullscreen-btn') !== null"),
    true,
    'shared utility controls return to gallery chrome when the room view closes'
  );
  await evaluate("document.querySelector('.topbar__help-btn').click()");
  await waitFor("!document.querySelector('.keyboard-help').hidden");
  const galleryHelp = await evaluate(`(() => {
    const dialog = document.querySelector('.keyboard-help');
    return { title: dialog.querySelector('.keyboard-help__title').textContent,
      rows: [...dialog.querySelectorAll('tbody tr')].map((row) => row.textContent.trim()) };
  })()`);
  assert.equal(galleryHelp.title, 'Tastaturkürzel', 'gallery help restores the global shortcut context');
  assert.ok(galleryHelp.rows.some((row) => row.includes('Vorheriges / nächstes Bild')));
  assert.ok(galleryHelp.rows.some((row) => row.includes('Vollbild')));
  assert.ok(!galleryHelp.rows.some((row) => row.includes('Mausrad')));
  await evaluate("document.querySelector('.keyboard-help__close').click()");
  console.log('✓ touch pinch and accessible close/focus restoration');
} finally {
  socket?.close();
  if (chrome && chrome.exitCode === null && chrome.signalCode === null) {
    chrome.kill('SIGTERM');
    await Promise.race([once(chrome, 'exit'), delay(5000)]);
  }
  await delay(500);
  rmSync(tempProfile, { recursive: true, force: true, maxRetries: 30, retryDelay: 200 });
}
