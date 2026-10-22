import assert from 'node:assert/strict';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function loadTsModule(relativePath) {
  const result = buildSync({
    entryPoints: [resolve(ROOT, relativePath)],
    bundle: true,
    format: 'esm',
    platform: 'browser',
    write: false,
    target: ['es2020'],
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`
  );
}

const gestures = await loadTsModule('src/interaction/touchGestures.ts');
const panorama = await loadTsModule('src/hub/hubPanorama.ts');
const orientation = await loadTsModule('src/gallery/deviceOrientation.ts');

const close = (actual, expected, epsilon, message) =>
  assert.ok(Math.abs(actual - expected) <= epsilon, `${message}: ${actual} ≉ ${expected}`);

// Velocity: least-squares slope of the last 100 ms; a finger that paused stops the fling.
{
  const tracker = new gestures.VelocityTracker();
  for (let t = 0; t <= 100; t += 16) tracker.add(t, t * 0.8, 0);
  close(tracker.velocity().x, 800, 1, 'steady drag reports px/s');
  close(tracker.velocity().y, 0, 1e-9, 'no vertical velocity');
  assert.deepEqual(tracker.velocity(400), { x: 0, y: 0 }, 'paused finger never flings');
  tracker.reset();
  assert.deepEqual(tracker.velocity(), { x: 0, y: 0 }, 'reset clears samples');
}

// Rubber band: identity inside, resisted and bounded outside.
{
  assert.equal(gestures.rubberBandClamp(50, 0, 100, 400), 50);
  const pulled = gestures.rubberBandClamp(180, 0, 100, 400);
  assert.ok(pulled > 100 && pulled < 180, 'overshoot is resisted');
  assert.ok(gestures.rubberBandClamp(1e6, 0, 100, 400) < 500, 'overshoot approaches the dimension');
  const pushed = gestures.rubberBandClamp(-80, 0, 100, 400);
  assert.ok(pushed < 0 && pushed > -80, 'resistance is symmetric below the minimum');
  assert.equal(gestures.rubberBand(0, 400), 0);
}

// Momentum: frame-rate independent decay that never escapes the limits at rest.
{
  const simulate = (dt) => {
    let state = { position: 0, velocity: 1000 };
    for (let elapsed = 0; elapsed < 3; elapsed += dt) {
      state = gestures.stepMomentum(state, dt, -1e6, 1e6);
    }
    return state.position;
  };
  close(simulate(1 / 60), simulate(1 / 120), 2, '60 Hz and 120 Hz land at the same point');
  close(simulate(1 / 60), gestures.projectMomentumDistance(1000), 5, 'projection matches the fling');

  let state = { position: 0, velocity: 4000 };
  let settled = false;
  let maxOvershoot = 0;
  for (let frame = 0; frame < 600 && !settled; frame += 1) {
    const step = gestures.stepMomentum(state, 1 / 60, -100, 100);
    maxOvershoot = Math.max(maxOvershoot, step.position - 100);
    state = step;
    settled = step.settled;
  }
  assert.ok(settled, 'fling past an edge settles');
  assert.ok(maxOvershoot > 0, 'fling overshoots softly');
  assert.ok(state.position <= 100 && state.position >= -100, 'settled position is inside the limits');
}

// Snapping: soft radius allows free scrolling between targets.
{
  assert.equal(gestures.pickSnapTarget(0, 0, [0, 300, 600]), 0);
  assert.equal(gestures.pickSnapTarget(10, 1260, [0, 300, 600]), 300, 'flick lands on projected target');
  assert.equal(gestures.pickSnapTarget(150, 0, [0, 300, 600], { softRadius: 40 }), null, 'free between targets');
  assert.equal(gestures.pickSnapTarget(0, 0, []), null);
  const velocity = gestures.velocityToReach(20, 300);
  close(20 + gestures.projectMomentumDistance(velocity), 300, 1e-9, 'velocityToReach inverts the projection');
}

// Tap vs drag, swipe resolution, double tap.
{
  assert.equal(gestures.exceedsTapSlop(5, 5), false);
  assert.equal(gestures.exceedsTapSlop(12, 0), true);
  assert.equal(gestures.resolveSwipeDirection(-80, 5, -100), 1, 'left drag goes to next');
  assert.equal(gestures.resolveSwipeDirection(80, 5, 100), -1, 'right drag goes to previous');
  assert.equal(gestures.resolveSwipeDirection(-20, 2, -900), 1, 'short fast flick navigates');
  assert.equal(gestures.resolveSwipeDirection(-20, 2, -100), 0, 'short slow drag stays');
  assert.equal(gestures.resolveSwipeDirection(-80, 90, -900), 0, 'vertical drag never navigates');
  const detector = new gestures.DoubleTapDetector();
  assert.equal(detector.tap(0, 100, 100), false);
  assert.equal(detector.tap(200, 110, 104), true, 'close taps form a double tap');
  assert.equal(detector.tap(300, 110, 104), false, 'a double tap consumes both taps');
  assert.equal(detector.tap(1000, 300, 300), false, 'late tap starts over');
}

// Anchored zoom keeps the content point under the fingers.
{
  const offset = { x: 30, y: -12 };
  const anchor = { x: 210, y: 400 };
  const next = gestures.anchoredZoomOffset(1.5, offset, 3.2, anchor);
  const before = { x: (anchor.x - offset.x) / 1.5, y: (anchor.y - offset.y) / 1.5 };
  const after = { x: (anchor.x - next.x) / 3.2, y: (anchor.y - next.y) / 3.2 };
  close(after.x, before.x, 1e-9, 'anchored zoom x');
  close(after.y, before.y, 1e-9, 'anchored zoom y');
}

// Hub panorama camera and strip mapping.
{
  assert.equal(panorama.panoramaPanLimit(1200, 390), 405);
  assert.equal(panorama.panoramaPanLimit(300, 390), 0, 'narrow photos do not pan');
  assert.equal(panorama.panoramaPanForFraction(0.5, 1200, 405), 0);
  assert.equal(panorama.panoramaPanForFraction(0, 1200, 405), 405, 'left wall clamps to the edge');
  assert.equal(panorama.panoramaPanForFraction(0.9, 1200, 405), -405, 'right wall clamps to the edge');
  // v1.45: every artwork inside the photo and narrower than the screen is fully
  // framed by its strip target, including edge-clamped side-wall works.
  for (const [viewportWidth, viewportHeight] of [[360, 780], [375, 812], [390, 844], [414, 896], [430, 932]]) {
    const visualWidth = viewportHeight * (16 / 9);
    const limit = panorama.panoramaPanLimit(visualWidth, viewportWidth);
    for (let left = 0; left <= 1; left += 0.01) {
      for (const widthPx of [40, 120, viewportWidth * 0.6, viewportWidth - 2]) {
        const right = left + widthPx / visualWidth;
        if (right > 1) continue;
        const pan = panorama.panoramaPanForFraction((left + right) / 2, visualWidth, limit);
        const screenLeft = viewportWidth / 2 + pan + visualWidth * (left - 0.5);
        const screenRight = viewportWidth / 2 + pan + visualWidth * (right - 0.5);
        assert.ok(
          screenLeft >= -1e-6 && screenRight <= viewportWidth + 1e-6,
          `artwork ${left.toFixed(2)}+${widthPx.toFixed(0)}px is framed at ${viewportWidth}x${viewportHeight}`
        );
      }
    }
  }
  const targets = [300, 100, -50, -300];
  assert.equal(panorama.stripFractionForPan(400, targets), 0);
  assert.equal(panorama.stripFractionForPan(-400, targets), 3);
  close(panorama.stripFractionForPan(200, targets), 0.5, 1e-9, 'interpolated strip index');
  for (const fraction of [0, 0.25, 1.4, 2, 2.9, 3]) {
    close(
      panorama.stripFractionForPan(panorama.panForStripFraction(fraction, targets), targets),
      fraction,
      1e-9,
      `strip ↔ pan round trip ${fraction}`
    );
  }
  assert.equal(panorama.nearestPanoramaTarget(-60, targets), 2);
  assert.equal(panorama.nearestPanoramaTarget(0, []), -1);
  assert.equal(panorama.panoramaEdgeRoomStep(500, 405, 72), -1);
  assert.equal(panorama.panoramaEdgeRoomStep(-500, 405, 72), 1);
  assert.equal(panorama.panoramaEdgeRoomStep(450, 405, 72), 0);
}

// Device orientation: dead zone, saturation, screen rotation, neutral drift.
{
  const still = orientation.normalizeDeviceTiltUnit(52, 1.5, 0, 50, 0, 18, 2);
  assert.deepEqual(still, { x: 0, y: 0 }, 'hand tremor inside the dead zone is ignored');
  const right = orientation.normalizeDeviceTiltUnit(50, 40, 0, 50, 0, 18, 2);
  assert.equal(right.x, 1, 'large tilt saturates');
  const half = orientation.normalizeDeviceTiltUnit(50, 10, 0, 50, 0, 18, 2);
  close(half.x, 0.5, 1e-9, 'response is continuous past the dead zone');
  const landscape = orientation.normalizeDeviceTiltUnit(60, 0, 90, 50, 0, 18, 0);
  close(landscape.x, 10 / 18, 1e-9, 'landscape maps beta to the screen x axis');
  close(landscape.y, 0, 1e-9, 'landscape removes beta from the screen y axis');
  const tilt = orientation.normalizeDeviceArtworkTilt(50, 18, 0, 50, 0, 18, 3.5, 0);
  close(tilt.tiltY, 3.5, 1e-9, 'artwork tilt honours the maximum');
  let neutral = { beta: 50, gamma: 0 };
  for (let i = 0; i < 1500; i += 1) {
    neutral = orientation.driftDeviceNeutral(neutral, { beta: 70, gamma: 10 }, 1 / 60);
  }
  close(neutral.beta, 70, 0.5, 'neutral drifts to the new resting pose');
  close(neutral.gamma, 10, 0.5, 'neutral gamma drifts too');
  const wrapped = orientation.driftDeviceNeutral({ beta: 179, gamma: 0 }, { beta: -179, gamma: 0 }, 0.5);
  assert.ok(wrapped.beta > 179, 'drift follows the short way across ±180°');
}

// v1.46 (C1): phone info sheet with three stops (peek, half, full).
{
  const stops = [110, 270, 520];
  const sheet = (from, dy, v) => gestures.resolveSheetStop(from, stops, dy, v);
  assert.deepEqual(sheet(1, 3, 0), { kind: 'toggle' }, 'a tap on the handle toggles');
  assert.deepEqual(sheet(1, -90, 0), { kind: 'stop', index: 2 }, 'pulling up from half opens full');
  assert.deepEqual(sheet(0, -60, 0), { kind: 'stop', index: 1 }, 'pulling up from peek opens half');
  assert.deepEqual(sheet(0, -420, 0), { kind: 'stop', index: 2 }, 'a long pull from peek reaches full');
  assert.deepEqual(sheet(0, -20, -900), { kind: 'stop', index: 1 }, 'a short upward flick moves one stop up');
  assert.deepEqual(sheet(0, -60, -2400), { kind: 'stop', index: 2 }, 'a strong upward flick skips to full');
  assert.deepEqual(sheet(2, -60, 0), { kind: 'stop', index: 2 }, 'pulling up a full sheet keeps it');
  assert.deepEqual(sheet(2, 90, 0), { kind: 'stop', index: 1 }, 'pulling down from full returns to half');
  assert.deepEqual(sheet(1, 90, 0), { kind: 'stop', index: 0 }, 'pulling down from half shows the peek');
  assert.deepEqual(sheet(0, 60, 0), { kind: 'dismiss' }, 'pulling down the peek dismisses');
  assert.deepEqual(sheet(1, 260, 0), { kind: 'dismiss' }, 'pulling far below the peek dismisses');
  assert.deepEqual(sheet(0, 20, 900), { kind: 'dismiss' }, 'a short downward flick on the peek dismisses');
  assert.deepEqual(sheet(1, 20, 100), { kind: 'stop', index: 1 }, 'a short slow drag springs back');
  assert.deepEqual(sheet(1, 20, -900), { kind: 'stop', index: 1 }, 'a flick against the drag direction does nothing');
}

// v1.43: wheel deltas in line/page mode zoom like pixel mode; huge events are capped.
{
  assert.equal(gestures.normalizeWheelDelta(-100, 0), -100, 'pixel mode passes through');
  assert.equal(gestures.normalizeWheelDelta(-3, 1), -3 * gestures.WHEEL_LINE_PX, 'line mode converts to pixels');
  assert.equal(gestures.normalizeWheelDelta(1, 2, 900), 240, 'page mode is capped to one large notch');
  assert.equal(gestures.normalizeWheelDelta(-5000, 0), -240, 'an extreme pixel delta is capped');
}

// v1.45: one multiplicative zoom curve for gallery and room; pinch is amplified.
{
  const notch = gestures.wheelZoomFactor(-100);
  close(notch, Math.exp(0.12), 1e-9, 'one 100 px notch zooms in by the shared rate');
  close(gestures.wheelZoomFactor(-100) * gestures.wheelZoomFactor(100), 1, 1e-12, 'in and out notches cancel');
  close(gestures.wheelZoomFactor(-50) ** 2, notch, 1e-12, 'two half notches equal one notch (no acceleration)');
  assert.ok(gestures.wheelZoomFactor(-4, true) > gestures.wheelZoomFactor(-4), 'trackpad pinch gets extra gain');
  close(Math.log(gestures.wheelZoomFactor(-4, true)) / Math.log(gestures.wheelZoomFactor(-4)), gestures.PINCH_WHEEL_GAIN, 1e-9, 'pinch gain');
  assert.equal(gestures.wheelZoomFactor(Number.NaN), 1, 'invalid deltas do not zoom');
  assert.equal(gestures.ZOOM_STEP_FACTOR, 1.25, 'button/key step stays 25 %');
}

console.log('Touch gesture, hub panorama, device-tilt, info-sheet, wheel and zoom-curve checks passed.');
