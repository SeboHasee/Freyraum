import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, '..');
const SHIPPING_CONFIG_PATH = resolve(ROOT, 'customer-artworks/museum-hub.json');

async function loadTsModule(relativePath) {
  const result = buildSync({
    entryPoints: [resolve(ROOT, relativePath)],
    bundle: true,
    format: 'esm',
    platform: 'browser',
    write: false,
    target: ['es2020'],
  });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
}

function lineSlope(a, b) {
  return (b.y - a.y) / Math.max(1e-6, b.x - a.x);
}

function rect(minX, minY, maxX, maxY) {
  return [
    { x: minX, y: minY },
    { x: maxX, y: minY },
    { x: maxX, y: maxY },
    { x: minX, y: maxY },
  ];
}

const [museumHub, geometry, backgroundFallback] = await Promise.all([
  loadTsModule('src/config/museumHub.ts'),
  loadTsModule('src/hub/projectiveGeometry.ts'),
  loadTsModule('src/hub/backgroundFallback.ts'),
]);
const shippingConfig = JSON.parse(readFileSync(SHIPPING_CONFIG_PATH, 'utf8'));

assert.equal(shippingConfig.version, 3, 'shipping config must use the calibrated v3 room model');
assert.equal(shippingConfig.visualTokens.galleryWall, '#D8DDDB');
assert.equal(shippingConfig.visualTokens.museumWall, '#D8DDDB');
assert.equal(shippingConfig.backgroundFallback.src, 'Backgrounds/museum-empty.png');
assert.ok(shippingConfig.camera, 'shipping config must define one camera calibration');
assert.ok(Array.isArray(shippingConfig.walls) && shippingConfig.walls.length === 4, 'shipping config must define four room wall planes');
for (const wall of shippingConfig.walls) {
  assert.ok(wall.room, `${wall.id} must define a room-local plane`);
  assert.ok(Array.isArray(wall.room.doorwayExclusions), `${wall.id} must define doorway exclusions`);
  assert.ok(wall.room.hangingBand, `${wall.id} must define a hanging band`);
}
for (const slot of shippingConfig.slots) {
  assert.ok(slot.placement.anchor, `${slot.id} must use a metric-like wall-local anchor`);
}

const artworks = [
  { id: 'fraktal', title: 'Fraktal', image: 'fraktal.png', dimensions: { width: 900, height: 1200 } },
  { id: 'akt-27', title: 'Akt 27', image: 'akt-27.png', dimensions: { width: 1200, height: 1200 } },
  { id: 'landscape-fixture', title: 'Landscape', image: 'landscape.png', dimensions: { width: 1800, height: 1100 } },
  { id: 'panoramic-fixture', title: 'Panoramic', image: 'panoramic.png', dimensions: { width: 2600, height: 1000 } },
];
const shipping = museumHub.resolveMuseumHub(artworks, shippingConfig, null);
assert.deepEqual(shipping.warnings, [], `shipping calibration warnings: ${shipping.warnings.join('; ')}`);
assert.equal(shipping.camera.verticalFovDeg, shippingConfig.camera.verticalFovDeg);

const selectableSlots = shipping.pages.flatMap((page) => page.slots).filter((slot) => slot.selectable && slot.artworkId);
assert.equal(selectableSlots.length, 4, 'all shipping wall slots must resolve exactly once');

const projectedBySlot = new Map();
for (const slot of selectableSlots) {
  const wall = shipping.wallById.get(slot.placement.wallId);
  assert.ok(wall?.room && wall.camera, `${slot.id} must resolve an authoritative room plane and camera`);
  const projection = geometry.projectSlotArtwork(wall, slot.placement, slot.artworkAspect, shipping.stage);
  assert.ok(projection, `${slot.id} must project through the calibrated 3D chain`);
  assert.ok(projection.shortEdge >= 84, `${slot.id} remains an accessible target`);
  assert.deepEqual(projection.validity, {
    finite: true,
    contained: true,
    doorwayClear: true,
    inHangingBand: true,
    orientationConsistent: true,
  }, `${slot.id} must pass all local placement validity checks`);
  for (const corner of projection.projectedQuad) {
    assert.ok(geometry.pointInPolygon(corner, wall.safePolygon), `${slot.id} must stay within its projected wall safe polygon`);
  }
  for (const doorway of wall.room.doorwayExclusions) {
    assert.ok(!geometry.polygonsIntersect(projection.localQuad, doorway), `${slot.id} must not intersect a doorway exclusion`);
  }
  projectedBySlot.set(slot.id, { wall, projection });
}

// Every wall plane projects with the same winding; side families bend in their
// expected direction instead of applying independent per-slot skew matrices.
for (const { wall, projection } of projectedBySlot.values()) {
  assert.ok(geometry.polygonSignedArea(projection.projectedQuad) > 0, `${wall.id} orientation must remain clockwise`);
  const slope = lineSlope(projection.projectedQuad[0], projection.projectedQuad[1]);
  if (wall.id.includes('left-outer')) assert.ok(slope > 0.02, 'left outer wall must converge toward the room');
  if (wall.id.includes('right-outer')) assert.ok(slope < -0.02, 'right outer wall must converge toward the room');
  if (wall.id.includes('inner')) assert.ok(Math.abs(slope) < 0.02, 'inner wall family must retain a stable rear-wall orientation');
}

// The two side-wall camera-direction rays must meet opposite, bounded
// vanishing regions. This catches accidental camera or basis reversal.
for (const wallId of ['wall-left-outer', 'wall-right-outer']) {
  const wall = shipping.wallById.get(wallId);
  assert.ok(wall?.room);
  const sign = wallId === 'wall-left-outer' ? 1 : -1;
  const vanishing = geometry.projectWorldPoint(
    shipping.camera,
    {
      x: wall.room.origin.x + wall.room.axisU.x * sign * 80,
      y: wall.room.origin.y + wall.room.axisU.y * sign * 80 + 1.6,
      z: wall.room.origin.z + wall.room.axisU.z * sign * 80,
    },
    shipping.stage
  );
  assert.ok(vanishing, `${wallId} must retain a finite shared vanishing direction`);
  if (wallId === 'wall-left-outer') assert.ok(vanishing.x > shipping.stage.width / 2 && vanishing.x < shipping.stage.width);
  else assert.ok(vanishing.x > 0 && vanishing.x < shipping.stage.width / 2);
}

// Invalid anchors must be corrected before projection and doorway overlap must
// be rejected rather than rendered on top of the void.
const leftOuter = shipping.wallById.get('wall-left-outer');
assert.ok(leftOuter?.room);
const doorwayProbe = geometry.solveRoomArtworkPlacement(leftOuter.room, { x: 0.1, y: 0.5 }, 1.1, 0.8);
assert.equal(doorwayProbe.validity.doorwayClear, true);
assert.equal(doorwayProbe.validity.contained, true);

// A v1 profile still resolves deterministic exact targets through the v3 model.
const legacy = museumHub.resolveMuseumHub(
  artworks,
  {
    version: 1,
    coverage: 'all-active-artworks',
    slots: [{
      id: 'room-01.wall-left.outer',
      enabled: true,
      selectable: true,
      artworkId: 'fraktal',
      placement: { cx: 0.185, cy: 0.514, maxW: 0.056, maxH: 0.207, rotateYDeg: 18 },
    }],
  },
  null
);
assert.equal(legacy.slotToArtwork.get('room-01.wall-left.outer'), 'fraktal');
assert.ok(legacy.warnings.some((warning) => /migrated provisionally/i.test(warning)));

// Explicit 404 behavior is one bounded fallback retry, never an abort loop.
assert.equal(
  backgroundFallback.getBackgroundFallbackCandidate('/backgrounds/missing.png', '/backgrounds/museum-empty.png', false),
  '/backgrounds/museum-empty.png'
);
assert.equal(
  backgroundFallback.getBackgroundFallbackCandidate('/backgrounds/missing.png', '/backgrounds/museum-empty.png', true),
  null
);
assert.equal(
  backgroundFallback.getBackgroundFallbackCandidate('/backgrounds/museum-empty.png', '/backgrounds/museum-empty.png', false),
  null
);

// Token sources for artwork, boot, fallback, and renderer must never use a
// white background fallback.
const scss = readFileSync(resolve(ROOT, 'src/styles/main.scss'), 'utf8');
const main = readFileSync(resolve(ROOT, 'src/main.ts'), 'utf8');
const renderer = readFileSync(resolve(ROOT, 'src/core/RendererManager.ts'), 'utf8');
const shell = readFileSync(resolve(ROOT, 'app.html'), 'utf8');
assert.match(scss, /#app\s*\{[\s\S]*?background:\s*var\(--color-gallery-wall\)/);
assert.match(scss, /\.fallback-screen\s*\{[\s\S]*?background:\s*var\(--color-gallery-wall\)/);
assert.match(scss, /\.museum-hub\s*\{[\s\S]*?background-color:\s*var\(--color-museum-wall\)/);
assert.match(renderer, /wallClearColor\s*=\s*['"]#d8dddb['"]/i);
assert.match(main, /setProperty\('--color-gallery-wall', visualTokens\.galleryWall\)/);
assert.match(shell, /#d8dddb/i);
assert.ok(!/background:\s*#fff(?:fff)?\b/i.test(scss.slice(scss.indexOf('.museum-hub {'), scss.indexOf('.museum-hub[hidden]'))));

console.log('PASS: v3 calibrated room projection, placement exclusions, token consistency, and 404 fallback are valid.');
