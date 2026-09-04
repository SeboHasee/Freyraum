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

function vector3(a, b) {
  return { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
}

function dot3(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function length3(value) {
  return Math.hypot(value.x, value.y, value.z);
}

function polygonSpan(polygon, axis) {
  const values = polygon.map((corner) => corner[axis]);
  return { min: Math.min(...values), max: Math.max(...values) };
}

const MIRROR_TOLERANCE = 0.01;
const ROOM_WIDTH = 9;
const ROOM_DEPTH = 12;
const ROOM_HEIGHT = 5.2;
const DOORWAY_WIDTH = 1.05;
const DOORWAY_HEIGHT = 2.3;

const [museumHub, geometry, backgroundFallback, artworkImageSources, sourceToPixelOutcome, inspectionSafety, galleryPresentation, lightProfile, architecture, hubRoomRenderer, quality, paintingMaterial, builtInArtworks] = await Promise.all([
  loadTsModule('src/config/museumHub.ts'),
  loadTsModule('src/hub/projectiveGeometry.ts'),
  loadTsModule('src/hub/backgroundFallback.ts'),
  loadTsModule('src/utils/artworkImageSources.ts'),
  loadTsModule('src/utils/sourceToPixelOutcome.ts'),
  loadTsModule('src/gallery/inspectionSafety.ts'),
  loadTsModule('src/config/galleryPresentation.ts'),
  loadTsModule('src/lighting/LightProfile.ts'),
  loadTsModule('src/materials/ArchitecturalSurfaceFactory.ts'),
  loadTsModule('src/hub/HubRoomRenderer.ts'),
  loadTsModule('src/config/quality.ts'),
  loadTsModule('src/materials/PaintingMaterial.ts'),
  loadTsModule('src/config/artworks.ts'),
]);
const shippingConfig = JSON.parse(readFileSync(SHIPPING_CONFIG_PATH, 'utf8'));

assert.equal(shippingConfig.version, 5, 'shipping config must use the canonical v5 wall-mounting model');
assert.equal(shippingConfig.visualTokens.galleryWall, '#C7CED4');
assert.equal(shippingConfig.visualTokens.museumWall, '#C7CED4');
assert.equal(shippingConfig.backgroundFallback.src, 'Backgrounds/museum-empty.png');
assert.ok(shippingConfig.camera, 'shipping config must define one camera calibration');
assert.equal(shippingConfig.camera.far, 40, 'shipping config must define a finite camera far plane');
assert.equal(shippingConfig.camera.target.y, 2.05, 'shipping camera target must frame the raised daylit architecture');
assert.deepEqual(shippingConfig.camera.lensShift, { x: 0, y: 0 }, 'shipping config must define the authoritative camera lens shift');
assert.ok(shippingConfig.room, 'shipping config must define a room envelope');
assert.ok(shippingConfig.hangingRules, 'shipping config must define shared hanging rules');
assert.equal(shippingConfig.hangingRules.doorwayClearance, 0.35, 'hero layout must enforce the raised 0.35 m doorway clearance');
assert.equal(shippingConfig.slotsPerPage, 4, 'shipping config must limit each room to four realistically spaced works');

// ── Elongated-room invariants ────────────────────────────────────────────────
// The hub is a 9 × 12 m daylit room with exact corners and uniform 5.2 m walls.
const outline = shippingConfig.room.floorOutline;
assert.equal(outline.length, 4, 'floor outline must be a quad');
const outlineX = polygonSpan(outline, 'x');
const outlineZ = polygonSpan(outline, 'z');
assert.ok(Math.abs(outlineX.max - outlineX.min - ROOM_WIDTH) < 1e-9, 'floor outline must span exactly 9 m in x');
assert.ok(Math.abs(outlineZ.max - outlineZ.min - ROOM_DEPTH) < 1e-9, 'floor outline must span exactly 12 m in z');
for (const corner of outline) {
  assert.ok(
    (corner.x === outlineX.min || corner.x === outlineX.max) && (corner.z === outlineZ.min || corner.z === outlineZ.max),
    'floor outline must stay axis-aligned (true rectangle, no splay)'
  );
}
assert.equal(shippingConfig.room.floorY, 0);
assert.equal(shippingConfig.room.ceilingY, ROOM_HEIGHT);

assert.ok(Array.isArray(shippingConfig.walls) && shippingConfig.walls.length === 4, 'shipping config must define four room wall planes');
const wallsById = new Map(shippingConfig.walls.map((wall) => [wall.id, wall]));
const renderedWalls = shippingConfig.walls.filter((wall) => wall.role !== 'bounds-only');
const boundsOnlyWalls = shippingConfig.walls.filter((wall) => wall.role === 'bounds-only');
assert.equal(renderedWalls.length, 3, 'room renders exactly three walls (front/left/right)');
assert.equal(boundsOnlyWalls.length, 1, 'room defines exactly one bounds-only entrance wall');
assert.equal(boundsOnlyWalls[0].group, 'rear', 'the unrendered wall must be the rear entrance wall');
assert.deepEqual(
  new Set(renderedWalls.map((wall) => wall.group)),
  new Set(['front', 'left', 'right']),
  'rendered walls must cover the front/left/right groups exactly once'
);
for (const wall of shippingConfig.walls) {
  assert.ok(wall.transform, `${wall.id} must define an explicit wall transform`);
  const expectedWidth = wall.group === 'left' || wall.group === 'right' ? ROOM_DEPTH : ROOM_WIDTH;
  assert.ok(Math.abs(wall.transform.width - expectedWidth) < 1e-9, `${wall.id} must match the elongated room envelope`);
  assert.ok(Math.abs(wall.transform.height - ROOM_HEIGHT) < 1e-9, `${wall.id} must be uniformly 5.2 m tall`);
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
  assert.equal(wall.mountingZone?.length, 4, `${wall.id} must define an explicit four-corner mounting zone`);
  assert.equal(
    wall.mountingZoneConfirmed,
    false,
    `${wall.id} mounting zone must require explicit curator confirmation before editor export`
  );
  assert.ok(wall.hangingBand, `${wall.id} must define an authoritative wall hanging band`);
  assert.ok(Array.isArray(wall.exclusionPolygons), `${wall.id} must define explicit doorway exclusion polygons`);
}

const sanitizedShipping = museumHub.sanitizeMuseumHubConfig(shippingConfig);
assert.ok(sanitizedShipping.config, 'shipping v5 config must survive sanitizer round-trip');
assert.deepEqual(sanitizedShipping.warnings, [], `shipping v5 round-trip warnings: ${sanitizedShipping.warnings.join('; ')}`);
const sanitizedSlotsById = new Map(sanitizedShipping.config.slots.map((slot) => [slot.id, slot]));
for (const authored of shippingConfig.slots) {
  const restored = sanitizedSlotsById.get(authored.id);
  assert.ok(restored, `${authored.id} must survive export/import`);
  assert.equal(restored.placement.wallId, authored.placement.wallId, `${authored.id} wall ownership must round-trip exactly`);
  for (const field of ['horizontalPosition', 'centerHeight', 'physicalHeight', 'mountingGap']) {
    assert.equal(restored.placement[field], authored.placement[field], `${authored.id} ${field} must round-trip exactly`);
  }
}
// 90° corners: consecutive perimeter walls (front → right → rear → left) must
// have orthogonal axisU directions and form a closed perimeter loop.
const perimeter = ['wall-front', 'wall-right', 'wall-rear', 'wall-left'].map((id) => {
  const wall = wallsById.get(id);
  assert.ok(wall, `room must keep the stable wall id "${id}"`);
  return wall.transform;
});
for (let i = 0; i < perimeter.length; i += 1) {
  const a = perimeter[i];
  const b = perimeter[(i + 1) % perimeter.length];
  const dot = a.axisU.x * b.axisU.x + a.axisU.y * b.axisU.y + a.axisU.z * b.axisU.z;
  assert.ok(Math.abs(dot) < 1e-9, 'adjacent walls must meet at exact 90° corners');
  const endX = a.origin.x + a.axisU.x * a.width;
  const endZ = a.origin.z + a.axisU.z * a.width;
  assert.ok(Math.abs(endX - b.origin.x) < 1e-9 && Math.abs(endZ - b.origin.z) < 1e-9, 'wall perimeter must form a closed rectangular loop');
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
  Math.abs(rightDoorU.min - (ROOM_DEPTH - leftDoorU.max)) <= MIRROR_TOLERANCE
    && Math.abs(rightDoorU.max - (ROOM_DEPTH - leftDoorU.min)) <= MIRROR_TOLERANCE,
  'side-wall doorways must be mirrored within 1 cm'
);

// ── 2 + 1 + 1 optically balanced room composition ────────────────────────────
assert.equal(shippingConfig.slots.length, 4, 'each room must define four slots');
const slotsByWall = { 'wall-front': [], 'wall-left': [], 'wall-right': [] };
const expectedPhysicalHeightBySlot = new Map([
  ['room-01.wall-front.a', 1.62],
  ['room-01.wall-front.b', 1.48],
  ['room-01.wall-left.a', 1.45],
  ['room-01.wall-right.a', 1.45],
]);
const expectedCenterHeightByWall = new Map([
  ['wall-front', 2.32],
  ['wall-left', 2.3],
  ['wall-right', 2.28],
]);
const expectedHorizontalPositionBySlot = new Map([
  ['room-01.wall-front.a', 0.3],
  ['room-01.wall-front.b', 0.7],
  ['room-01.wall-left.a', 0.5],
  ['room-01.wall-right.a', 0.5],
]);
for (const slot of shippingConfig.slots) {
  assert.equal(typeof slot.placement.horizontalPosition, 'number', `${slot.id} must author one normalized wall position`);
  assert.ok(slot.placement.horizontalPosition > 0 && slot.placement.horizontalPosition < 1, `${slot.id} wall position must be interior`);
  assert.equal(slot.placement.horizontalPosition, expectedHorizontalPositionBySlot.get(slot.id), `${slot.id} must use its curated wall position`);
  assert.equal(slot.placement.centerHeight, expectedCenterHeightByWall.get(slot.placement.wallId), `${slot.id} must use its wall-specific optical centerline`);
  assert.equal(slot.placement.physicalHeight, expectedPhysicalHeightBySlot.get(slot.id), `${slot.id} must use its curated physical height`);
  assert.equal(slot.placement.mountingGap, 0.002, `${slot.id} must keep the 2 mm mounting gap`);
  const bottom = slot.placement.centerHeight - slot.placement.physicalHeight / 2;
  const top = slot.placement.centerHeight + slot.placement.physicalHeight / 2;
  assert.ok(bottom >= 1.5, `${slot.id} must retain a clear museum-scale floor margin`);
  assert.ok(top >= 3 && top <= 3.14, `${slot.id} must form a calm upper exhibition band`);
  assert.equal(slot.placement.center, undefined, `${slot.id} must not author a duplicate legacy center`);
  assert.equal(slot.placement.anchor, undefined, `${slot.id} must not author a duplicate metric anchor`);
  assert.equal(slot.placement.uv, undefined, `${slot.id} must not author a duplicate UV anchor`);
  assert.equal(slot.placement.mountedHeight, undefined, `${slot.id} must not author a duplicate legacy height`);
  slotsByWall[slot.placement.wallId]?.push(slot);
}
assert.equal(slotsByWall['wall-front'].length, 2, 'front wall must carry exactly two slots');
assert.equal(slotsByWall['wall-left'].length, 1, 'left wall must carry exactly one slot');
assert.equal(slotsByWall['wall-right'].length, 1, 'right wall must carry exactly one slot');

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
const builtInResolution = museumHub.resolveMuseumHub(builtInArtworks.artworks, undefined);
assert.equal(builtInResolution.source, 'built-in-default');
assert.deepEqual(
  builtInResolution.warnings.filter((warning) => /fallback wall|overlap|spacing|hanging band|exclusion zone/i.test(warning)),
  [],
  'the curated built-in exhibition must remain within every wall, doorway, and spacing constraint'
);
const unassignedShippingConfig = {
  ...shippingConfig,
  slots: shippingConfig.slots.map((slot) => ({ ...slot, artworkId: null })),
};
const panoramicFallbackResolution = museumHub.resolveMuseumHub(
  [
    { id: 'panoramic-a', title: 'Panoramic A', image: 'a.png', dimensions: { width: 2400, height: 1000 } },
    { id: 'panoramic-b', title: 'Panoramic B', image: 'b.png', dimensions: { width: 2400, height: 1000 } },
  ],
  unassignedShippingConfig
);
assert.equal(
  panoramicFallbackResolution.warnings.some((warning) => warning.includes('curator minimum')),
  false,
  'collision-aware fallback sizing must preserve the minimum wall spacing'
);
const mixedFallbackResolution = museumHub.resolveMuseumHub(
  [0.6, 2.4, 7, 1, 0.2, 2.4].map((aspect, index) => ({
    id: `mixed-${index}`,
    title: `Mixed ${index}`,
    image: `mixed-${index}.png`,
    dimensions: { width: aspect * 1000, height: 1000 },
  })),
  unassignedShippingConfig
);
assert.equal(
  mixedFallbackResolution.warnings.some((warning) => warning.includes('curator minimum')),
  false,
  'collision sizing must run after drawable fitting and fallback-wall assignment'
);
assert.equal(
  mixedFallbackResolution.warnings.some((warning) => warning.includes('overlaps slot')),
  false,
  'final projected interaction geometry must remain non-overlapping after fallback-wall assignment'
);
for (const slot of mixedFallbackResolution.pages.flatMap((page) => page.slots)) {
  if (!slot.selectable || !slot.artworkId) continue;
  const wall = mixedFallbackResolution.wallById.get(slot.placement.wallId);
  const projected = geometry.projectSlotArtwork(
    wall,
    slot.placement,
    slot.artworkAspect,
    mixedFallbackResolution.stage
  );
  assert.ok(projected?.placement, `${slot.id} must retain valid final mounting geometry`);
  assert.ok(
    Math.hypot(
      projected.placement.anchor.x - slot.placement.anchor.x,
      projected.placement.anchor.y - slot.placement.anchor.y
    ) < 1e-6,
    `${slot.id} renderer and interaction anchors must share the fitted placement`
  );
  assert.ok(
    Math.abs(projected.placement.mountedHeight - slot.placement.mountedHeight) < 1e-6,
    `${slot.id} renderer and interaction heights must share the fitted placement`
  );
  assert.equal(
    slot.placement.physicalHeight,
    slot.placement.mountedHeight,
    `${slot.id} canonical and legacy physical heights must stay synchronized after fitting`
  );
  assert.equal(
    slot.placement.horizontalPosition,
    slot.placement.uv.x,
    `${slot.id} canonical horizontal position must stay synchronized after fitting`
  );
  assert.equal(
    slot.placement.centerHeight,
    slot.placement.anchor.y,
    `${slot.id} canonical center height must stay synchronized after fitting`
  );
}
const frontSlotA = shippingConfig.slots.find((slot) => slot.id === 'room-01.wall-front.a');
const frontSlotB = shippingConfig.slots.find((slot) => slot.id === 'room-01.wall-front.b');
const nonAdjacentConflictConfig = {
  ...shippingConfig,
  slots: [
    {
      ...frontSlotA,
      artworkId: 'wide-explicit',
      placement: { ...frontSlotA.placement, horizontalPosition: 0.2, physicalHeight: 2 },
    },
    {
      ...frontSlotB,
      artworkId: 'narrow-explicit',
      placement: { ...frontSlotB.placement, horizontalPosition: 0.278, physicalHeight: 1 },
    },
    {
      ...frontSlotA,
      id: 'room-01.wall-front.c',
      artworkId: null,
      placement: { ...frontSlotA.placement, horizontalPosition: 0.4, physicalHeight: 1 },
    },
  ],
};
const nonAdjacentConflictResolution = museumHub.resolveMuseumHub(
  [
    { id: 'wide-explicit', title: 'Wide', image: 'wide.png', dimensions: { width: 2400, height: 1000 } },
    { id: 'narrow-explicit', title: 'Narrow', image: 'narrow.png', dimensions: { width: 500, height: 1000 } },
    { id: 'auto-narrow', title: 'Auto', image: 'auto.png', dimensions: { width: 500, height: 1000 } },
  ],
  nonAdjacentConflictConfig
);
const autoConflictSlot = nonAdjacentConflictResolution.pages
  .flatMap((page) => page.slots)
  .find((slot) => slot.artworkId === 'auto-narrow');
assert.ok(
  autoConflictSlot?.pageIndex > 0,
  `a non-adjacent auto-placement conflict must move to an overflow page: ${JSON.stringify({
    slot: autoConflictSlot,
    warnings: nonAdjacentConflictResolution.warnings,
  })}`
);
assert.equal(
  nonAdjacentConflictResolution.warnings.some(
    (warning) => warning.includes('overlaps slot') && warning.includes('wall-front.c')
  ),
  false,
  'the non-adjacent auto-placement conflict must not survive into final projected geometry'
);
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
  sourceToPixelOutcome.shouldPreferEmbeddedWebglFallback(
    {
      runtimeProtocol: 'file:',
      resolvedUrlType: 'file-url',
      debugEnabled: false,
    },
    true
  ),
  true,
  'file:// preview must prefer the embedded WebGL artwork source when one exists'
);
assert.equal(
  sourceToPixelOutcome.shouldPreferEmbeddedWebglFallback(
    {
      runtimeProtocol: 'https:',
      resolvedUrlType: 'external-http',
      debugEnabled: false,
    },
    true
  ),
  false,
  'server-backed environments must keep the declared image as the primary artwork source'
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
assert.ok(
  Math.abs(galleryPresentation.GALLERY_PRESENTATION_CONFIG.artworkWallGap - 0.14) < 1e-9,
  'interactive-gallery inspection wall must stay set back enough to preserve close-view tilt freedom'
);
assert.ok(
  lightProfile.DRAMATIC_LIGHT_PROFILE.ambientKelvin >= 4800,
  'fixed gallery lighting must keep a neutral enough ambient color temperature for concrete-grey walls'
);
assert.ok(
  lightProfile.DRAMATIC_LIGHT_PROFILE.ambientIntensity <= 0.8,
  'fixed gallery lighting ambient fill must stay soft enough to avoid washing out close artwork views'
);
assert.equal(
  lightProfile.DRAMATIC_LIGHT_PROFILE.keys.length,
  2,
  'fixed gallery lighting must keep the balanced two-key setup that flattens the wall cast'
);
assert.ok(
  lightProfile.DRAMATIC_LIGHT_PROFILE.keys[0].position.x > -5.5
    && lightProfile.DRAMATIC_LIGHT_PROFILE.keys[0].position.x < -3.5,
  'fixed gallery lighting primary key must stay on the softer near-gallery angle instead of sliding too frontal or too far left'
);
assert.ok(
  lightProfile.DRAMATIC_LIGHT_PROFILE.keys[0].kelvin >= 4300,
  'fixed gallery lighting primary key must stay neutral enough to avoid amber wall casts'
);
assert.ok(
  lightProfile.DRAMATIC_LIGHT_PROFILE.keys.reduce((sum, key) => sum + key.intensity, 0) <= 120,
  'fixed gallery lighting direct energy must stay below the washout-prone range'
);
const surfaceFactory = new architecture.ArchitecturalSurfaceFactory(256);
const surfaces = surfaceFactory.getMaterials({ wall: '#C7CED4' });
assert.ok(
  surfaces.wall.roughness >= 0.96,
  'gallery wall material must stay decisively matte'
);
assert.ok(
  surfaces.wall.normalScale.x >= 0.12 && surfaces.wall.normalScale.x <= 0.18,
  'gallery wall material must keep visible but restrained plaster normal texture'
);
assert.ok(
  surfaces.ceiling.normalScale.x < surfaces.wall.normalScale.x,
  'gallery ceiling texture must stay calmer than the wall'
);
surfaceFactory.dispose();
const hubSurfaceFactory = new architecture.ArchitecturalSurfaceFactory(256, 'hub');
const hubSurfaces = hubSurfaceFactory.getMaterials({ wall: '#C7CED4' });
assert.equal(
  hubSurfaces.wall.normalMap,
  null,
  'hub wall must not reuse the gallery plaster tile'
);
assert.equal(
  hubSurfaces.wall.roughnessMap,
  null,
  'hub wall must not expose a repeating roughness tile'
);
assert.ok(
  hubSurfaces.wall.roughness >= 0.86 && hubSurfaces.wall.roughness <= 0.9,
  'hub wall roughness must preserve a soft plaster highlight without looking polished'
);
assert.equal(
  hubSurfaces.ceiling.normalMap,
  null,
  'hub ceiling must not expose repeating plaster detail'
);
assert.equal(
  hubSurfaces.floor.normalMap,
  null,
  'hub floor must not expose repeating normal detail'
);
assert.equal(
  hubSurfaces.floor.roughnessMap,
  null,
  'hub floor must not expose repeating roughness detail'
);
assert.ok(
  hubSurfaces.floor.roughness >= 0.6 && hubSurfaces.floor.roughness <= 0.7,
  'hub floor must retain restrained satin response'
);
assert.ok(
  hubSurfaces.pocket.color.r > 0.12
    && hubSurfaces.pocket.color.g > 0.12
    && hubSurfaces.pocket.color.b > 0.12,
  'hub doorway pockets must retain visible material response instead of reading as black voids'
);
assert.equal(
  hubSurfaces.wall.userData.architecturalSurfaceProfile,
  'hub-smooth-plaster',
  'hub wall must identify its smooth light-driven plaster response'
);
assert.equal(
  hubSurfaces.floor.userData.architecturalSurfaceProfile,
  'hub-satin-mineral',
  'hub floor must identify its distinct satin mineral response'
);
assert.ok(
  architecture.HUB_WALL_SURFACE_PROFILE.colorVariation === 0
    && architecture.HUB_WALL_SURFACE_PROFILE.roughnessVariation === 0,
  'hub wall must avoid fake procedural color and roughness gradients'
);
assert.equal(
  architecture.HUB_WALL_SURFACE_PROFILE.wallNormalStrength
    + architecture.HUB_WALL_SURFACE_PROFILE.floorNormalStrength
    + architecture.HUB_WALL_SURFACE_PROFILE.floorColorVariation,
  0,
  'hub surface form must come from geometry and lighting rather than procedural modulation'
);
assert.ok(
  hubSurfaces.wall.color.r > 0.84
    && hubSurfaces.wall.color.g > 0.84
    && hubSurfaces.wall.color.b > 0.8,
  'hub wall finish must remain a bright warm off-white'
);
assert.ok(
  hubSurfaces.lightStrip.isMeshStandardMaterial
    && hubSurfaces.lightStrip.emissiveIntensity > 0
    && hubSurfaces.lightStrip.emissiveIntensity < 1,
  'hub luminaires must use restrained emissive PBR material instead of flat unlit rectangles'
);
hubSurfaceFactory.dispose();
assert.ok(
  hubRoomRenderer.HUB_LIGHTING_PROFILE.hemisphere.intensity
    <= hubRoomRenderer.HUB_LIGHTING_PROFILE.key.intensity * 0.3,
  'hub ambient wash must stay secondary to directional and local illumination'
);
assert.ok(
  hubRoomRenderer.HUB_LIGHTING_PROFILE.key.intensity
    + hubRoomRenderer.HUB_LIGHTING_PROFILE.fill.intensity <= 1,
  'hub directional energy must remain restrained'
);
assert.equal(
  hubRoomRenderer.HUB_COVE_WIDTH_M,
  0.34,
  'hub perimeter luminaires must remain narrow architectural channels'
);
assert.ok(
  hubRoomRenderer.HUB_LIGHTING_PROFILE.ceilingPanel.intensity > 0
    && hubRoomRenderer.HUB_LIGHTING_PROFILE.ceilingPanel.intensity <= 6,
  'hub area-panel energy must remain locally dominant but controlled'
);
assert.ok(
  hubRoomRenderer.HUB_LIGHTING_PROFILE.ceilingPanel.intensity
    > hubRoomRenderer.HUB_LIGHTING_PROFILE.key.intensity * 5,
  'hub ceiling area fixtures must dominate the non-occluded ambient fill'
);
assert.ok(
  hubRoomRenderer.HUB_LIGHTING_PROFILE.key.position[1] >= 7,
  'hub key must remain high enough to read as ceiling-led architectural light'
);
assert.deepEqual(
  hubRoomRenderer.HUB_AREA_LIGHT_DIRECTION,
  [0, -1, 0],
  'hub area fixtures must explicitly face down into the room'
);
assert.ok(
  hubRoomRenderer.HUB_LIGHTING_PROFILE.skylightPanel.intensity > 0
    && hubRoomRenderer.HUB_LIGHTING_PROFILE.skylightPanel.intensity
      < hubRoomRenderer.HUB_LIGHTING_PROFILE.ceilingPanel.intensity,
  'hub skylight must provide restrained local daylight beneath the clerestory'
);
assert.ok(
  hubRoomRenderer.HUB_SKYLIGHT_PROFILE.roofRise >= 0.6
    && hubRoomRenderer.HUB_SKYLIGHT_PROFILE.ribCount <= 12,
  'hub skylight must keep a clearly pitched, economical instanced roof structure'
);
assert.ok(
  hubRoomRenderer.HUB_SKYLIGHT_PROFILE.glassTransmission >= 0.6
    && hubRoomRenderer.HUB_SKYLIGHT_PROFILE.glassRoughness >= 0.12,
  'hub skylight glazing must transmit daylight without reading as perfect mirror glass'
);
assert.ok(
  hubRoomRenderer.HUB_RENDER_PROFILE.toneMappingExposure >= 0.8
    && hubRoomRenderer.HUB_RENDER_PROFILE.toneMappingExposure <= 1,
  'hub architecture exposure must retain a restrained photographic highlight shoulder'
);
assert.ok(
  hubRoomRenderer.HUB_RENDER_PROFILE.environmentIntensity <= 0.2
    && hubRoomRenderer.HUB_RENDER_PROFILE.planarReflectionHigh <= 0.18
    && hubRoomRenderer.HUB_RENDER_PROFILE.planarReflectionBalanced === 0,
  'hub planar reflection must remain subtle and quality-tiered after tone mapping'
);
assert.equal(quality.getQualityPreset('high').hubReflection, 'planar');
assert.equal(
  quality.getQualityPreset('balanced').hubReflection,
  'ibl',
  'balanced quality must avoid the extra planar reflection render'
);
const balancedPreset = quality.getQualityPreset('balanced');
const matteMaterial = new paintingMaterial.PaintingMaterial(balancedPreset);
matteMaterial.applyPresentation('matte-print', balancedPreset);
assert.ok(
  matteMaterial.specularIntensity <= 0.02,
  'matte artwork presentations must keep a very low base specular response so close views do not wash out'
);
const satinMaterial = new paintingMaterial.PaintingMaterial(balancedPreset);
satinMaterial.applyPresentation('satin-print', balancedPreset);
assert.ok(
  satinMaterial.specularIntensity > matteMaterial.specularIntensity,
  'satin presentations must still keep more sheen than matte presentations after the washout retune'
);
matteMaterial.dispose();
satinMaterial.dispose();
assert.ok(
  Math.abs(galleryPresentation.GALLERY_PRESENTATION_CONFIG.artworkWallZ + 0.182) < 1e-9,
  'interactive-gallery front wall position must reflect the deeper inspection setback'
);
const inspectionPan = inspectionSafety.getInspectionPanLimits({
  artworkWidth: 4.2,
  artworkHeight: 5.8,
  visibleWidth: 0.6,
  visibleHeight: 0.8,
  overscrollX: inspectionSafety.DEFAULT_INSPECTION_OVERSCROLL_X,
  overscrollY: inspectionSafety.DEFAULT_INSPECTION_OVERSCROLL_Y,
});
assert.ok(
  Math.abs(inspectionPan.x - 2.25) < 1e-9,
  'single-artwork inspection pan must restore a bounded horizontal reveal margin for close edge exploration'
);
assert.ok(
  Math.abs(inspectionPan.y - 2.74) < 1e-9,
  'single-artwork inspection pan must restore a bounded vertical reveal margin without returning to the old loose overscroll'
);
const closeHover = inspectionSafety.clampHoverRotationToWallClearance({
  targetRotX: 0.03,
  targetRotY: 0.018,
  artworkWidth: 4.2,
  artworkHeight: 5.8,
  bodyBackDepth: 0.032,
  wallZ: galleryPresentation.GALLERY_PRESENTATION_CONFIG.artworkWallZ,
  clearanceMargin: 0.004,
});
assert.ok(
  closeHover.appliedScale === 1,
  'close-inspection hover tilt must retain its full requested range after the front wall setback'
);
assert.ok(
  closeHover.maxBackShift <= closeHover.availableClearance + 1e-6,
  'close-inspection hover tilt must still keep the mounted artwork in front of the gallery wall'
);
const constrainedHover = inspectionSafety.clampHoverRotationToWallClearance({
  targetRotX: 0.16,
  targetRotY: 0.08,
  artworkWidth: 4.2,
  artworkHeight: 5.8,
  bodyBackDepth: 0.032,
  wallZ: galleryPresentation.GALLERY_PRESENTATION_CONFIG.artworkWallZ,
  clearanceMargin: 0.004,
});
assert.ok(
  constrainedHover.appliedScale > 0 && constrainedHover.appliedScale < 1,
  'larger overview hover tilt must still be reduced before the mounted artwork can reach the wall plane'
);
assert.ok(
  constrainedHover.maxBackShift <= constrainedHover.availableClearance + 1e-6,
  'wall-clearance clamping must remain authoritative even after the inspection setback retune'
);
const shipping = museumHub.resolveMuseumHub(artworks, shippingConfig, null);
assert.deepEqual(shipping.warnings, [], `shipping calibration warnings: ${shipping.warnings.join('; ')}`);
assert.equal(shipping.camera.verticalFovDeg, shippingConfig.camera.verticalFovDeg);
assert.equal(shipping.slotsPerPage, 4, 'resolved hub must limit each room to four artworks');
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

const invalidFrameWall = {
  ...shipping.wallById.get('wall-front').room,
  axisV: { x: 1, y: 0, z: 0 },
};
assert.equal(
  geometry.createArtworkMountingFrame(invalidFrameWall, { x: 4.5, y: 1.9 }, 2, 1, 0.002),
  null,
  'non-orthogonal wall axes must be rejected before an artwork transform is created'
);

const crowdedConfig = structuredClone(shippingConfig);
crowdedConfig.slots.find((slot) => slot.id === 'room-01.wall-front.a').placement.horizontalPosition = 0.48;
crowdedConfig.slots.find((slot) => slot.id === 'room-01.wall-front.b').placement.horizontalPosition = 0.52;
const crowded = museumHub.resolveMuseumHub(artworks, crowdedConfig, null);
assert.ok(
  crowded.warnings.some((warning) => warning.includes('curator minimum')),
  'artwork pairs below the curator spacing minimum must produce a deterministic validation warning'
);

// Census: four works fill one room; overflow must become additional rooms.
const selectableSlots = shipping.pages.flatMap((page) => page.slots).filter((slot) => slot.selectable && slot.artworkId);
assert.equal(selectableSlots.length, 6, 'all six fixture artworks must resolve exactly once across rooms');
assert.equal(shipping.pages.length, 2, 'six artworks must paginate into two museum rooms');
const firstRoomSlots = shipping.pages.find((page) => page.pageIndex === 0).slots
  .filter((slot) => slot.selectable && slot.artworkId);
const firstRoomCensus = { front: 0, left: 0, right: 0 };
for (const slot of firstRoomSlots) firstRoomCensus[slot.wallGroup] += 1;
assert.deepEqual(firstRoomCensus, { front: 2, left: 1, right: 1 }, 'each full room must use a 2 + 1 + 1 composition');
assert.ok(
  shipping.pages.every((page) => page.slots.filter((slot) => slot.selectable && slot.artworkId).length <= 4),
  'no museum room may contain more than four artworks'
);
const previousSixSlotConfig = structuredClone(shippingConfig);
previousSixSlotConfig.slotsPerPage = 6;
const previousLeftSlot = structuredClone(
  previousSixSlotConfig.slots.find((slot) => slot.id === 'room-01.wall-left.a')
);
const previousRightSlot = structuredClone(
  previousSixSlotConfig.slots.find((slot) => slot.id === 'room-01.wall-right.a')
);
previousLeftSlot.artworkId = 'landscape-fixture';
previousRightSlot.artworkId = 'landscape-fixture-2';
previousSixSlotConfig.slots = [
  previousSixSlotConfig.slots.find((slot) => slot.id === 'room-01.wall-front.a'),
  previousSixSlotConfig.slots.find((slot) => slot.id === 'room-01.wall-front.b'),
  previousLeftSlot,
  { ...structuredClone(previousLeftSlot), id: 'room-01.wall-left.b', artworkId: 'square-fixture' },
  previousRightSlot,
  { ...structuredClone(previousRightSlot), id: 'room-01.wall-right.b', artworkId: 'square-fixture-2' },
];
const migratedSixSlotResolution = museumHub.resolveMuseumHub(artworks, previousSixSlotConfig, null);
assert.ok(
  migratedSixSlotResolution.warnings.some((warning) => warning.includes('supports at most 4 artworks')),
  'previous six-slot configurations must report the four-work room migration'
);
assert.ok(
  migratedSixSlotResolution.pages.every(
    (page) => page.slots.filter((slot) => slot.selectable && slot.artworkId).length <= 4
  ),
  'previous explicit six-slot rooms must reflow overflow into additional rooms'
);
assert.equal(
  migratedSixSlotResolution.pages.flatMap((page) => page.slots)
    .filter((slot) => slot.selectable && slot.artworkId).length,
  6,
  'room-density migration must preserve every explicit artwork mapping'
);
const migratedFirstRoomCensus = { front: 0, left: 0, right: 0 };
for (const slot of migratedSixSlotResolution.pages[0].slots) migratedFirstRoomCensus[slot.wallGroup] += 1;
assert.deepEqual(
  migratedFirstRoomCensus,
  { front: 2, left: 1, right: 1 },
  'legacy reflow must remount the retained first batch through the full 2+1+1 template'
);
const sparsePageConfig = structuredClone(shippingConfig);
for (const slot of sparsePageConfig.slots) slot.id = slot.id.replace('room-01', 'room-03');
const sparsePageResolution = museumHub.resolveMuseumHub(artworks.slice(0, 2), sparsePageConfig, null);
assert.deepEqual(
  sparsePageResolution.pages.map((page) => page.pageIndex),
  [0],
  'authored sparse room numbers must normalize to contiguous navigable page indices'
);

// Shipped production reality: only fraktal + akt-27 exist; empty slots suppress.
const shippedOnly = museumHub.resolveMuseumHub(artworks.slice(0, 2), shippingConfig, null);
assert.deepEqual(shippedOnly.warnings, [], `shipped-artwork warnings: ${shippedOnly.warnings.join('; ')}`);
const shippedSlots = shippedOnly.pages.flatMap((page) => page.slots).filter((slot) => slot.selectable && slot.artworkId);
assert.equal(shippedSlots.length, 2, 'the two shipped artworks must resolve onto the front pair');
assert.ok(shippedSlots.every((slot) => slot.wallGroup === 'front'), 'shipped artworks land on the front wall pair');

const projectedBySlot = new Map();
const localPlacementsByWall = new Map();
const roomCenter = {
  x: (shipping.room.bounds.min.x + shipping.room.bounds.max.x) / 2,
  y: (shipping.room.floorY + shipping.room.ceilingY) / 2,
  z: (shipping.room.bounds.min.z + shipping.room.bounds.max.z) / 2,
};
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
  assert.equal(slot.placement.centerHeight, expectedCenterHeightByWall.get(slot.placement.wallId), `${slot.id} resolved optical center height must remain authoritative`);
  const baselineSlotId = slot.id.replace(/^room-\d+/, 'room-01');
  assert.equal(slot.placement.physicalHeight, expectedPhysicalHeightBySlot.get(baselineSlotId), `${slot.id} resolved physical height must remain authoritative`);
  assert.equal(slot.placement.mountingGap, 0.002, `${slot.id} resolved mounting gap must remain authoritative`);
  const mountingFrame = geometry.createArtworkMountingFrame(
    wall.room,
    slot.placement.anchor,
    slot.placement.physicalHeight,
    slot.artworkAspect,
    slot.placement.mountingGap
  );
  assert.ok(mountingFrame, `${slot.id} must produce a valid orthonormal mounting frame`);
  assert.ok(Math.abs(dot3(mountingFrame.basisU, mountingFrame.basisV)) < 1e-5, `${slot.id} wall axes must stay orthogonal`);
  const inward = vector3(mountingFrame.wallCenter, roomCenter);
  assert.ok(dot3(mountingFrame.basisN, inward) > 0, `${slot.id} front face must point into the museum`);
  const backOffset = vector3(mountingFrame.wallCenter, mountingFrame.backCenter);
  const frontOffset = vector3(mountingFrame.backCenter, mountingFrame.frontCenter);
  assert.ok(Math.abs(dot3(backOffset, mountingFrame.basisN) - 0.002) < 1e-9, `${slot.id} back must clear wall by exactly 2 mm`);
  assert.ok(Math.abs(dot3(frontOffset, mountingFrame.basisN) - 0.022) < 1e-9, `${slot.id} body must retain exactly 22 mm depth`);
  assert.ok(Math.abs(length3(vector3(mountingFrame.frontQuad[0], mountingFrame.frontQuad[1])) / length3(vector3(mountingFrame.frontQuad[0], mountingFrame.frontQuad[3])) - slot.artworkAspect) < 1e-9, `${slot.id} must preserve source aspect ratio`);
  for (let cornerIndex = 0; cornerIndex < 4; cornerIndex += 1) {
    assert.ok(
      length3(vector3(projection.worldQuad[cornerIndex], mountingFrame.frontQuad[cornerIndex])) < 1e-9,
      `${slot.id} interaction quad must use the mounted front face`
    );
  }
  assert.ok(projection.realism?.passes ?? wall.projectionRealism?.passes, `${slot.id} must inherit a passing wall realism profile`);
  assert.ok(projection.alignment?.passes, `${slot.id} must remain rigid and parallel to its wall`);
  assert.ok(projection.alignment.normalDot >= 1 - 1e-6, `${slot.id} normal must match its wall normal`);
  assert.ok(projection.alignment.wallOffsetSpread <= 1e-6, `${slot.id} corners must share one wall-parallel plane`);
  if (slot.wallGroup === 'left' || slot.wallGroup === 'right') {
    assert.ok(
      projection.alignment.horizontalVanishingResidualPx !== null
      && projection.alignment.horizontalVanishingResidualPx <= 0.01,
      `${slot.id} horizontal edges must share the calibrated side-wall vanishing point`
    );
    assert.ok(
      Math.abs(projection.alignment.wallHorizontalVanishingPoint.x - shipping.stage.width / 2) <= 0.01,
      `${slot.id} side-wall vanishing point must remain on the calibrated horizontal center`
    );
  }
  assert.ok(geometry.pointInPolygon(projection.projectedAnchor, projection.projectedQuad), `${slot.id} projected anchor must remain inside the final projected quad`);
  const floorPoint = geometry.projectRoomWallPoint(
    wall.room,
    wall.camera,
    { x: projection.placement.anchor.x, y: 0 },
    shipping.stage
  );
  assert.ok(floorPoint, `${slot.id} must project its local floor reference`);
  assert.ok(
    floorPoint.y - projection.bounds.maxY >= 38,
    `${slot.id} must retain at least 38 px of visible wall below the artwork`
  );
  const localSpan = polygonSpan(projection.localQuad, 'x');
  assert.ok(
    localSpan.min >= 0.65 && wall.room.width - localSpan.max >= 0.65,
    `${slot.id} must retain at least 0.65 m from both wall corners`
  );
  if (slot.wallGroup === 'left') {
    assert.ok(
      wall.room.width - localSpan.max >= 4,
      `${slot.id} must remain at least 4.00 m from the left/front-wall corner`
    );
  } else if (slot.wallGroup === 'right') {
    assert.ok(
      localSpan.min >= 4,
      `${slot.id} must remain at least 4.00 m from the right/front-wall corner`
    );
  }
  if (slot.wallGroup === 'left' || slot.wallGroup === 'right') {
    const frontLocalX = slot.wallGroup === 'left' ? wall.room.width : 0;
    const seamBottom = geometry.projectRoomWallPoint(
      wall.room,
      wall.camera,
      { x: frontLocalX, y: 0 },
      shipping.stage
    );
    const seamTop = geometry.projectRoomWallPoint(
      wall.room,
      wall.camera,
      { x: frontLocalX, y: wall.room.height },
      shipping.stage
    );
    assert.ok(seamBottom && seamTop, `${slot.id} must project the visible front-wall seam`);
    for (const corner of projection.projectedQuad) {
      const seamProgress = (corner.y - seamTop.y) / (seamBottom.y - seamTop.y);
      const seamX = seamTop.x + (seamBottom.x - seamTop.x) * seamProgress;
      assert.ok(
        slot.wallGroup === 'left' ? corner.x <= seamX - 12 : corner.x >= seamX + 12,
        `${slot.id} must retain at least 12 px from the visible front-wall corner seam`
      );
    }
    const doorway = wall.room.doorwayExclusions[0];
    const doorwayInnerLocalX = slot.wallGroup === 'left'
      ? Math.max(...doorway.map((corner) => corner.x))
      : Math.min(...doorway.map((corner) => corner.x));
    const doorwayBottom = geometry.projectRoomWallPoint(
      wall.room,
      wall.camera,
      { x: doorwayInnerLocalX, y: 0 },
      shipping.stage
    );
    const doorwayTop = geometry.projectRoomWallPoint(
      wall.room,
      wall.camera,
      { x: doorwayInnerLocalX, y: Math.max(...doorway.map((corner) => corner.y)) },
      shipping.stage
    );
    assert.ok(doorwayBottom && doorwayTop, `${slot.id} must project the visible doorway reveal`);
    for (const corner of projection.projectedQuad) {
      const doorwayProgress = (corner.y - doorwayTop.y) / (doorwayBottom.y - doorwayTop.y);
      const doorwayX = doorwayTop.x + (doorwayBottom.x - doorwayTop.x) * doorwayProgress;
      assert.ok(
        slot.wallGroup === 'left' ? corner.x >= doorwayX + 12 : corner.x <= doorwayX - 12,
        `${slot.id} must retain at least 12 px from the visible doorway reveal`
      );
    }
  }
  for (const corner of projection.projectedQuad) {
    assert.ok(geometry.pointInPolygon(corner, wall.safePolygon), `${slot.id} must stay within its projected wall safe polygon`);
    assert.ok(geometry.pointInPolygon(corner, wall.mountingZone), `${slot.id} complete body must stay within its explicit mounting zone`);
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
  const wallPageKey = `${slot.pageIndex}:${wall.id}`;
  const wallPlacements = localPlacementsByWall.get(wallPageKey) ?? [];
  wallPlacements.push({ slot, projection });
  localPlacementsByWall.set(wallPageKey, wallPlacements);
}

for (const placements of localPlacementsByWall.values()) {
  if (placements.length !== 2) continue;
  const centerDelta = Math.abs(
    placements[0].projection.projectedAnchor.y - placements[1].projection.projectedAnchor.y
  );
  assert.ok(centerDelta <= 18, `same-wall optical centers must remain within 18 px (got ${centerDelta.toFixed(1)} px)`);
}

for (const [wallPageKey, placements] of localPlacementsByWall) {
  placements.sort((a, b) => a.projection.placement.anchor.x - b.projection.placement.anchor.x);
  for (let index = 1; index < placements.length; index += 1) {
    const previous = polygonSpan(placements[index - 1].projection.localQuad, 'x');
    const current = polygonSpan(placements[index].projection.localQuad, 'x');
    const gap = current.min - previous.max;
    assert.ok(gap >= 0.5 - 1e-6, `${wallPageKey} artworks must keep at least 0.50 m breathing room (got ${gap.toFixed(3)} m)`);
  }
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
    'elongated-room depth rays must converge toward the central vanishing point inside the stage'
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

// Explicit wall ownership is immutable. If its wall is invalid, resolution
// suppresses the slot instead of guessing another wall.
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
assert.equal(fallbackSlot.selectable, false, 'invalid explicit placement must be suppressed');
assert.equal(fallbackSlot.placement.wallId, 'wall-left', 'explicit wall ownership must never change');
assert.equal(fallbackSlot.disabledReason, 'invalid-projection', 'invalid explicit placement must explain why export is blocked');

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
assert.match(renderer, /wallClearColor\s*=\s*['"]#c7ced4['"]/i);
assert.match(renderer, /setWallClearColor\(/);
assert.match(main, /applyResolvedWallSurfaceColor\(/);
assert.match(main, /wall-surface-snapshot/);
assert.match(main, /category: 'startup'/);
assert.match(main, /reason: err instanceof Error \? err\.message : 'Unbekannter Fehler beim Initialisieren\.'/);
assert.match(main, /setSelectedArtworkId\(artworks\[galleryManager\.index\]\?\.id/);
assert.match(hub, /is-selected/);
assert.match(hub, /hub-selection-lifecycle/);
assert.match(hub, /worldQuad/);
assert.match(hub, /projectedAnchor/);
assert.match(shell, /#c7ced4/i);
assert.ok(!/background:\s*#fff(?:fff)?\b/i.test(scss.slice(scss.indexOf('.museum-hub {'), scss.indexOf('.museum-hub[hidden]'))));

console.log('PASS: 9×12 m daylit room invariants, mirrored doorways, four-work 2+1+1 rooms, overflow pagination, calibrated projection, selection persistence hooks, token consistency, and 404 fallback are valid.');
