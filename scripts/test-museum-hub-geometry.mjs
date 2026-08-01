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

function edgeLength(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

const [museumHub, geometry, backgroundFallback] = await Promise.all([
  loadTsModule('src/config/museumHub.ts'),
  loadTsModule('src/hub/projectiveGeometry.ts'),
  loadTsModule('src/hub/backgroundFallback.ts'),
]);
const shippingConfig = JSON.parse(readFileSync(SHIPPING_CONFIG_PATH, 'utf8'));

assert.equal(shippingConfig.version, 4, 'shipping config must use the calibrated v4 room model');
assert.equal(shippingConfig.visualTokens.galleryWall, '#D8DDDB');
assert.equal(shippingConfig.visualTokens.museumWall, '#D8DDDB');
assert.equal(shippingConfig.backgroundFallback.src, 'Backgrounds/museum-empty.png');
assert.ok(shippingConfig.camera, 'shipping config must define one camera calibration');
assert.equal(shippingConfig.camera.far, 40, 'shipping config must define a finite camera far plane');
assert.deepEqual(shippingConfig.camera.lensShift, { x: 0, y: 0 }, 'shipping config must define the authoritative camera lens shift');
assert.ok(shippingConfig.room, 'shipping config must define a room envelope');
assert.ok(shippingConfig.hangingRules, 'shipping config must define shared hanging rules');
assert.ok(Array.isArray(shippingConfig.walls) && shippingConfig.walls.length === 4, 'shipping config must define four room wall planes');
for (const wall of shippingConfig.walls) {
  assert.ok(wall.room, `${wall.id} must define a room-local plane`);
  assert.ok(wall.transform, `${wall.id} must define an explicit wall transform`);
  assert.ok(wall.drawableRegion, `${wall.id} must define a drawable region`);
  assert.ok(Array.isArray(wall.exclusionPolygons), `${wall.id} must define explicit exclusion polygons`);
  assert.ok(wall.hangingBand, `${wall.id} must define an authoritative wall hanging band`);
  assert.ok(Array.isArray(wall.room.doorwayExclusions), `${wall.id} must define doorway exclusions`);
  assert.ok(wall.room.hangingBand, `${wall.id} must define a hanging band`);
}
for (const slot of shippingConfig.slots) {
  assert.ok(slot.placement.anchor, `${slot.id} must use a metric-like wall-local anchor`);
  assert.ok(slot.placement.uv, `${slot.id} must define a normalized wall-local anchor`);
  assert.equal(slot.placement.targetSizePolicy, 'contain', `${slot.id} must use a deterministic size policy`);
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
assert.equal(shipping.room.wallIds.length, 4, 'resolved room must track all calibrated wall ids');
assert.deepEqual(shipping.hangingRules, shippingConfig.hangingRules, 'resolved room must retain hanging rules');
for (const wall of shipping.walls) {
  assert.ok(wall.projectionRealism?.passes, `${wall.id} must pass the wall projection realism gate`);
  assert.ok(wall.projectedQuad, `${wall.id} must retain a projected wall quad for debug/reality checks`);
  assert.ok(wall.transform, `${wall.id} must expose an authoritative world transform`);
}

const selectableSlots = shipping.pages.flatMap((page) => page.slots).filter((slot) => slot.selectable && slot.artworkId);
assert.equal(selectableSlots.length, 4, 'all shipping wall slots must resolve exactly once');

const projectedBySlot = new Map();
for (const slot of selectableSlots) {
  const wall = shipping.wallById.get(slot.placement.wallId);
  assert.ok(wall?.room && wall.camera, `${slot.id} must resolve an authoritative room plane and camera`);
  const projection = geometry.projectSlotArtwork(wall, slot.placement, slot.artworkAspect, shipping.stage);
  assert.ok(projection, `${slot.id} must project through the calibrated 3D chain`);
  assert.ok(projection.worldQuad, `${slot.id} must retain a world-space quad for interaction bridging`);
  assert.ok(projection.projectedAnchor, `${slot.id} must retain a projected anchor for debug overlays`);
  assert.ok(
    projection.shortEdge >= museumHub.HUB_MIN_PROJECTED_SHORT_EDGE_PX,
    `${slot.id} remains an accessible target`
  );
  assert.deepEqual(projection.validity, {
    finite: true,
    contained: true,
    doorwayClear: true,
    inHangingBand: true,
    orientationConsistent: true,
  }, `${slot.id} must pass all local placement validity checks`);
  assert.ok(projection.realism?.passes ?? wall.projectionRealism?.passes, `${slot.id} must inherit a passing wall realism profile`);
  assert.ok(geometry.pointInPolygon(projection.projectedAnchor, projection.projectedQuad), `${slot.id} projected anchor must remain inside the final projected quad`);
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
  if (wall.id.includes('left')) assert.ok(slope > 0.02, `${wall.id} must converge toward the room on the left family`);
  if (wall.id.includes('right')) assert.ok(slope < -0.02, `${wall.id} must converge toward the room on the right family`);
  const topEdge = edgeLength(projection.projectedQuad[0], projection.projectedQuad[1]);
  const bottomEdge = edgeLength(projection.projectedQuad[3], projection.projectedQuad[2]);
  assert.ok(Math.abs(bottomEdge - topEdge) > 3.5, `${wall.id} must preserve visible perspective foreshortening across the artwork quad`);
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
      x: wall.room.origin.x + wall.room.axisU.x * sign * 24,
      y: wall.room.origin.y + wall.room.axisU.y * sign * 24 + 1.6,
      z: wall.room.origin.z + wall.room.axisU.z * sign * 24,
    },
    shipping.stage
  );
  assert.ok(vanishing, `${wallId} must retain a finite shared vanishing direction`);
  if (wallId === 'wall-left-outer') assert.ok(vanishing.x > shipping.stage.width, 'left outer wall vanishing point must stay off-screen to the right');
  else assert.ok(vanishing.x < 0, 'right outer wall vanishing point must stay off-screen to the left');
}

// Invalid anchors must be corrected before projection and doorway overlap must
// be rejected rather than rendered on top of the void.
const leftOuter = shipping.wallById.get('wall-left-outer');
const rightOuter = shipping.wallById.get('wall-right-outer');
assert.ok(leftOuter?.room && rightOuter?.room);
for (const probe of [
  {
    wall: leftOuter,
    anchor: { x: 0.01, y: leftOuter.room.hangingBand.minY + 0.03 },
    mountedHeight: leftOuter.room.height * 0.42,
    aspect: 0.78,
  },
  {
    wall: rightOuter,
    anchor: { x: rightOuter.room.width - 0.01, y: rightOuter.room.hangingBand.minY + 0.03 },
    mountedHeight: rightOuter.room.height * 0.42,
    aspect: 1.9,
  },
]) {
  const first = geometry.solveRoomArtworkPlacement(probe.wall.room, probe.anchor, probe.mountedHeight, probe.aspect);
  const second = geometry.solveRoomArtworkPlacement(probe.wall.room, probe.anchor, probe.mountedHeight, probe.aspect);
  assert.deepEqual(first, second, `${probe.wall.id} doorway-edge placements must be deterministic`);
  assert.equal(first.validity.doorwayClear, true, `${probe.wall.id} doorway-edge placement must clear the doorway`);
  assert.equal(first.validity.contained, true, `${probe.wall.id} doorway-edge placement must stay within the safe region`);
  assert.equal(first.rejectionReason, 'none', `${probe.wall.id} doorway-edge placement must resolve to a valid target`);
  assert.notEqual(first.adjustmentReason, 'none', `${probe.wall.id} doorway-edge placement must record its deterministic adjustment reason`);
}

// If one wall is fully invalid, resolution must deterministically fall back to
// the nearest valid wall bucket instead of rendering into a doorway.
const fallbackWallConfig = JSON.parse(JSON.stringify(shippingConfig));
fallbackWallConfig.walls = fallbackWallConfig.walls.map((wall) =>
  wall.id === 'wall-left-outer'
    ? {
        ...wall,
        room: {
          ...wall.room,
          doorwayExclusions: [rect(0, 0, wall.room.width, wall.room.height)],
        },
        exclusionPolygons: [rect(0, 0, wall.room.width, wall.room.height)],
      }
    : wall
);
fallbackWallConfig.slots = [
  {
    id: 'room-01.wall-left.outer',
    enabled: true,
    selectable: true,
    artworkId: 'fraktal',
    placement: shippingConfig.slots.find((slot) => slot.id === 'room-01.wall-left.outer').placement,
  },
];
const fallbackWallResolution = museumHub.resolveMuseumHub([artworks[0]], fallbackWallConfig, null);
const fallbackSlot = fallbackWallResolution.pages.flatMap((page) => page.slots)[0];
assert.equal(fallbackSlot.selectable, true, 'fallback-wall placement must remain selectable');
assert.equal(fallbackSlot.placement.wallId, 'wall-left-inner', 'fallback-wall placement must move to the next valid wall bucket');

// A v1 profile still resolves deterministic exact targets through the v4 model.
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
for (const slot of legacy.pages.flatMap((page) => page.slots)) {
  if (!slot.placement.anchor) continue;
  const wall = legacy.wallById.get(slot.placement.wallId);
  assert.ok(wall?.room, `${slot.id} migrated slot must still resolve a room plane`);
  assert.ok(slot.placement.anchor.x >= 0 && slot.placement.anchor.x <= wall.room.width, `${slot.id} migrated anchor x stays within wall bounds`);
  assert.ok(slot.placement.anchor.y >= 0 && slot.placement.anchor.y <= wall.room.height, `${slot.id} migrated anchor y stays within wall bounds`);
}

// If every wall is invalid, the slot must be suppressed instead of rendering a
// floating invalid artwork button.
const invalidPlacementConfig = JSON.parse(JSON.stringify(shippingConfig));
invalidPlacementConfig.walls = invalidPlacementConfig.walls.map((wall) => ({
  ...wall,
  room: {
    ...wall.room,
    doorwayExclusions: [rect(0, 0, wall.room.width, wall.room.height)],
  },
  exclusionPolygons: [rect(0, 0, wall.room.width, wall.room.height)],
}));
invalidPlacementConfig.slots = [
  {
    id: 'room-01.wall-left.outer',
    enabled: true,
    selectable: true,
    artworkId: 'fraktal',
    placement: {
      wallId: 'wall-left-outer',
      center: { x: 0.5, y: 0.5 },
      anchor: { x: 1.4, y: 1.78 },
      uv: { x: 0.5049, y: 0.5235 },
      mountedHeight: 1.24,
      targetSizePolicy: 'contain',
      minScale: 0.7,
      maxScale: 1,
      zOffset: 0.02,
    },
  },
];
const invalidPlacement = museumHub.resolveMuseumHub([artworks[0]], invalidPlacementConfig, null);
const invalidSlot = invalidPlacement.pages.flatMap((page) => page.slots)[0];
assert.equal(invalidPlacement.slotToArtwork.size, 0, 'invalid placement must not remain selectable');
assert.equal(invalidSlot.selectable, false, 'invalid placement slot must be disabled');
assert.equal(invalidSlot.disabledReason, 'invalid-projection', 'invalid placement must report a projection failure reason');

// Explicit 404 behavior is one bounded fallback retry, never an abort loop.
assert.equal(
  backgroundFallback.getBackgroundFallbackCandidate('/backgrounds/missing.png', '/backgrounds/museum-empty.png', false),
  '/backgrounds/museum-empty.png'
);
assert.equal(backgroundFallback.isHubAssetNotFoundStatus(404), true);
assert.equal(backgroundFallback.isHubAssetNotFoundStatus(500), false);
assert.equal(backgroundFallback.isReferenceOnlyHubAssetPath('Backgrounds/museum-target.png'), true);
assert.equal(backgroundFallback.isReferenceOnlyHubAssetPath('/backgrounds/museum-target.png'), true);
assert.equal(
  backgroundFallback.getBackgroundFallbackCandidate('/backgrounds/missing.png', '/backgrounds/museum-empty.png', true),
  null
);
assert.equal(
  backgroundFallback.getBackgroundFallbackCandidate('/backgrounds/museum-empty.png', '/backgrounds/museum-empty.png', false),
  null
);
const referenceOnly = museumHub.resolveMuseumHub(
  artworks,
  {
    version: 4,
    background: { src: 'Backgrounds/museum-target.png', aspect: shippingConfig.background.aspect },
    backgroundFallback: { src: 'Backgrounds/museum-target.png' },
    slots: shippingConfig.slots,
  },
  null
);
assert.ok(
  referenceOnly.warnings.some((warning) => /reference-only asset/i.test(warning)),
  'reference-only hub asset paths must warn instead of silently failing hosted downloads'
);

// Token sources for artwork, boot, fallback, and renderer must never use a
// white background fallback.
const scss = readFileSync(resolve(ROOT, 'src/styles/main.scss'), 'utf8');
const main = readFileSync(resolve(ROOT, 'src/main.ts'), 'utf8');
const renderer = readFileSync(resolve(ROOT, 'src/core/RendererManager.ts'), 'utf8');
const hub = readFileSync(resolve(ROOT, 'src/hub/MainMuseumHub.ts'), 'utf8');
const shell = readFileSync(resolve(ROOT, 'app.html'), 'utf8');
assert.match(scss, /#app\s*\{[\s\S]*?background:\s*var\(--color-gallery-wall\)/);
assert.match(scss, /\.fallback-screen\s*\{[\s\S]*?background:\s*var\(--color-gallery-wall\)/);
assert.match(scss, /\.museum-hub\s*\{[\s\S]*?background-color:\s*var\(--color-museum-wall\)/);
assert.match(renderer, /wallClearColor\s*=\s*['"]#d8dddb['"]/i);
assert.match(renderer, /setWallClearColor\(/);
assert.match(main, /applyResolvedWallSurfaceColor\(/);
assert.match(main, /wall-surface-snapshot/);
assert.match(main, /showFallbackScreen\(app,\s*err instanceof Error \? err\.message : 'Unbekannter Fehler beim Initialisieren\.',\s*resolvedGalleryWall\)/);
assert.match(main, /setSelectedArtworkId\(artworks\[galleryManager\.index\]\?\.id/);
assert.match(hub, /is-selected/);
assert.match(hub, /hub-selection-lifecycle/);
assert.match(hub, /worldQuad/);
assert.match(hub, /projectedAnchor/);
assert.match(shell, /#d8dddb/i);
assert.ok(!/background:\s*#fff(?:fff)?\b/i.test(scss.slice(scss.indexOf('.museum-hub {'), scss.indexOf('.museum-hub[hidden]'))));

console.log('PASS: v4 calibrated room projection, doorway exclusions, fallback wall buckets, selection persistence hooks, token consistency, and 404 fallback are valid.');
