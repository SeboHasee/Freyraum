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
    if (response.exceptionDetails) {
      throw new Error(response.exceptionDetails.exception?.description ?? response.exceptionDetails.text);
    }
    return response.result?.value;
  };
  const capture = async (filename) => {
    if (!captureDir) return;
    await evaluate('new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
    const screenshot = await command('Page.captureScreenshot', { format: 'png', fromSurface: true });
    writeFileSync(join(captureDir, filename), Buffer.from(screenshot.data, 'base64'));
  };
  const waitForFrames = (frameCount = 24) => evaluate(`new Promise((resolve) => {
    let frame = 0;
    const tick = () => {
      frame += 1;
      if (frame >= ${frameCount}) resolve();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  })`);
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
  })`);
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
  const waitForCameraSettled = async (timeoutMs = 10_000) => {
    const deadline = Date.now() + timeoutMs;
    let previousTransform = '';
    let stableFrames = 0;
    while (Date.now() < deadline) {
      const transform = await evaluate(
        "document.querySelector('.gallery-room-view__scene').style.transform"
      );
      stableFrames = transform === previousTransform ? stableFrames + 1 : 0;
      previousTransform = transform;
      if (stableFrames >= 3) return transform;
      await delay(100);
    }
    throw new Error(`Timed out waiting for camera settle: ${previousTransform}`);
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
  const initialRightFrontState = await evaluate(`(() => {
    const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.b"]');
    return {
      selected: button.classList.contains('is-selected'),
      current: button.getAttribute('aria-current'),
      illuminated: button.classList.contains('is-illuminated'),
      accessibleName: button.getAttribute('aria-label'),
      visibleLabel: getComputedStyle(button.querySelector('.museum-hub__artwork-label')).display !== 'none',
    };
  })()`);
  assert.deepEqual(
    initialRightFrontState,
    {
      selected: false,
      current: null,
      illuminated: false,
      accessibleName: 'Kunstwerk „Akt 27“ in der Ausstellung öffnen',
      visibleLabel: false,
    },
    'the gallery-synchronized Akt 27 is not visually selected at initial hub entry, but remains accessibly named'
  );
  const hubButtonLabel = await evaluate(
    "document.querySelector('.topbar__room-view-btn').getAttribute('aria-label')"
  );
  assert.equal(hubButtonLabel, 'Fotoraum mit Wandbildern öffnen', 'room-view entry clearly names the photo room');
  for (const [width, height, mobile] of [[1440, 900, false], [768, 1024, true], [390, 844, true]]) {
    await command('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile,
    });
    await waitForFrames(30);
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
    await capture(`hub-${width}x${height}-normal.png`);
    if (width !== 1440) {
      const responsiveRightFront = await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.b"]');
        const rect = button.getBoundingClientRect();
        const points = button.style.clipPath.match(/polygon\\((.*)\\)/)[1]
          .split(',')
          .map((point) => point.trim().split(/\\s+/).map((part) => Number.parseFloat(part) / 100));
        const center = points.reduce((sum, [x, y]) => [sum[0] + x / points.length, sum[1] + y / points.length], [0, 0]);
        const x = rect.left + center[0] * rect.width;
        const y = rect.top + center[1] * rect.height;
        return {
          x, y,
          hitSlotId: document.elementFromPoint(x, y)?.closest('.museum-hub__artwork')?.dataset.slotId ?? null,
          boundsInViewport: rect.left >= 0 && rect.top >= 0 && rect.right <= innerWidth && rect.bottom <= innerHeight,
          bounds: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom },
        };
      })()`);
      assert.equal(
        responsiveRightFront.hitSlotId,
        'room-01.wall-front.b',
        `front-right artwork center is hittable at ${width}x${height} (${JSON.stringify(responsiveRightFront)})`
      );
      assert.equal(
        responsiveRightFront.boundsInViewport,
        true,
        `front-right artwork bounds fit the viewport at ${width}x${height} (${JSON.stringify(responsiveRightFront)})`
      );
      await command('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: responsiveRightFront.x,
        y: responsiveRightFront.y,
      });
      await waitForFrames(4);
      const responsiveHover = await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.b"]');
        const path = document.querySelector('.museum-hub__shadow-path[data-slot-id="room-01.wall-front.b"]');
        return {
          hovered: button.classList.contains('is-hovered'),
          lightVisible: Number.parseFloat(getComputedStyle(button.querySelector('.museum-hub__artwork-light')).opacity) > 0,
          shadowHovered: path.classList.contains('is-hovered'),
        };
      })()`);
      assert.deepEqual(
        responsiveHover,
        { hovered: true, lightVisible: true, shadowHovered: true },
        `the front-right painting receives aligned feedback at ${width}x${height}`
      );
      await capture(`hub-${width}x${height}-front-right-hovered.png`);
      await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
    }
    assert.match(shadow.path, /^M.+Z$/, `hub shadow has a projected path at ${width}x${height}`);
    assert.match(shadow.filter, /drop-shadow/, 'unclipped shadow layer renders layered wall shadows');
    assert.equal(shadow.pointerEvents, 'none', 'shadow layer cannot change artwork click targets');
    assert.equal(shadow.buttonFilter, 'none', 'clipped artwork button no longer owns the shadow filter');
    assert.ok(shadow.clipPath.startsWith('polygon('), 'artwork keeps its exact projective hit-area clip');
    assert.ok(shadow.shadowLayer.width > 0 && shadow.shadowLayer.height > 0, 'shadow SVG spans the room stage');
    assert.ok(shadow.stage.width > 0 && shadow.stage.height > 0);
    if (width === 1440) {
      const rightFrontSlotId = 'room-01.wall-front.b';
      assert.equal(
        await evaluate(
          `document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.b"]')?.dataset.slotId`
        ),
        rightFrontSlotId,
        'the configured front-right Akt 27 artwork is present for direct pointer checks'
      );
      const directPointerTarget = await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.b"]');
        const rect = button.getBoundingClientRect();
        const points = button.style.clipPath.match(/polygon\\((.*)\\)/)?.[1]
          .split(',')
          .map((point) => point.trim().split(/\\s+/).map((part) => Number.parseFloat(part) / 100));
        const center = points.reduce((sum, [x, y]) => [sum[0] + x / points.length, sum[1] + y / points.length], [0, 0]);
        const x = rect.left + center[0] * rect.width;
        const y = rect.top + center[1] * rect.height;
        const hit = document.elementFromPoint(x, y)?.closest('.museum-hub__artwork') ?? null;
        const path = document.querySelector(\`.museum-hub__shadow-path[data-slot-id="\${button.dataset.slotId}"]\`);
        return {
          x, y,
          expectedX: ((center[0]) * 100).toFixed(2) + '%',
          expectedY: ((center[1]) * 100).toFixed(2) + '%',
          hitSlotId: hit?.dataset.slotId ?? null,
          clipPath: button.style.clipPath,
          transform: button.style.getPropertyValue('--hub-artwork-transform'),
          bounds: { width: rect.width, height: rect.height },
          shadowSlotId: path?.dataset.slotId ?? null,
          shadowPointerEvents: path ? getComputedStyle(path).pointerEvents : '',
        };
      })()`);
      assert.equal(
        directPointerTarget.hitSlotId,
        rightFrontSlotId,
        `the visible front-right artwork's projected center receives the real pointer hit (${JSON.stringify(directPointerTarget)})`
      );
      assert.equal(directPointerTarget.shadowSlotId, rightFrontSlotId, 'front-right artwork owns its matching shadow path');
      assert.equal(directPointerTarget.shadowPointerEvents, 'none', 'the shadow cannot cover the front-right hit target');
      await command('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: directPointerTarget.x,
        y: directPointerTarget.y,
        buttons: 0,
      });
      await waitForFrames(4);
      const rightFrontHover = await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.b"]');
        const path = document.querySelector(\`.museum-hub__shadow-path[data-slot-id="\${button.dataset.slotId}"]\`);
        const light = button.querySelector('.museum-hub__artwork-light');
        return {
          selected: button.classList.contains('is-selected'),
          hovered: button.classList.contains('is-hovered'),
          lightVisible: Number.parseFloat(getComputedStyle(light).opacity) > 0,
          lightX: light.style.getPropertyValue('--hub-light-x'),
          lightY: light.style.getPropertyValue('--hub-light-y'),
          onlyMatchingShadowHovered: [...document.querySelectorAll('.museum-hub__shadow-path.is-hovered')]
            .every((hovered) => hovered.dataset.slotId === button.dataset.slotId),
          onlyMatchingLightIlluminated: [...document.querySelectorAll('.museum-hub__artwork.is-illuminated:not(.is-selected)')]
            .every((illuminated) => illuminated.dataset.slotId === button.dataset.slotId),
          clipPath: button.style.clipPath,
          transform: button.style.getPropertyValue('--hub-artwork-transform'),
          shadowHovered: path.classList.contains('is-hovered'),
        };
      })()`);
      assert.equal(
        rightFrontHover.hovered,
        true,
        `real mouse movement hovers the configured front-right artwork (${JSON.stringify(rightFrontHover)})`
      );
      assert.equal(rightFrontHover.lightVisible, true, 'front-right hover reveals its own spotlight');
      assert.equal(rightFrontHover.shadowHovered, true, 'front-right hover updates its matching shadow');
      assert.equal(rightFrontHover.onlyMatchingShadowHovered, true, 'front-right hover does not affect neighboring shadows');
      assert.equal(rightFrontHover.onlyMatchingLightIlluminated, true, 'front-right hover illuminates only its own artwork');
      assert.equal(rightFrontHover.selected, false, 'gallery synchronization does not mark Akt 27 selected while idle');
      assert.equal(rightFrontHover.clipPath, directPointerTarget.clipPath, 'hover preserves the projected clip hit area');
      assert.equal(rightFrontHover.transform, directPointerTarget.transform, 'hover preserves the projected artwork transform');
      assert.equal(
        rightFrontHover.lightX,
        rightFrontHover.selected ? '50%' : directPointerTarget.expectedX,
        'front-right hover follows the pointer unless its selected treatment holds the light centered'
      );
      assert.equal(
        rightFrontHover.lightY,
        rightFrontHover.selected ? '42%' : directPointerTarget.expectedY,
        'front-right hover preserves selected spotlight priority'
      );
      await capture(`hub-${width}x${height}-front-right-hovered.png`);
      await command('Input.dispatchKeyEvent', {
        type: 'keyDown',
        key: 'Tab',
        code: 'Tab',
        windowsVirtualKeyCode: 9,
      });
      await command('Input.dispatchKeyEvent', {
        type: 'keyUp',
        key: 'Tab',
        code: 'Tab',
        windowsVirtualKeyCode: 9,
      });
      await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.b"]');
        button.focus();
      })()`);
      await waitForFrames(4);
      const rightFrontFocus = await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.b"]');
        const path = document.querySelector(\`.museum-hub__shadow-path[data-slot-id="\${button.dataset.slotId}"]\`);
        const light = button.querySelector('.museum-hub__artwork-light');
        return {
          active: document.activeElement === button,
          focused: button.classList.contains('is-focused') && path.classList.contains('is-focused'),
          lightX: light.style.getPropertyValue('--hub-light-x'),
          lightY: light.style.getPropertyValue('--hub-light-y'),
          clipPath: button.style.clipPath,
          transform: button.style.getPropertyValue('--hub-artwork-transform'),
          focusCueOpacity: getComputedStyle(button, '::before').opacity,
          labelDisplay: getComputedStyle(button.querySelector('.museum-hub__artwork-label')).display,
        };
      })()`);
      assert.equal(rightFrontFocus.active, true, 'front-right Akt 27 can receive keyboard focus');
      assert.equal(rightFrontFocus.focused, true, 'front-right focus updates its paired shadow');
      assert.equal(rightFrontFocus.lightX, '50%', 'front-right focus centers the spotlight');
      assert.equal(rightFrontFocus.lightY, '42%', 'front-right focus centers the spotlight vertically');
      assert.equal(rightFrontFocus.focusCueOpacity, '1', 'front-right keyboard focus has a visible non-frame marker');
      assert.equal(rightFrontFocus.labelDisplay, 'none', 'visitor focus does not show an artwork-name badge');
      assert.equal(rightFrontFocus.clipPath, directPointerTarget.clipPath, 'front-right focus leaves its hit area unchanged');
      assert.equal(rightFrontFocus.transform, directPointerTarget.transform, 'front-right focus leaves its projective transform unchanged');
      await capture(`hub-${width}x${height}-front-right-focused.png`);
      if (rightFrontHover.selected) {
        await capture(`hub-${width}x${height}-feedback-selected.png`);
      }
      await evaluate(`(() => document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.b"]').blur())()`);
      await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
      const feedbackSlotId = 'room-01.wall-front.a';
      const followPoint = await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.a"]');
        const rect = button.getBoundingClientRect();
        const points = button.style.clipPath.match(/polygon\\((.*)\\)/)[1]
          .split(',')
          .map((point) => point.trim().split(/\\s+/).map((part) => Number.parseFloat(part) / 100));
        const center = points.reduce((sum, [x, y]) => [sum[0] + x / points.length, sum[1] + y / points.length], [0, 0]);
        const corner = points[0];
        const x = rect.left + (center[0] * 0.65 + corner[0] * 0.35) * rect.width;
        const y = rect.top + (center[1] * 0.65 + corner[1] * 0.35) * rect.height;
        return {
          x, y,
          hitSlotId: document.elementFromPoint(x, y)?.closest('.museum-hub__artwork')?.dataset.slotId ?? null,
          expectedX: \`\${(((x - rect.left) / rect.width) * 100).toFixed(2)}%\`,
          expectedY: \`\${(((y - rect.top) / rect.height) * 100).toFixed(2)}%\`,
        };
      })()`);
      assert.equal(followPoint.hitSlotId, feedbackSlotId, 'the spotlight follow sample remains inside the projected art hit area');
      await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: followPoint.x, y: followPoint.y });
      const followedLight = await evaluate(`(() => {
        const light = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.a"]')
          .querySelector('.museum-hub__artwork-light');
        return {
          x: light.style.getPropertyValue('--hub-light-x'),
          y: light.style.getPropertyValue('--hub-light-y'),
        };
      })()`);
      assert.equal(followedLight.x, followPoint.expectedX, 'the spotlight follows horizontal fine-pointer position');
      assert.equal(followedLight.y, followPoint.expectedY, 'the spotlight follows vertical fine-pointer position');
      await capture(`hub-${width}x${height}-front-right-follow.png`);
      const neighborPointerTargets = await evaluate(`(() => [
        'room-01.wall-front.a',
        'room-01.wall-left.a',
        'room-01.wall-right.a',
      ].map((slotId) => {
        const button = document.querySelector(\`.museum-hub__artwork[data-slot-id="\${slotId}"]\`);
        if (!button) return { slotId, missing: true };
        const rect = button.getBoundingClientRect();
        const points = button.style.clipPath.match(/polygon\\((.*)\\)/)?.[1]
          .split(',')
          .map((point) => point.trim().split(/\\s+/).map((part) => Number.parseFloat(part) / 100));
        const center = points.reduce((sum, [x, y]) => [sum[0] + x / points.length, sum[1] + y / points.length], [0, 0]);
        const x = rect.left + center[0] * rect.width;
        const y = rect.top + center[1] * rect.height;
        return {
          slotId,
          x, y,
          hitSlotId: document.elementFromPoint(x, y)?.closest('.museum-hub__artwork')?.dataset.slotId ?? null,
          clipPath: button.style.clipPath,
          transform: button.style.getPropertyValue('--hub-artwork-transform'),
        };
      }))()`);
      for (const target of neighborPointerTargets) {
        assert.equal(target.missing, undefined, `${target.slotId} remains present for comparison`);
        assert.equal(target.hitSlotId, target.slotId, `${target.slotId} keeps a reachable projected hit area`);
        await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: target.x, y: target.y });
        await waitForFrames(3);
        const targetFeedback = await evaluate(`(() => {
          const button = document.querySelector('.museum-hub__artwork.is-hovered');
          const path = document.querySelector(\`.museum-hub__shadow-path[data-slot-id="\${button.dataset.slotId}"]\`);
          return {
            slotId: button.dataset.slotId,
            hovered: button.classList.contains('is-hovered'),
            onlyMatchingShadowHovered: [...document.querySelectorAll('.museum-hub__shadow-path.is-hovered')]
              .every((hovered) => hovered.dataset.slotId === button.dataset.slotId),
            clipPath: button.style.clipPath,
            transform: button.style.getPropertyValue('--hub-artwork-transform'),
            shadowHovered: path.classList.contains('is-hovered'),
          };
        })()`);
        assert.equal(targetFeedback.slotId, target.slotId, `${target.slotId} is the artwork receiving hover`);
        assert.equal(targetFeedback.hovered, true, `${target.slotId} receives actual mouse hover`);
        assert.equal(targetFeedback.shadowHovered, true, `${target.slotId} updates its own shadow`);
        assert.equal(targetFeedback.onlyMatchingShadowHovered, true, `${target.slotId} does not update another shadow`);
        assert.equal(targetFeedback.clipPath, target.clipPath, `${target.slotId} retains its projected hit area`);
        assert.equal(targetFeedback.transform, target.transform, `${target.slotId} retains its projected transform`);
        await capture(`hub-${width}x${height}-${target.slotId}-hovered.png`);
      }
      await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
      const baselineFilter = await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.a"]');
        const path = document.querySelector(\`.museum-hub__shadow-path[data-slot-id="\${button.dataset.slotId}"]\`);
        return getComputedStyle(path).filter;
      })()`);
      await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.a"]');
        button.dispatchEvent(new PointerEvent('pointerenter', {
          pointerType: 'mouse',
          bubbles: false,
        }));
      })()`);
      await waitForFrames(24);
      const hoveredShadow = await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.a"]');
        const path = document.querySelector(\`.museum-hub__shadow-path[data-slot-id="\${button.dataset.slotId}"]\`);
        const light = button.querySelector('.museum-hub__artwork-light');
        return {
          filter: getComputedStyle(path).filter,
          fill: getComputedStyle(path).fill,
          lightOpacity: getComputedStyle(light).opacity,
          hovered: path.classList.contains('is-hovered'),
          onlyMatchingShadowHovered: [...document.querySelectorAll('.museum-hub__shadow-path.is-hovered')]
            .every((hovered) => hovered.dataset.slotId === button.dataset.slotId),
          clipPath: button.style.clipPath,
        };
      })()`);
      assert.equal(hoveredShadow.hovered, true, 'mouse hover marks only the matching projected shadow');
      assert.equal(hoveredShadow.onlyMatchingShadowHovered, true, 'neighboring artworks keep their ordinary shadow state');
      assert.equal(hoveredShadow.clipPath, shadow.clipPath, 'hover does not change the projected artwork hit area');
      assert.notEqual(
        hoveredShadow.filter,
        baselineFilter,
        `hover smoothly intensifies the matching wall shadow (${JSON.stringify(hoveredShadow)})`
      );
      await capture(`hub-${width}x${height}-hovered.png`);
      await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.a"]');
        const path = document.querySelector(\`.museum-hub__shadow-path[data-slot-id="\${button.dataset.slotId}"]\`);
        button.focus();
        if (!path.classList.contains('is-focused')) {
          button.dispatchEvent(new FocusEvent('focus'));
        }
      })()`);
      await waitForFrames(24);
      const focusedShadow = await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.a"]');
        const path = document.querySelector(\`.museum-hub__shadow-path[data-slot-id="\${button.dataset.slotId}"]\`);
        return {
          focused: path.classList.contains('is-focused'),
          buttonFocused: button.classList.contains('is-focused'),
          lightOpacity: getComputedStyle(button.querySelector('.museum-hub__artwork-light')).opacity,
          lightX: button.querySelector('.museum-hub__artwork-light').style.getPropertyValue('--hub-light-x'),
          lightY: button.querySelector('.museum-hub__artwork-light').style.getPropertyValue('--hub-light-y'),
          filter: getComputedStyle(path).filter,
          active: document.activeElement === button,
        };
      })()`);
      assert.equal(
        focusedShadow.focused,
        true,
        `keyboard focus reaches the matching projected shadow (${JSON.stringify(focusedShadow)})`
      );
      assert.equal(focusedShadow.buttonFocused, true, 'keyboard focus marks the artwork for an explicit focus cue');
      assert.ok(Number.parseFloat(focusedShadow.lightOpacity) > 0, 'keyboard focus shows the centered spotlight');
      assert.equal(focusedShadow.lightX, '50%', 'keyboard focus centers the spotlight horizontally');
      assert.equal(focusedShadow.lightY, '42%', 'keyboard focus centers the spotlight vertically');
      assert.notEqual(focusedShadow.filter, baselineFilter, 'keyboard focus receives the same shadow feedback');
      await capture(`hub-${width}x${height}-front-right-focused.png`);
      await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.a"]');
        const path = document.querySelector(\`.museum-hub__shadow-path[data-slot-id="\${button.dataset.slotId}"]\`);
        const light = button.querySelector('.museum-hub__artwork-light');
        button.classList.add('is-selected');
        path.classList.add('is-selected');
        button.dispatchEvent(new PointerEvent('pointermove', {
          pointerType: 'mouse',
          bubbles: true,
          buttons: 0,
          clientX: button.getBoundingClientRect().right - 1,
          clientY: button.getBoundingClientRect().bottom - 1,
        }));
        [
          ['--hub-shadow-fill-alpha', '0.28'],
          ['--hub-shadow-opacity', '0.96'],
          ['--hub-shadow-contact-alpha', '0.54'],
          ['--hub-shadow-contact-blur', '3px'],
          ['--hub-shadow-directional-alpha', '0.4'],
          ['--hub-shadow-directional-blur', '14px'],
          ['--hub-shadow-ambient-alpha', '0.23'],
          ['--hub-shadow-ambient-blur', '24px'],
        ].forEach(([name, value]) => path.style.setProperty(name, value));
      })()`);
      await waitForFrames(24);
      const selectedFeedback = await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.a"]');
        const path = document.querySelector(\`.museum-hub__shadow-path[data-slot-id="\${button.dataset.slotId}"]\`);
        const light = button.querySelector('.museum-hub__artwork-light');
        return {
          filter: getComputedStyle(path).filter,
          lightX: light.style.getPropertyValue('--hub-light-x'),
          lightY: light.style.getPropertyValue('--hub-light-y'),
        };
      })()`);
      assert.notEqual(selectedFeedback.filter, hoveredShadow.filter, 'selected shadow treatment takes precedence over hover');
      assert.equal(selectedFeedback.lightX, '50%', 'selection holds the spotlight at its stable center');
      assert.equal(selectedFeedback.lightY, '42%', 'selection remains centered as the pointer moves');
      await capture(`hub-${width}x${height}-front-right-selected.png`);
      await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.a"]');
        const path = document.querySelector(\`.museum-hub__shadow-path[data-slot-id="\${button.dataset.slotId}"]\`);
        button.classList.remove('is-selected');
        button.classList.remove('is-selected', 'is-hovered', 'is-focused', 'is-illuminated');
        path.classList.remove('is-selected', 'is-hovered', 'is-focused');
        [
          '--hub-shadow-fill-alpha',
          '--hub-shadow-opacity',
          '--hub-shadow-contact-alpha',
          '--hub-shadow-contact-blur',
          '--hub-shadow-directional-alpha',
          '--hub-shadow-directional-blur',
          '--hub-shadow-ambient-alpha',
          '--hub-shadow-ambient-blur',
        ].forEach((name) => path.style.removeProperty(name));
        button.blur();
      })()`);
      await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.a"]');
        const path = document.querySelector(\`.museum-hub__shadow-path[data-slot-id="\${button.dataset.slotId}"]\`);
        button.classList.remove('is-hovered', 'is-illuminated');
        path.classList.remove('is-hovered');
        button.dispatchEvent(new PointerEvent('pointerenter', {
          pointerType: 'touch',
          bubbles: false,
          buttons: 0,
        }));
        return {
          hovered: button.classList.contains('is-hovered'),
          shadowHovered: path.classList.contains('is-hovered'),
          illuminated: button.classList.contains('is-illuminated'),
        };
      })()`).then((touchFeedback) => {
        assert.deepEqual(
          touchFeedback,
          { hovered: false, shadowHovered: false, illuminated: false },
          'touch pointer events do not activate hover effects'
        );
      });
      await evaluate(`(() => {
        const hub = document.querySelector('.museum-hub');
        const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.a"]');
        button.classList.add('is-illuminated');
        hub.classList.add('is-debug-geometry');
      })()`);
      await waitForFrames(30);
      const debugSpotlightOpacity = await evaluate(
        `getComputedStyle(document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.a"]').querySelector('.museum-hub__artwork-light')).opacity`
      );
      await evaluate(`(() => {
        const hub = document.querySelector('.museum-hub');
        hub.classList.remove('is-debug-geometry');
        hub.classList.add('is-calibrating');
      })()`);
      await waitForFrames(30);
      const editorSpotlightOpacity = await evaluate(
        `getComputedStyle(document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.a"]').querySelector('.museum-hub__artwork-light')).opacity`
      );
      await evaluate(`(() => {
        document.querySelector('.museum-hub').classList.remove('is-calibrating');
        document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.a"]').classList.remove('is-illuminated');
      })()`);
      assert.deepEqual(
        { debugOpacity: debugSpotlightOpacity, editorOpacity: editorSpotlightOpacity },
        { debugOpacity: '0', editorOpacity: '0' },
        'debug and calibration presentation suppresses visitor spotlight effects'
      );
      await command('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
      });
      const hubReducedMotion = await evaluate(`(() => ({
        lightTransition: getComputedStyle(document.querySelector('.museum-hub__artwork-light')).transition,
        shadowTransition: getComputedStyle(document.querySelector('.museum-hub__shadow-path')).transition,
      }))()`);
      assert.equal(hubReducedMotion.lightTransition, 'none', 'reduced motion removes spotlight easing');
      assert.equal(hubReducedMotion.shadowTransition, 'none', 'reduced motion removes shadow easing');
      await command('Emulation.setEmulatedMedia', { features: [] });
      await command('Emulation.setEmulatedMedia', {
        features: [
          { name: 'hover', value: 'none' },
          { name: 'pointer', value: 'coarse' },
        ],
      });
      await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.a"]');
        button.dispatchEvent(new PointerEvent('pointerenter', {
          pointerType: 'touch',
          bubbles: false,
        }));
      })()`);
      await waitForFrames(24);
      const touchShadow = await evaluate(`(() => {
        const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.a"]');
        const path = document.querySelector(\`.museum-hub__shadow-path[data-slot-id="\${button.dataset.slotId}"]\`);
        return { filter: getComputedStyle(path).filter, hovered: path.classList.contains('is-hovered') };
      })()`);
      assert.equal(touchShadow.filter, baselineFilter, 'touch-only hover does not intensify artwork shadows');
      assert.equal(touchShadow.hovered, false, 'touch input never activates the hover state');
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
  await evaluate(`document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.b"]').click()`);
  await waitFor("document.querySelector('#app').dataset.experience === 'gallery'", 30_000);
  const explicitSlotSelection = await evaluate(`(() => {
    const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.b"]');
    return { selected: button.classList.contains('is-selected'), current: button.getAttribute('aria-current') };
  })()`);
  assert.deepEqual(
    explicitSlotSelection,
    { selected: true, current: 'true' },
    'an explicit Akt 27 activation receives selected acknowledgement before gallery entry'
  );
  await evaluate("document.querySelector('.topbar__back-btn').click()");
  await waitFor("document.querySelector('#app').dataset.experience === 'hub'", 30_000);
  const returnedRightFrontState = await evaluate(`(() => {
    const button = document.querySelector('.museum-hub__artwork[data-slot-id="room-01.wall-front.b"]');
    return {
      selected: button.classList.contains('is-selected'),
      current: button.getAttribute('aria-current'),
      illuminated: button.classList.contains('is-illuminated'),
      focused: button.classList.contains('is-focused'),
    };
  })()`);
  assert.equal(returnedRightFrontState.selected, false, 'returning to the hub does not leave Akt 27 selected');
  assert.equal(returnedRightFrontState.current, null, 'returning to the hub clears Akt 27 current-selection semantics');
  assert.equal(
    returnedRightFrontState.illuminated,
    returnedRightFrontState.focused,
    'returning to the hub may retain only its keyboard-focus spotlight cue'
  );
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
  await command('Emulation.setDeviceMetricsOverride', {
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
  });
  await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 720, y: 450 });
  const roomCursorAtFit = await evaluate(`(() => {
    const scene = document.querySelector('.gallery-room-view__scene');
    return { available: scene.classList.contains('is-pan-available'), cursor: getComputedStyle(scene).cursor };
  })()`);
  assert.deepEqual(roomCursorAtFit, { available: false, cursor: 'auto' },
    'the photo room does not show a grab cursor when the fitted view cannot pan');
  await evaluate("document.querySelector('.gallery-room-view [aria-label=\"Vergrößern\"]').click()");
  await waitFor("document.querySelector('.gallery-room-view__scene').classList.contains('is-pan-available')");
  await waitFor(
    "parseFloat(document.querySelector('.gallery-room-view__scene').style.transform.split('scale(')[1]) >= 1.2"
  );
  assert.equal(
    await evaluate("getComputedStyle(document.querySelector('.gallery-room-view__scene')).cursor"),
    'grab',
    `the photo room shows a grab cursor once zoom makes panning possible (${JSON.stringify(await evaluate(`(() => ({
      available: document.querySelector('.gallery-room-view__scene').classList.contains('is-pan-available'),
      media: matchMedia('(hover: hover) and (pointer: fine)').matches,
      cursor: getComputedStyle(document.querySelector('.gallery-room-view__scene')).cursor,
    }))()`))})`
  );
  await command('Input.dispatchMouseEvent', { type: 'mousePressed', x: 720, y: 450, button: 'left', buttons: 1 });
  await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 690, y: 420, button: 'left', buttons: 1 });
  assert.equal(
    await evaluate("getComputedStyle(document.querySelector('.gallery-room-view__scene')).cursor"),
    'grabbing',
    `the photo room shows grabbing only after a pannable drag starts (${JSON.stringify(await evaluate(`(() => {
      const scene = document.querySelector('.gallery-room-view__scene');
      return { classes: scene.className, cursor: getComputedStyle(scene).cursor };
    })()`))})`
  );
  await command('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 690, y: 420, button: 'left', buttons: 0 });
  await evaluate("document.querySelector('.gallery-room-view [aria-label=\"Fotoansicht zurücksetzen\"]').click()");
  // Terminal wait: the reset glide can be rAF-starved headless (Lesson 125).
  await waitFor("!document.querySelector('.gallery-room-view__scene').classList.contains('is-pan-available')", 60_000);
  assert.equal(
    await evaluate("getComputedStyle(document.querySelector('.gallery-room-view__scene')).cursor"),
    'auto',
    'resetting the photo room removes the grab cursor when panning is no longer available'
  );
  await command('Emulation.setDeviceMetricsOverride', {
    width: 390, height: 844, deviceScaleFactor: 1, mobile: true,
  });
  await command('Emulation.setEmulatedMedia', {
    features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }],
  });
  await evaluate(`document.querySelector('.gallery-room-view__scene').dispatchEvent(
    new PointerEvent('pointermove', { pointerType: 'touch', bubbles: true })
  )`);
  assert.equal(
    await evaluate("getComputedStyle(document.querySelector('.gallery-room-view__scene')).cursor"),
    'auto',
    'coarse-pointer photo-room devices do not receive a mouse cursor affordance'
  );
  await command('Emulation.setDeviceMetricsOverride', {
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
  });
  await command('Emulation.setEmulatedMedia', { features: [] });
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
  assert.ok(roomHelp.rows.some((row) => row.includes('vergrößerter Ansicht') && row.includes('Ziehen')));
  assert.ok(roomHelp.rows.some((row) => row.includes('heranzoomen') && row.includes('Doppelklick')));
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
      const sampleElement = document.elementFromPoint(Math.round(innerWidth * 0.01), Math.round(innerHeight * 0.3));
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
  // Hold still past the 100 ms velocity window: CDP delivers press/move/release
  // within milliseconds, which the v1.41 release physics reads as a fling whose
  // glide would push the camera to the photo edge and clamp the next zoom path.
  await delay(250);
  await command('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 230, y: 440, button: 'left', buttons: 0 });
  await waitFor(`(() => {
    const transform = document.querySelector('.gallery-room-view__scene').style.transform;
    const settled = window.__freyraumDragSettle === transform;
    window.__freyraumDragSettle = transform;
    return settled;
  })()`);
  camera = await evaluate("document.querySelector('.gallery-room-view__scene').style.transform");
  assert.doesNotMatch(camera, /translate3d\(0px, 0px/, 'drag pans the photo');
  assert.equal(
    await evaluate("document.querySelector('.gallery-room-view__artwork-frame').style.transform"),
    projectedArtworkTransform,
    'panning keeps the artwork projection in the same photo coordinate space'
  );
  const beforeOffCenterWheel = await readArtworkScreenCenter();
  await command('Input.dispatchMouseEvent', {
    type: 'mouseWheel',
    x: Math.round(beforeOffCenterWheel.viewport.width * 0.7),
    y: Math.round(beforeOffCenterWheel.viewport.height * 0.5),
    deltaX: 0,
    deltaY: -100,
  });
  const offCenterWheelPath = await sampleArtworkCenterPath();
  const offCenterWheelDeviation = maxPathDeviation(offCenterWheelPath, {
    x: beforeOffCenterWheel.viewport.width / 2,
    y: beforeOffCenterWheel.viewport.height / 2,
  });
  assert.ok(
    offCenterWheelDeviation < 2,
    `off-center wheel zoom follows a straight artwork-center path (max deviation ${offCenterWheelDeviation.toFixed(2)}px)`
  );
  await waitForArtworkCenter();
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
  await waitFor("document.querySelector('.gallery-room-view__scene').style.transform === 'translate3d(0px, 0px, 0px) scale(1)'");
  // v1.43: mouse double-click zooms in at the pointer and back, like the gallery.
  const doubleClickAt = async (x, y) => {
    for (const clickCount of [1, 2]) {
      await command('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', buttons: 1, clickCount });
      await command('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', buttons: 0, clickCount });
    }
  };
  const doubleClickPoint = await evaluate(`(() => {
    const rect = document.querySelector('.gallery-room-view').getBoundingClientRect();
    return { x: Math.round(rect.left + rect.width * 0.6), y: Math.round(rect.top + rect.height * 0.55) };
  })()`);
  await doubleClickAt(doubleClickPoint.x, doubleClickPoint.y);
  // The camera is its own compositor layer (will-change) while the zoom animates.
  await waitFor(`document.querySelector('.gallery-room-view__scene').classList.contains('is-camera-moving')
    && getComputedStyle(document.querySelector('.gallery-room-view__scene')).willChange === 'transform'`);
  await waitFor(`Math.abs(Number(document.querySelector('.gallery-room-view__scene').style.transform
    .split(' scale(')[1]?.slice(0, -1)) - 2.5) < 0.001`, 60_000);
  const doubleClickCamera = await evaluate(`(() => {
    const rect = document.querySelector('.gallery-room-view').getBoundingClientRect();
    const match = /translate3d\\(([-\\d.]+)px, ([-\\d.]+)px, 0px\\) scale\\(([\\d.]+)\\)/
      .exec(document.querySelector('.gallery-room-view__scene').style.transform);
    return { left: rect.left, top: rect.top, offsetX: Number(match[1]), offsetY: Number(match[2]), scale: Number(match[3]) };
  })()`);
  const anchoredX = (doubleClickPoint.x - doubleClickCamera.left - doubleClickCamera.offsetX) / doubleClickCamera.scale;
  const anchoredY = (doubleClickPoint.y - doubleClickCamera.top - doubleClickCamera.offsetY) / doubleClickCamera.scale;
  assert.ok(
    Math.abs(anchoredX - (doubleClickPoint.x - doubleClickCamera.left)) < 2
      && Math.abs(anchoredY - (doubleClickPoint.y - doubleClickCamera.top)) < 2,
    `double-click zoom keeps the clicked photo point under the pointer: ${JSON.stringify({ doubleClickPoint, doubleClickCamera })}`
  );
  await waitFor("!document.querySelector('.gallery-room-view__scene').classList.contains('is-camera-moving')");
  // v1.44: the zoom-out scales about its fixed point instead of easing pan and
  // scale separately (which slid the view to the left edge while still zoomed).
  const zoomOutPath = evaluate(`new Promise((resolve) => {
    const scene = document.querySelector('.gallery-room-view__scene');
    const parse = () => {
      const match = /translate3d\\(([-\\d.]+)px, ([-\\d.]+)px, 0px\\) scale\\(([\\d.]+)\\)/.exec(scene.style.transform);
      return match ? { x: Number(match[1]), y: Number(match[2]), scale: Number(match[3]) } : null;
    };
    const frames = [];
    const startedAt = performance.now();
    const tick = () => {
      const camera = parse();
      if (camera) frames.push(camera);
      if ((camera && camera.scale === 1 && camera.x === 0 && camera.y === 0) || performance.now() - startedAt > 55000) resolve(frames);
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  })`);
  await doubleClickAt(doubleClickPoint.x, doubleClickPoint.y);
  const zoomOutFrames = await zoomOutPath;
  await waitFor("document.querySelector('.gallery-room-view__scene').style.transform === 'translate3d(0px, 0px, 0px) scale(1)'", 60_000);
  const fixedContentX = -doubleClickCamera.offsetX / (doubleClickCamera.scale - 1);
  const fixedContentY = -doubleClickCamera.offsetY / (doubleClickCamera.scale - 1);
  const zoomOutDrift = Math.max(...zoomOutFrames.map((frame) => Math.max(
    Math.abs(frame.x + fixedContentX * frame.scale - fixedContentX),
    Math.abs(frame.y + fixedContentY * frame.scale - fixedContentY)
  )));
  assert.ok(
    zoomOutFrames.length > 1 && zoomOutDrift < 2,
    `double-click zoom-out keeps its fixed photo point still (max drift ${zoomOutDrift.toFixed(2)}px over ${zoomOutFrames.length} frames)`
  );
  console.log('✓ double-click zooms in at the pointer and back; camera layer only while moving');
  await evaluate(`(() => {
    const zoom = document.querySelector('.gallery-room-view [aria-label="Vergrößern"]');
    for (let index = 0; index < 12; index += 1) zoom.click();
  })()`);
  await waitFor(`Number(document.querySelector('.gallery-room-view__scene').style.transform
    .split(' scale(')[1]?.slice(0, -1)) > 5.8`, 60_000);
  await evaluate(`(() => {
    const zoom = document.querySelector('.gallery-room-view [aria-label="Vergrößern"]');
    if (!zoom.disabled) zoom.click();
  })()`);
  await waitFor(`Math.abs(Number(document.querySelector('.gallery-room-view__scene').style.transform
    .split(' scale(')[1]?.slice(0, -1)) - 6) < 0.001`, 90_000);
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
  for (let drag = 0; drag < 16; drag += 1) {
    await command('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: 290,
      y: 500,
      button: 'left',
      buttons: 1,
    });
    await command('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 230,
      y: 440,
      button: 'left',
      buttons: 1,
    });
    await command('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: 230,
      y: 440,
      button: 'left',
      buttons: 0,
    });
  }
  // v1.41: release momentum rubber-bands past the edge, then springs back.
  // Headless SwiftShader can starve rAF for seconds, so wait for the value.
  await waitFor(`(() => {
    const match = /translate3d\\(([-\\d.]+)px, [-\\d.]+px, 0px\\) scale\\(([\\d.]+)\\)/
      .exec(document.querySelector('.gallery-room-view__scene').style.transform);
    if (!match) return false;
    const width = document.querySelector('.gallery-room-view').getBoundingClientRect().width;
    return Math.abs(Number(match[1]) + width * (Number(match[2]) - 1)) < 1;
  })()`, 60_000);
  const edgeZoomStart = await readArtworkScreenCenter();
  const maxOffsetAtEdge = edgeZoomStart.viewport.width * (edgeZoomStart.scale - 1);
  assert.ok(
    Math.abs(edgeZoomStart.offsetX + maxOffsetAtEdge) < 1,
    `repeated drag reaches the left photo-pan limit (${JSON.stringify(edgeZoomStart)})`
  );
  await evaluate(`document.querySelector('.gallery-room-view [aria-label="Verkleinern"]').click()`);
  const edgeZoomPath = await sampleArtworkCenterPath();
  assert.ok(
    edgeZoomPath.every((point) => point.offsetX <= 1
      && point.offsetX >= -point.viewport.width * (point.scale - 1) - 1
      && point.offsetY <= 1
      && point.offsetY >= -point.viewport.height * (point.scale - 1) - 1),
    'edge-limited animated zoom keeps every camera frame inside photo coverage bounds'
  );
  const settledEdgeCamera = await waitForCameraSettled();
  const settledEdgeState = await readArtworkScreenCenter();
  const targetScaleAtEdge = 4.8;
  const contentCenterX = (edgeZoomStart.x - edgeZoomStart.offsetX) / edgeZoomStart.scale;
  const expectedEdgeOffsetX = Math.min(
    0,
    Math.max(
      -settledEdgeState.viewport.width * (targetScaleAtEdge - 1),
      settledEdgeState.viewport.width * 0.5 - contentCenterX * targetScaleAtEdge
    )
  );
  assert.match(settledEdgeCamera, /scale\(4\.8\)/, 'edge-limited zoom reaches its requested scale');
  assert.ok(
    Math.abs(settledEdgeState.offsetX - expectedEdgeOffsetX) < 1,
    'edge-limited zoom settles at the reachable artwork-centered offset'
  );
  await evaluate(`document.querySelector('.gallery-room-view [aria-label="Fotoansicht zurücksetzen"]').click()`);
  await waitFor("document.querySelector('.gallery-room-view__scene').style.transform === 'translate3d(0px, 0px, 0px) scale(1)'", 60_000);
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
  assert.ok(motionTilt.every((tilt) => Number.isFinite(tilt) && Math.abs(tilt) <= 3.5),
    `sensor tilt stays inside the bounded visible angle range (${motionTilt})`);
  assert.ok(
    await evaluate("document.querySelector('.gallery-room-view__scene').classList.contains('is-sensor-tilt')"),
    'sensor-driven tilt bypasses the CSS transform transition'
  );
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
    await evaluate(`(() => {
      // v1.42: on touch phones the shared controls return to the topbar "more" menu.
      const phone = matchMedia('(max-width: 599px) and (pointer: coarse)').matches;
      const host = phone ? '.topbar .phone-menu__panel' : '#app';
      return document.querySelector(host + ' > .prefs') !== null
        && document.querySelector(host + ' > .fullscreen-btn') !== null;
    })()`),
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
  assert.ok(galleryHelp.rows.some((row) => row.includes('Mausrad') && row.includes('zoomen')));
  assert.ok(galleryHelp.rows.some((row) => row.includes('vergrößerter Ansicht') && row.includes('Ziehen')));
  assert.ok(galleryHelp.rows.some((row) => row.includes('Übersicht') && row.includes('wechseln')));
  assert.ok(galleryHelp.rows.some((row) => row.includes('Zwei Finger') && row.includes('Touchscreens')));
  await evaluate("document.querySelector('.keyboard-help__close').click()");
  await command('Emulation.setDeviceMetricsOverride', {
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
  });
  await evaluate("document.querySelector('.zoom-controls [aria-label=\"Ansicht zurücksetzen\"]').click()");
  await evaluate(`(() => {
    const zoomOut = document.querySelector('.zoom-controls [aria-label="Verkleinern"]');
    for (let step = 0; step < 8; step += 1) zoomOut.click();
  })()`);
  await waitFor("!document.querySelector('.gallery-canvas').classList.contains('is-pan-available')");
  await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 720, y: 450 });
  assert.equal(
    await evaluate("getComputedStyle(document.querySelector('.gallery-canvas')).cursor"),
    'auto',
    'the gallery overview does not show a grab cursor when panning is unavailable'
  );
  await evaluate(`(() => {
    const zoomIn = document.querySelector('.zoom-controls [aria-label="Vergrößern"]');
    for (let step = 0; step < 14; step += 1) zoomIn.click();
  })()`);
  await waitFor("document.querySelector('.gallery-canvas').classList.contains('is-pan-available')");
  await waitForFrames(60);
  await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 720, y: 450 });
  assert.equal(
    await evaluate("getComputedStyle(document.querySelector('.gallery-canvas')).cursor"),
    'grab',
    'the gallery shows a grab cursor once zoom makes panning possible'
  );
  await command('Input.dispatchMouseEvent', { type: 'mousePressed', x: 720, y: 450, button: 'left', buttons: 1 });
  await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 690, y: 420, button: 'left', buttons: 1 });
  assert.equal(
    await evaluate("getComputedStyle(document.querySelector('.gallery-canvas')).cursor"),
    'grabbing',
    'the gallery shows grabbing only after a pannable drag starts'
  );
  await command('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 690, y: 420, button: 'left', buttons: 0 });
  assert.equal(
    await evaluate("document.querySelector('.gallery-canvas').classList.contains('is-panning')"),
    false,
    'the gallery clears its active drag cursor after release'
  );
  await evaluate("document.querySelector('.zoom-controls [aria-label=\"Ansicht zurücksetzen\"]').click()");
  await waitForFrames(60);
  const galleryResetCursor = await evaluate(`(() => {
    const canvas = document.querySelector('.gallery-canvas');
    return {
      available: canvas.classList.contains('is-pan-available'),
      cursor: getComputedStyle(canvas).cursor,
    };
  })()`);
  assert.equal(
    galleryResetCursor.cursor,
    galleryResetCursor.available ? 'grab' : 'auto',
    'the gallery reset view shows grab only when its bounded pan range remains available'
  );
  await command('Emulation.setDeviceMetricsOverride', {
    width: 390, height: 844, deviceScaleFactor: 1, mobile: true,
  });
  await command('Emulation.setEmulatedMedia', {
    features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }],
  });
  await evaluate(`document.querySelector('.gallery-canvas').dispatchEvent(
    new PointerEvent('pointermove', { pointerType: 'touch', bubbles: true })
  )`);
  assert.equal(
    await evaluate("getComputedStyle(document.querySelector('.gallery-canvas')).cursor"),
    'auto',
    'coarse-pointer gallery devices do not receive a mouse cursor affordance'
  );
  await command('Emulation.setDeviceMetricsOverride', {
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
  });
  await command('Emulation.setEmulatedMedia', { features: [] });
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
