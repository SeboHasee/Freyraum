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

function polygonSpan(polygon, axis) {
  const values = polygon.map((corner) => corner[axis]);
  return { min: Math.min(...values), max: Math.max(...values) };
}

const MIRROR_TOLERANCE = 0.01;
const ROOM_SIZE = 7;
const ROOM_HEIGHT = 3.4;
const DOORWAY_WIDTH = 1.05;
const DOORWAY_HEIGHT = 2.3;

const [museumHub, geometry, backgroundFallback, artworkImageSources, sourceToPixelOutcome] = await Promise.all([
  loadTsModule('src/config/museumHub.ts'),
  loadTsModule('src/hub/projectiveGeometry.ts'),
  loadTsModule('src/hub/backgroundFallback.ts'),
  loadTsModule('src/utils/artworkImageSources.ts'),
  loadTsModule('src/utils/sourceToPixelOutcome.ts'),
]);
const shippingConfig = JSON.parse(readFileSync(SHIPPING_CONFIG_PATH, 'utf8'));

assert.equal(shippingConfig.version, 4, 'shipping config must use the calibrated v4 room model');
assert.equal(shippingConfig.visualTokens.galleryWall, '#D8DDDB');
assert.equal(shippingConfig.visualTokens.museumWall, '#D8DDDB');
assert.equal(shippingConfig.backgroundFallback.src, 'Backgrounds/museum-empty.png');
assert.ok(shippingConfig.camera, 'shipping config must define one camera calibration');
assert.equal(shippingConfig.camera.far, 40, 'shipping config must define a finite camera far plane');
assert.equal(shippingConfig.camera.target.y, 1.55, 'shipping camera target must sit on the shared 1.55 m artwork centerline');
assert.deepEqual(shippingConfig.camera.lensShift, { x: 0, y: 0 }, 'shipping config must define the authoritative camera lens shift');
assert.ok(shippingConfig.room, 'shipping config must define a room envelope');
assert.ok(shippingConfig.hangingRules, 'shipping config must define shared hanging rules');
assert.equal(shippingConfig.hangingRules.doorwayClearance, 0.35, 'hero layout must enforce the raised 0.35 m doorway clearance');
assert.equal(shippingConfig.slotsPerPage, 6, 'shipping config must page six hero slots');

// ── Square-room invariants ───────────────────────────────────────────────────
// The hub room is a precise 7 × 7 m square with 90° corners and uniform 3.4 m
// walls: three rendered walls (front/left/right) plus one bounds-only entrance
// wall that closes the floor loop but is never rendered.
const outline = shippingConfig.room.floorOutline;
assert.equal(outline.length, 4, 'floor outline must be a quad');
const outlineX = polygonSpan(outline, 'x');
const outlineZ = polygonSpan(outline, 'z');
assert.ok(Math.abs(outlineX.max - outlineX.min - ROOM_SIZE) < 1e-9, 'floor outline must span exactly 7 m in x');
assert.ok(Math.abs(outlineZ.max - outlineZ.min - ROOM_SIZE) < 1e-9, 'floor outline must span exactly 7 m in z');
for (const corner of outline) {
  assert.ok(
    (corner.x === outlineX.min || corner.x === outlineX.max) && (corner.z === outlineZ.min || corner.z === outlineZ.max),
    'floor outline must stay axis-aligned (true square, no splay)'
  );
}
assert.equal(shippingConfig.room.floorY, 0);
assert.equal(shippingConfig.room.ceilingY, ROOM_HEIGHT);

assert.ok(Array.isArray(shippingConfig.walls) && shippingConfig.walls.length === 4, 'shipping config must define four square-room wall planes');
const wallsById = new Map(shippingConfig.walls.map((wall) => [wall.id, wall]));
const renderedWalls = shippingConfig.walls.filter((wall) => wall.role !== 'bounds-only');
const boundsOnlyWalls = shippingConfig.walls.filter((wall) => wall.role === 'bounds-only');
assert.equal(renderedWalls.length, 3, 'square room renders exactly three walls (front/left/right)');
assert.equal(boundsOnlyWalls.length, 1, 'square room defines exactly one bounds-only entrance wall');
assert.equal(boundsOnlyWalls[0].group, 'rear', 'the unrendered wall must be the rear entrance wall');
assert.deepEqual(
  new Set(renderedWalls.map((wall) => wall.group)),
  new Set(['front', 'left', 'right']),
  'rendered walls must cover the front/left/right groups exactly once'
);
for (const wall of shippingConfig.walls) {
  assert.ok(wall.transform, `${wall.id} must define an explicit wall transform`);
  assert.ok(Math.abs(wall.transform.width - ROOM_SIZE) < 1e-9, `${wall.id} must be exactly 7 m wide`);
  assert.ok(Math.abs(wall.transform.height - ROOM_HEIGHT) < 1e-9, `${wall.id} must be uniformly 3.4 m tall`);
  assert.deepEqual(wall.transform.axisV, { x: 0, y: 1, z: 0 }, `${wall.id} must be vertical`);
  const u = wall.transform.axisU;
  assert.ok(
    (Math.abs(Math.abs(u.x) - 1) < 1e-9 && u.y === 0 && u.z === 0) || (u.x === 0 && u.y === 0 && Math.abs(Math.abs(u.z) - 1) < 1e-9),
    `${wall.id} axisU must be axis-aligned`
  );
}
for (const wall of renderedWalls) {
  assert.ok(wall.quad, `${wall.id} must define a stage reference quad`);
  assert.ok(wall.drawableRegion, `${wall.id} must define a drawable region`);
  assert.ok(wall.hangingBand, `${wall.id} must define an authoritative wall hanging band`);
  assert.ok(Array.isArray(wall.exclusionPolygons), `${wall.id} must define explicit doorway exclusion polygons`);
}
// 90° corners: consecutive perimeter walls (front → right → rear → left) must
// have orthogonal axisU directions and form a closed perimeter loop.
const perimeter = ['wall-front', 'wall-right', 'wall-rear', 'wall-left'].map((id) => {
  const wall = wallsById.get(id);
  assert.ok(wall, `square room must keep the stable wall id "${id}"`);
  return wall.transform;
});
for (let i = 0; i < perimeter.length; i += 1) {
  const a = perimeter[i];
  const b = perimeter[(i + 1) % perimeter.length];
  const dot = a.axisU.x * b.axisU.x + a.axisU.y * b.axisU.y + a.axisU.z * b.axisU.z;
  assert.ok(Math.abs(dot) < 1e-9, 'adjacent walls must meet at exact 90° corners');
  const endX = a.origin.x + a.axisU.x * a.width;
  const endZ = a.origin.z + a.axisU.z * a.width;
  assert.ok(Math.abs(endX - b.origin.x) < 1e-9 && Math.abs(endZ - b.origin.z) < 1e-9, 'wall perimeter must form a closed square loop');
}

// Exactly two identical mirrored doorways, one per side wall, floor-based.
const leftWall = wallsById.get('wall-left');
const rightWall = wallsById.get('wall-right');
const frontWall = wallsById.get('wall-front');
assert.equal((frontWall.exclusionPolygons ?? []).length, 0, 'front wall must have no doorway');
assert.equal(leftWall.exclusionPolygons.length, 1, 'left wall must have exactly one doorway');
assert.equal(rightWall.exclusionPolygons.length, 1, 'right wall must have exactly one doorway');
const leftDoorU = polygonSpan(leftWall.exclusionPolygons[0], 'x');
const leftDoorV = polygonSpan(leftWall.exclusionPolygons[0], 'y');
const rightDoorU = polygonSpan(rightWall.exclusionPolygons[0], 'x');
const rightDoorV = polygonSpan(rightWall.exclusionPolygons[0], 'y');
for (const [doorU, doorV, id] of [
  [leftDoorU, leftDoorV, 'wall-left'],
  [rightDoorU, rightDoorV, 'wall-right'],
]) {
  assert.ok(Math.abs(doorU.max - doorU.min - DOORWAY_WIDTH) < 1e-9, `${id} doorway must be exactly 1.05 m wide`);
  assert.ok(Math.abs(doorV.max - doorV.min - DOORWAY_HEIGHT) < 1e-9, `${id} doorway must be exactly 2.30 m tall`);
  assert.ok(Math.abs(doorV.min) < 1e-9, `${id} doorway must be floor-based`);
}
assert.ok(
  Math.abs(rightDoorU.min - (ROOM_SIZE - leftDoorU.max)) <= MIRROR_TOLERANCE
    && Math.abs(rightDoorU.max - (ROOM_SIZE - leftDoorU.min)) <= MIRROR_TOLERANCE,
  'side-wall doorways must be mirrored within 1 cm'
);

// ── 2 + 2 + 2 slot composition on the shared 1.55 m centerline ──────────────
assert.equal(shippingConfig.slots.length, 6, 'hero room must define six slots');
const slotsByWall = { 'wall-front': [], 'wall-left': [], 'wall-right': [] };
for (const slot of shippingConfig.slots) {
  assert.ok(slot.placement.anchor, `${slot.id} must use a metric-like wall-local anchor`);
  assert.ok(slot.placement.uv, `${slot.id} must define a normalized wall-local anchor`);
  assert.equal(slot.placement.targetSizePolicy, 'contain', `${slot.id} must use a deterministic size policy`);
  assert.ok(Math.abs(slot.placement.anchor.y - 1.55) < 1e-9, `${slot.id} must sit on the shared 1.55 m centerline`);
  slotsByWall[slot.placement.wallId]?.push(slot);
}
assert.equal(slotsByWall['wall-front'].length, 2, 'front wall must carry exactly two slots');
assert.equal(slotsByWall['wall-left'].length, 2, 'left wall must carry exactly two slots');
assert.equal(slotsByWall['wall-right'].length, 2, 'right wall must carry exactly two slots');
// Exact mirror pairing: wall-left.X ↔ wall-right.X.
for (const leftSlot of slotsByWall['wall-left']) {
  const counterpartId = leftSlot.id.replace('wall-left', 'wall-right');
  const rightSlot = shippingConfig.slots.find((slot) => slot.id === counterpartId);
  assert.ok(rightSlot, `${leftSlot.id} must have the mirrored counterpart ${counterpartId}`);
  assert.ok(
    Math.abs(rightSlot.placement.anchor.x - (ROOM_SIZE - leftSlot.placement.anchor.x)) <= MIRROR_TOLERANCE,
    `${counterpartId} must mirror ${leftSlot.id} within 1 cm`
  );
  assert.ok(
    Math.abs(rightSlot.placement.mountedHeight - leftSlot.placement.mountedHeight) <= MIRROR_TOLERANCE,
    `${counterpartId} must match the mounted height of ${leftSlot.id}`
  );
}

const artworks = [
  {
    id: 'fraktal',
    title: 'Fraktal',
    image: 'fraktal.png',
    webglImage: 'data:image/png;base64,AAAA',
    dimensions: { width: 900, height: 1200 },
  },
  { id: 'akt-27', title: 'Akt 27', image: 'akt-27.png', dimensions: { width: 1200, height: 1200 } },
  { id: 'landscape-fixture', title: 'Landscape', image: 'landscape.png', dimensions: { width: 1800, height: 1100 } },
  { id: 'landscape-fixture-2', title: 'Landscape II', image: 'landscape-2.png', dimensions: { width: 1800, height: 1100 } },
  { id: 'square-fixture', title: 'Square', image: 'square.png', dimensions: { width: 1000, height: 1000 } },
  { id: 'square-fixture-2', title: 'Square II', image: 'square-2.png', dimensions: { width: 1100, height: 1100 } },
];
const sourcePlan = artworkImageSources.resolveArtworkImageSources(artworks[0]);
assert.equal(sourcePlan.primary?.mode, 'declared-image', 'artwork source resolution must keep the declared image as primary');
assert.equal(sourcePlan.primary?.declaredUrl, 'fraktal.png');
assert.equal(sourcePlan.primary?.resolvedUrl, 'fraktal.png');
assert.equal(sourcePlan.fallback?.mode, 'embedded-webgl-fallback', 'artwork source resolution must expose the embedded fallback separately');
assert.equal(sourcePlan.fallback?.declaredUrl, 'data:image/png;base64,AAAA');
assert.equal(sourcePlan.fallback?.resolvedUrl, 'data:image/png;base64,AAAA');
assert.equal(sourcePlan.primary?.declaredUrlType, 'local-relative');
assert.equal(sourcePlan.primary?.resolvedUrlType, 'local-relative');
const bundleScopedSourcePlan = artworkImageSources.resolveArtworkImageSources({
  image: './images/fraktal.png',
  webglImage: 'data:image/png;base64,AAAA',
  imageSourceContext: {
    bundleId: 'bundle-test',
    assetBaseUrl: 'file:///tmp/freyraum/customer-preview/',
  },
});
assert.equal(
  bundleScopedSourcePlan.primary?.resolvedUrl,
  'file:///tmp/freyraum/customer-preview/images/fraktal.png',
  'bundle-scoped source resolution must resolve relative artwork paths against the generated script base'
);
assert.equal(bundleScopedSourcePlan.primary?.resolvedUrlType, 'file-url');
assert.equal(bundleScopedSourcePlan.primary?.bundleId, 'bundle-test');
assert.equal(
  sourceToPixelOutcome.shouldRunVisiblePixelProbe({
    runtimeProtocol: 'file:',
    resolvedUrlType: 'file-url',
    debugEnabled: false,
  }),
  true,
  'file:// preview must require authoritative visible-pixel proof for file-url artwork sources'
);
assert.equal(
  sourceToPixelOutcome.shouldRunVisiblePixelProbe({
    runtimeProtocol: 'https:',
    resolvedUrlType: 'external-http',
    debugEnabled: false,
  }),
  false,
  'server-backed artwork sources must not pay the visible-pixel probe cost by default'
);
assert.equal(
  sourceToPixelOutcome.shouldRunVisiblePixelProbe({
    runtimeProtocol: 'https:',
    resolvedUrlType: 'data-uri',
    debugEnabled: true,
  }),
  true,
  'verbose diagnostics must be able to force visible-pixel proof in any environment'
);
assert.equal(
  sourceToPixelOutcome.shouldRetryEmbeddedFallbackAfterPostUploadFailure(
    {
      runtimeProtocol: 'file:',
      resolvedUrlType: 'file-url',
      debugEnabled: false,
    },
    true
  ),
  true,
  'file:// preview must retry the embedded fallback after a post-upload failure when one exists'
);
assert.equal(
  sourceToPixelOutcome.shouldRetryEmbeddedFallbackAfterPostUploadFailure(
    {
      runtimeProtocol: 'https:',
      resolvedUrlType: 'external-http',
      debugEnabled: false,
    },
    true
  ),
  false,
  'server-backed artwork sources must keep the declared image primary outside explicit debug proof'
);
const shipping = museumHub.resolveMuseumHub(artworks, shippingConfig, null);
assert.deepEqual(shipping.warnings, [], `shipping calibration warnings: ${shipping.warnings.join('; ')}`);
assert.equal(shipping.camera.verticalFovDeg, shippingConfig.camera.verticalFovDeg);
assert.equal(shipping.slotsPerPage, 6, 'resolved hub must page six hero slots');
assert.equal(shipping.walls.length, 3, 'resolver must render exactly three walls (bounds-only rear wall skipped)');
assert.equal(shipping.room.wallIds.length, 3, 'resolved room must track the rendered wall ids');
assert.deepEqual(shipping.hangingRules, shippingConfig.hangingRules, 'resolved room must retain hanging rules');
assert.deepEqual(shipping.artworkSourceById.get('fraktal'), {
  image: 'fraktal.png',
  webglImage: 'data:image/png;base64,AAAA',
  dimensions: { width: 900, height: 1200 },
}, 'resolved hub must retain both declared artwork image and embedded fallback sources');
for (const wall of shipping.walls) {
  assert.ok(wall.projectionRealism?.passes, `${wall.id} must pass the wall projection realism gate`);
  assert.ok(wall.projectedQuad, `${wall.id} must retain a projected wall quad for debug/reality checks`);
  assert.ok(wall.transform, `${wall.id} must expose an authoritative world transform`);
}

// Census: with a full fixture set the hero page fills 2 + 2 + 2.
const selectableSlots = shipping.pages.flatMap((page) => page.slots).filter((slot) => slot.selectable && slot.artworkId);
assert.equal(selectableSlots.length, 6, 'all six hero slots must resolve exactly once');
const census = { front: 0, left: 0, right: 0 };
for (const slot of selectableSlots) census[slot.wallGroup] += 1;
assert.deepEqual(census, { front: 2, left: 2, right: 2 }, 'hero composition must be exactly 2 + 2 + 2');

// Shipped production reality: only fraktal + akt-27 exist; empty slots suppress.
const shippedOnly = museumHub.resolveMuseumHub(artworks.slice(0, 2), shippingConfig, null);
assert.deepEqual(shippedOnly.warnings, [], `shipped-artwork warnings: ${shippedOnly.warnings.join('; ')}`);
const shippedSlots = shippedOnly.pages.flatMap((page) => page.slots).filter((slot) => slot.selectable && slot.artworkId);
assert.equal(shippedSlots.length, 2, 'the two shipped artworks must resolve onto the front pair');
assert.ok(shippedSlots.every((slot) => slot.wallGroup === 'front'), 'shipped artworks land on the front wall pair');

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
    `${slot.id} remains an accessible target (short edge ${projection.shortEdge.toFixed(1)}px)`
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
    // localQuad and resolved doorways share the calibrated wall units, so the
    // 0.35 m clearance threshold must be scaled by the calibration factor.
    const clearance = 0.35 * (wall.localCalibrationScale?.x ?? 1);
    const artSpan = polygonSpan(projection.localQuad, 'x');
    const doorSpan = polygonSpan(doorway, 'x');
    const gap = artSpan.max <= doorSpan.min ? doorSpan.min - artSpan.max : artSpan.min - doorSpan.max;
    assert.ok(gap >= clearance - 1e-6, `${slot.id} must keep ≥ 0.35 m clearance to the doorway (got ${(gap / (wall.localCalibrationScale?.x ?? 1)).toFixed(3)} m)`);
  }
  projectedBySlot.set(slot.id, { wall, projection });
}

// One-point-perspective convergence: front wall stays flat, side families bend
// toward the room; every quad keeps clockwise winding.
for (const { wall, projection } of projectedBySlot.values()) {
  assert.ok(geometry.polygonSignedArea(projection.projectedQuad) > 0, `${wall.id} orientation must remain clockwise`);
  const slope = lineSlope(projection.projectedQuad[0], projection.projectedQuad[1]);
  if (wall.group === 'front') assert.ok(Math.abs(slope) < 0.02, `${wall.id} front-wall quads must stay flat (one-point perspective)`);
  if (wall.group === 'left') assert.ok(slope > 0.02, `${wall.id} must converge toward the room on the left family`);
  if (wall.group === 'right') assert.ok(slope < -0.02, `${wall.id} must converge toward the room on the right family`);
  if (wall.group !== 'front') {
    // On receding side walls the near and far vertical edges must differ
    // visibly (perspective foreshortening along the wall depth).
    const nearEdge = edgeLength(projection.projectedQuad[0], projection.projectedQuad[3]);
    const farEdge = edgeLength(projection.projectedQuad[1], projection.projectedQuad[2]);
    assert.ok(Math.abs(nearEdge - farEdge) > 3.5, `${wall.id} must preserve visible perspective foreshortening across the artwork quad`);
  }
}
for (const wall of shipping.walls) {
  const expected = wall.group === 'front' ? 'flat' : wall.group;
  assert.equal(
    geometry.classifyProjectionConvergence(wall.projectedQuad),
    expected,
    `${wall.id} projected wall quad must classify as "${expected}"`
  );
}

// Both side walls recede along −Z, so their vanishing points must coincide at
// the single central vanishing point inside the stage (one-point perspective).
const vanishingPoints = [];
for (const wallId of ['wall-left', 'wall-right']) {
  const wall = shipping.wallById.get(wallId);
  assert.ok(wall?.room);
  // Probe each side-wall plane at the same deep −Z coordinate (within the
  // camera far plane); both rays must converge on the shared central
  // vanishing point of the one-point perspective.
  const vanishing = geometry.projectWorldPoint(
    shipping.camera,
    { x: wall.room.origin.x, y: 1.6, z: -20 },
    shipping.stage
  );
  assert.ok(vanishing, `${wallId} must retain a finite shared vanishing direction`);
  vanishingPoints.push(vanishing);
}
// Both side walls recede along −Z (one-point perspective): at equal depth
// their rays must be mirror-symmetric about the horizontal stage center and
// already inside the stage (the splayed v0.86 room diverged off-screen).
assert.ok(
  Math.abs(vanishingPoints[0].x + vanishingPoints[1].x - shipping.stage.width) < 1,
  'side-wall depth rays must stay mirror-symmetric about the stage center'
);
assert.ok(
  Math.abs(vanishingPoints[0].y - vanishingPoints[1].y) < 1,
  'side-wall depth rays must share one horizon height'
);
for (const vanishing of vanishingPoints) {
  assert.ok(
    vanishing.x > 0 && vanishing.x < shipping.stage.width,
    'square-room depth rays must converge toward the central vanishing point inside the stage'
  );
}

// Invalid anchors must be corrected before projection and doorway overlap must
// be rejected rather than rendered on top of the void.
const leftResolved = shipping.wallById.get('wall-left');
const rightResolved = shipping.wallById.get('wall-right');
assert.ok(leftResolved?.room && rightResolved?.room);
for (const probe of [
  {
    wall: leftResolved,
    anchor: { x: 0.01, y: leftResolved.room.hangingBand.minY + 0.03 },
    mountedHeight: leftResolved.room.height * 0.42,
    aspect: 0.78,
  },
  {
    wall: rightResolved,
    anchor: { x: rightResolved.room.width - 0.01, y: rightResolved.room.hangingBand.minY + 0.03 },
    mountedHeight: rightResolved.room.height * 0.42,
    aspect: 1.9,
  },
  {
    // Anchor dropped inside the doorway void must deterministically slide out.
    wall: leftResolved,
    anchor: { x: (leftDoorU.min + leftDoorU.max) / 2, y: 1.55 },
    mountedHeight: 1.0,
    aspect: 1.2,
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
  wall.id === 'wall-left'
    ? {
        ...wall,
        exclusionPolygons: [rect(0, 0, wall.transform.width, wall.transform.height)],
      }
    : wall
);
fallbackWallConfig.slots = [
  {
    id: 'room-01.wall-left.a',
    enabled: true,
    selectable: true,
    artworkId: 'fraktal',
    placement: shippingConfig.slots.find((slot) => slot.id === 'room-01.wall-left.a').placement,
  },
];
const fallbackWallResolution = museumHub.resolveMuseumHub([artworks[0]], fallbackWallConfig, null);
const fallbackSlot = fallbackWallResolution.pages.flatMap((page) => page.slots)[0];
assert.equal(fallbackSlot.selectable, true, 'fallback-wall placement must remain selectable');
assert.notEqual(fallbackSlot.placement.wallId, 'wall-left', 'fallback-wall placement must leave the invalid wall');
assert.ok(
  ['wall-front', 'wall-right'].includes(fallbackSlot.placement.wallId),
  'fallback-wall placement must move to another rendered wall bucket'
);

// A v1 profile still resolves deterministic exact targets through the v4 model.
const legacy = museumHub.resolveMuseumHub(
  artworks,
  {
    version: 1,
    coverage: 'all-active-artworks',
    slots: [{
      id: 'room-01.legacy-a',
      enabled: true,
      selectable: true,
      artworkId: 'fraktal',
      placement: { cx: 0.185, cy: 0.514, maxW: 0.056, maxH: 0.207, rotateYDeg: 18 },
    }],
  },
  null
);
assert.equal(legacy.slotToArtwork.get('room-01.legacy-a'), 'fraktal');
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
invalidPlacementConfig.walls = invalidPlacementConfig.walls.map((wall) =>
  wall.role === 'bounds-only'
    ? wall
    : {
        ...wall,
        exclusionPolygons: [rect(0, 0, wall.transform.width, wall.transform.height)],
      }
);
invalidPlacementConfig.slots = [
  {
    id: 'room-01.wall-left.a',
    enabled: true,
    selectable: true,
    artworkId: 'fraktal',
    placement: shippingConfig.slots.find((slot) => slot.id === 'room-01.wall-left.a').placement,
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

console.log('PASS: 7×7 square room invariants, mirrored doorways, 2+2+2 hero composition, calibrated projection, fallback wall buckets, selection persistence hooks, token consistency, and 404 fallback are valid.');
