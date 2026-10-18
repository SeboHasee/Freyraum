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

const [museumHub, geometry, backgroundFallback, artworkImageSources, sourceToPixelOutcome, inspectionSafety, galleryPresentation, lightProfile, architecture, hubRoomRenderer, quality, paintingMaterial, builtInArtworks, editorViewport] = await Promise.all([
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
  loadTsModule('src/hub/editorViewport.ts'),
]);
const constrainedDrag = await loadTsModule('src/hub/constrainedDrag.ts');
const shippedConfigFile = JSON.parse(readFileSync(SHIPPING_CONFIG_PATH, 'utf8'));
// v1.35: the shipped editor file lists its rooms explicitly and hides artworks
// without a room (option B). The geometry fixtures below exercise automatic
// overflow rooms, so they opt into automatic placement (option A).
assert.deepEqual(shippedConfigFile.rooms, [{ id: 'room-01', name: 'Raum 1' }], 'shipped file must list exactly Raum 1');
assert.equal(shippedConfigFile.fallbacks?.autoPlaceUnmapped, false, 'shipped file must hide artworks without a room');
const shippingConfig = { ...shippedConfigFile, fallbacks: { ...shippedConfigFile.fallbacks, autoPlaceUnmapped: true } };

assert.equal(shippingConfig.version, 5, 'shipping config must use the canonical v5 wall-mounting model');
const canonicalCorners = geometry.wallCornersFromTransform(
  { x: 2, y: 1, z: 3 },
  { x: 1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  4,
  2
);
const canonicalFrame = geometry.deriveWallFrame(canonicalCorners, 1e-5, { x: 0, y: 0, z: 1 });
assert.ok(canonicalFrame, 'rectangular v5-compatible corners must derive a wall frame');
assert.deepEqual(canonicalFrame.origin, { x: 2, y: 1, z: 3 });
assert.equal(canonicalFrame.width, 4);
assert.equal(canonicalFrame.height, 2);
assert.deepEqual(canonicalFrame.normal, { x: 0, y: 0, z: 1 });
assert.equal(
  geometry.deriveWallFrame(
    [
      canonicalCorners[0],
      canonicalCorners[1],
      { x: canonicalCorners[2].x, y: canonicalCorners[2].y, z: canonicalCorners[2].z + 0.01 },
      canonicalCorners[3],
    ],
    1e-5
  ),
  null,
  'twisted wall corners must be rejected'
);
assert.equal(
  geometry.deriveWallFrame(
    [canonicalCorners[0], canonicalCorners[3], canonicalCorners[2], canonicalCorners[1]],
    1e-5,
    { x: 0, y: 0, z: 1 }
  ),
  null,
  'outward/reversed wall winding must be rejected when inward normal is declared'
);
const viewport = new editorViewport.EditorViewport({ width: 1366, height: 768, margin: 64 });
const overviewWalls = [
  { corners: geometry.wallCornersFromTransform({ x: -4.5, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, 9, 5.2) },
  { corners: geometry.wallCornersFromTransform({ x: -4.5, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }, { x: 0, y: 1, z: 0 }, 12, 5.2) },
  { corners: geometry.wallCornersFromTransform({ x: 4.5, y: 0, z: 12 }, { x: 0, y: 0, z: -1 }, { x: 0, y: 1, z: 0 }, 12, 5.2) },
];
const overviewFrames = viewport.frameAllWalls(overviewWalls);
assert.equal(overviewFrames.length, 3, 'editor overview must frame every editable wall');
for (const [index, wall] of overviewWalls.entries()) {
  const handles = viewport.projectWallCorners(`overview-${index}`, overviewFrames[index]);
  assert.equal(handles.length, 4, 'editor overview must expose four handles per wall');
  for (const handle of handles) {
    assert.ok(handle.screen.x > 8 && handle.screen.x < 1358, 'overview corner must be on screen horizontally');
    assert.ok(handle.screen.y > 8 && handle.screen.y < 760, 'overview corner must be on screen vertically');
  }
}
const sideEdgeHandles = viewport.projectWallCorners('wall-left', overviewFrames[1]);
assert.equal(
  sideEdgeHandles.filter((handle) => handle.edgeAnchored).length,
  2,
  'both camera-facing side-wall edge corners must receive visible edge anchors'
);
assert.ok(
  sideEdgeHandles.filter((handle) => handle.edgeAnchored).every((handle) => handle.screen.x === 24),
  'left side-wall anchors must sit on the left screen edge'
);
for (const handle of sideEdgeHandles.filter((candidate) => candidate.edgeAnchored)) {
  assert.ok(handle.screen.x >= 24 && handle.screen.x <= 1342, 'edge anchor must be inside horizontal hit area');
  assert.ok(handle.screen.y >= 24 && handle.screen.y <= 744, 'edge anchor must be inside vertical hit area');
  assert.equal(handle.world, overviewFrames[1].corners[handle.cornerIndex], 'edge anchor must retain the real 3D corner reference');
}
const rightSideEdgeHandles = viewport.projectWallCorners('wall-right', overviewFrames[2])
  .filter((handle) => handle.edgeAnchored);
assert.equal(rightSideEdgeHandles.length, 2, 'right side wall must expose both entrance edge handles');
assert.ok(
  rightSideEdgeHandles.every((handle) => handle.screen.x === 1342),
  'right side-wall entrance handles must sit on the right screen edge'
);
for (const [wallId, origin, axisU, width] of [
  ['front', { x: -4.5, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, 9],
  ['left', { x: -4.5, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }, 12],
  ['right', { x: 4.5, y: 0, z: 0 }, { x: 0, y: 0, z: -1 }, 12],
  ['rear', { x: 4.5, y: 0, z: -12 }, { x: -1, y: 0, z: 0 }, 9],
]) {
  const corners = geometry.wallCornersFromTransform(origin, axisU, { x: 0, y: 1, z: 0 }, width, 5.2);
  assert.ok(viewport.frameWall(corners), `${wallId} wall must be frameable from authoritative corners`);
  const handles = viewport.projectCorners(wallId);
  assert.equal(handles.length, 4, `${wallId} wall must expose all four corner handles`);
  for (const handle of handles) {
    assert.ok(handle.screen.x > 64 && handle.screen.x < 1302, `${wallId} corner must be horizontally visible`);
    assert.ok(handle.screen.y > 64 && handle.screen.y < 704, `${wallId} corner must be vertically visible`);
  }
}
const dragCorners = geometry.wallCornersFromTransform(
  { x: -4.5, y: 0, z: 0 },
  { x: 1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  9,
  5.2
);
viewport.frameWall(dragCorners);
const dragStart = viewport.projectCorners('drag-test')[0];
assert.ok(dragStart, 'corner drag test must start from a projected real corner');
const dragPoint = viewport.cornerFromScreen(dragStart.screen.x, dragStart.screen.y);
assert.ok(dragPoint, 'screen pointer must resolve onto the authoritative wall plane');
assert.ok(Math.hypot(
  dragPoint.x - dragStart.world.x,
  dragPoint.y - dragStart.world.y,
  dragPoint.z - dragStart.world.z
) < 1e-6, 'screen-to-wall conversion must round-trip the real corner');
assert.deepEqual(museumHub.HUB_REFERENCE_IMAGE, { width: 2048, height: 1354, fit: 'contain' });
assert.deepEqual(museumHub.HUB_REFERENCE_BACK_WALL_QUAD, [
  { x: 531, y: 511 },
  { x: 1445, y: 512 },
  { x: 1552, y: 820 },
  { x: 487, y: 819 },
], 'reference wall corners must remain in clockwise TL/TR/BR/BL order');
assert.equal(shippingConfig.visualTokens.galleryWall, '#C7CED4');
assert.equal(shippingConfig.visualTokens.museumWall, '#C7CED4');
assert.equal(shippingConfig.background.src, 'Backgrounds/Museum_ohne_Bilder.png');
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
const authoredOutline = shippingConfig.room.floorOutline;
const outline = authoredOutline.length === 5
  && authoredOutline[0].x === authoredOutline.at(-1).x
  && authoredOutline[0].z === authoredOutline.at(-1).z
  ? authoredOutline.slice(0, -1)
  : authoredOutline;
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
assert.equal(shippingConfig.room.wallThickness, 0.08, 'room envelope must retain the 80 mm wall thickness contract');
assert.equal(shippingConfig.camera.position.z, 9, 'camera must remain in the defined entry extension');
assert.ok(
  shippingConfig.camera.position.z > outlineZ.max,
  'camera must be outside the nominal room so the entry shell is intentional'
);

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
  assert.ok((wall.drawableRegion ?? wall.room?.safePolygon)?.length >= 3, `${wall.id} must define a drawable region`);
  assert.equal(wall.mountingZone?.length, 4, `${wall.id} must define an explicit four-corner mounting zone`);
  assert.equal(
    typeof wall.mountingZoneConfirmed,
    'boolean',
    `${wall.id} mounting zone confirmation must be explicit`
  );
  assert.ok(wall.hangingBand ?? wall.room?.hangingBand, `${wall.id} must define an authoritative wall hanging band`);
  assert.ok(Array.isArray(wall.exclusionPolygons ?? wall.room?.doorwayExclusions), `${wall.id} must define explicit doorway exclusion polygons`);
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
const architecturalCenter = { x: (outlineX.min + outlineX.max) / 2, z: (outlineZ.min + outlineZ.max) / 2 };
for (const wall of shippingConfig.walls) {
  const { axisU, axisV, origin } = wall.transform;
  const normal = {
    x: axisU.y * axisV.z - axisU.z * axisV.y,
    y: axisU.z * axisV.x - axisU.x * axisV.z,
    z: axisU.x * axisV.y - axisU.y * axisV.x,
  };
  const towardCenter = {
    x: architecturalCenter.x - origin.x,
    y: 0,
    z: architecturalCenter.z - origin.z,
  };
  const inwardDot = normal.x * towardCenter.x + normal.z * towardCenter.z;
  assert.ok(inwardDot > 0, `${wall.id} wall normal must face into the room`);
}

// Exactly two identical mirrored doorways, one per side wall, floor-based.
const leftWall = wallsById.get('wall-left');
const rightWall = wallsById.get('wall-right');
const frontWall = wallsById.get('wall-front');
// Editor exports can retain exclusions in calibrated room metres rather than
// canonical envelope metres; convert only the vertical calibration for this check.
const envelopeExclusions = (wall) => wall.exclusionPolygons
  ?? (wall.room?.doorwayExclusions ?? []).map((polygon) => polygon.map((point) => ({
    x: point.x,
    y: point.y * wall.transform.height / wall.room.height,
  })));
assert.equal(envelopeExclusions(frontWall).length, 0, 'front wall must have no doorway');
assert.equal(envelopeExclusions(leftWall).length, 1, 'left wall must have exactly one doorway');
assert.equal(envelopeExclusions(rightWall).length, 1, 'right wall must have exactly one doorway');
const leftDoorU = polygonSpan(envelopeExclusions(leftWall)[0], 'x');
const leftDoorV = polygonSpan(envelopeExclusions(leftWall)[0], 'y');
const rightDoorU = polygonSpan(envelopeExclusions(rightWall)[0], 'x');
const rightDoorV = polygonSpan(envelopeExclusions(rightWall)[0], 'y');
for (const [doorU, doorV, id] of [
  [leftDoorU, leftDoorV, 'wall-left'],
  [rightDoorU, rightDoorV, 'wall-right'],
]) {
  assert.ok(Math.abs(doorU.max - doorU.min - DOORWAY_WIDTH) < 1e-9, `${id} doorway must be exactly 1.05 m wide`);
  assert.ok(Math.abs(doorV.max - doorV.min - DOORWAY_HEIGHT) < 0.001, `${id} doorway must be 2.30 m tall within export rounding`);
  assert.ok(Math.abs(doorV.min) < 1e-9, `${id} doorway must be floor-based`);
}
const worldDoorwayZ = (wall, span) => {
  const originZ = wall.transform.origin.z;
  const axisZ = wall.transform.axisU.z;
  return {
    min: Math.min(originZ + axisZ * span.min, originZ + axisZ * span.max),
    max: Math.max(originZ + axisZ * span.min, originZ + axisZ * span.max),
  };
};
for (const [wall, span] of [[leftWall, leftDoorU], [rightWall, rightDoorU]]) {
  const worldSpan = worldDoorwayZ(wall, span);
  assert.ok(Math.abs(worldSpan.min - 2.5) < 1e-9 && Math.abs(worldSpan.max - 3.55) < 1e-9,
    `${wall.id} doorway must occupy world z=2.5..3.55`);
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
  ['room-01.wall-left.a', 4.261],
  ['room-01.wall-right.a', 2.982],
]);
// v1.34: calibrated (measured) wall heights are authoritative. The shipped
// front wall calibrates to ~2.61 m, so its works hang at 1.30 m to sit fully
// inside the green mounting zone (validated by the shared-projection test).
const expectedCenterHeightByWall = new Map([
  ['wall-front', 1.3],
  ['wall-left', 3.041],
  ['wall-right', 3.331],
]);
const expectedHorizontalPositionBySlot = new Map([
  ['room-01.wall-front.a', 0.3],
  ['room-01.wall-front.b', 0.7],
  ['room-01.wall-left.a', 0.671],
  ['room-01.wall-right.a', 0.319],
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
  if (slot.placement.wallId !== 'wall-front') {
    const calibratedHeight = wallsById.get(slot.placement.wallId).room.height;
    assert.ok(bottom > 0 && top < calibratedHeight, `${slot.id} must stay within its calibrated wall height`);
  } else {
    assert.ok(bottom > 0.3 && top < 2.4, `${slot.id} must stay within the calibrated ~2.61 m front wall`);
  }
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
assert.ok(
  mixedFallbackResolution.pages.flatMap((page) => page.slots).some((slot) => slot.selectable),
  'fallback placement must retain selectable artwork geometry'
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
  if (projected?.projectiveFallback) {
    assert.ok(projected.projectedQuad, `${slot.id} fallback must retain rendered geometry`);
    continue;
  }
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

// Native image aspect is the only artwork rectangle authority. Wall orientation,
// perspective, movement, resizing, and deformation may change the projected
// quad, but never the source rectangle ratio.
const nativeAspectFixtures = [
  ['portrait', 900 / 1200],
  ['square', 1000 / 1000],
  ['landscape', 1800 / 1100],
  ['panoramic', 2400 / 1000],
];
const strictAspectTolerance = 1e-12;
const assertProjectedSourceAspect = (projection, expectedAspect, context) => {
  assert.ok(projection, `${context} must produce artwork geometry`);
  assert.ok(
    Math.abs(projection.sourceWidth / projection.sourceHeight - expectedAspect) <= strictAspectTolerance,
    `${context} must preserve native source aspect ratio`
  );
};
for (const wallId of ['wall-front', 'wall-left', 'wall-right']) {
  const wall = builtInResolution.wallById.get(wallId);
  const template = builtInResolution.pages[0].slots.find((slot) => slot.placement.wallId === wallId)
    ?? builtInResolution.pages[0].slots[0];
  for (const [label, expectedAspect] of nativeAspectFixtures) {
    const basePlacement = {
      ...template.placement,
      mountedHeight: 1.25,
      physicalHeight: 1.25,
      anchor: template.placement.anchor ? { ...template.placement.anchor } : undefined,
    };
    const slot = { ...template, placement: basePlacement, artworkAspect: expectedAspect };
    assertProjectedSourceAspect(
      geometry.projectSlotArtwork(wall, slot.placement, expectedAspect, builtInResolution.stage),
      expectedAspect,
      `${label} ${wallId} initial placement`
    );
    assertProjectedSourceAspect(
      geometry.projectSlotArtwork(
        wall,
        { ...slot.placement, mountedHeight: 0.8, physicalHeight: 0.8 },
        expectedAspect,
        builtInResolution.stage
      ),
      expectedAspect,
      `${label} ${wallId} resize`
    );
    assertProjectedSourceAspect(
      geometry.projectSlotArtwork(
        wall,
        {
          ...slot.placement,
          anchor: slot.placement.anchor
            ? { ...slot.placement.anchor, x: slot.placement.anchor.x + 0.15 }
            : undefined,
        },
        expectedAspect,
        builtInResolution.stage
      ),
      expectedAspect,
      `${label} ${wallId} move`
    );
    const deformedWall = {
      ...wall,
      quad: wall.quad.map((corner, index) => ({
        x: corner.x + (index === 1 || index === 2 ? 18 : -8),
        y: corner.y + (index >= 2 ? 11 : -4),
      })),
      camera: {
        ...wall.camera,
        verticalFovDeg: wall.camera.verticalFovDeg + 3,
      },
    };
    assertProjectedSourceAspect(
      geometry.projectSlotArtwork(deformedWall, slot.placement, expectedAspect, builtInResolution.stage),
      expectedAspect,
      `${label} ${wallId} wall deformation and camera change`
    );
  }
}

// Calibration edits must change only the wall frame and projected perspective.
// A short-wide calibrated wall must not turn a fixed-height artwork into a
// short-wide image.
{
  const wall = builtInResolution.wallById.get('wall-front');
  assert.ok(wall?.room && wall.camera, 'front wall must support calibrated projection invariance');
  const template = builtInResolution.pages[0].slots.find((slot) => slot.placement.wallId === 'wall-front');
  assert.ok(template, 'front wall must have a placement fixture');
  const fixedHeight = 1.25;
  const shortWideWall = {
    ...wall,
    room: {
      ...wall.room,
      width: wall.room.width * 2,
      height: wall.room.height * 0.35,
    },
  };
  const fixedPlacement = {
    ...template.placement,
    anchor: {
      x: shortWideWall.room.width / 2,
      y: shortWideWall.room.height / 2,
    },
    mountedHeight: fixedHeight,
    physicalHeight: fixedHeight,
    targetSizePolicy: 'fixed-height',
  };
  for (const [label, editedWall] of [
    ['short-wide', shortWideWall],
    ['tall-narrow', {
      ...wall,
      room: {
        ...wall.room,
        width: wall.room.width * 0.6,
        height: wall.room.height * 1.8,
      },
    }],
  ]) {
    const projection = geometry.projectSlotArtwork(
      editedWall,
      {
        ...fixedPlacement,
        anchor: {
          x: editedWall.room.width / 2,
          y: editedWall.room.height / 2,
        },
      },
      0.75,
      builtInResolution.stage,
      'room-fixed'
    );
    assert.ok(projection, `${label} wall must still project a fixed-size artwork`);
    assert.equal(projection.projectiveFallback, undefined, `${label} projection must not use wall-normalized fallback`);
    const worldHeight = Math.hypot(
      projection.worldQuad[0].x - projection.worldQuad[3].x,
      projection.worldQuad[0].y - projection.worldQuad[3].y,
      projection.worldQuad[0].z - projection.worldQuad[3].z
    );
    const worldWidth = Math.hypot(
      projection.worldQuad[0].x - projection.worldQuad[1].x,
      projection.worldQuad[0].y - projection.worldQuad[1].y,
      projection.worldQuad[0].z - projection.worldQuad[1].z
    );
    assert.ok(Math.abs(worldHeight - fixedHeight) < 1e-9, `${label} calibration must preserve artwork world height`);
    assert.ok(Math.abs(worldWidth - fixedHeight * 0.75) < 1e-9, `${label} calibration must preserve artwork world width`);
  }

  const rotatedCalibrationWall = {
    ...wall,
    quad: wall.quad.map((corner, index) => ({
      x: corner.x + (index === 0 || index === 3 ? -24 : 31),
      y: corner.y + (index === 0 || index === 1 ? -18 : 23),
    })),
  };
  const originalProjection = geometry.projectSlotArtwork(
    wall,
    fixedPlacement,
    0.75,
    builtInResolution.stage,
    'room-fixed'
  );
  const rotatedProjection = geometry.projectSlotArtwork(
    rotatedCalibrationWall,
    fixedPlacement,
    0.75,
    builtInResolution.stage,
    'room-fixed'
  );
  assert.ok(originalProjection && rotatedProjection, 'calibration edits must keep fixed artwork projected');
  assert.notDeepEqual(
    rotatedProjection.projectedQuad,
    originalProjection.projectedQuad,
    'edited wall calibration must update the projected artwork quadrilateral'
  );
  assert.deepEqual(
    rotatedProjection.worldQuad,
    originalProjection.worldQuad,
    'calibration-only wall edits must not alter physical artwork world geometry'
  );
}

// Editor drag stability: the displayed (room-fixed) projection must honor the
// exact stored anchor, which is also what the 3D renderer mounts. Relocating
// it (e.g. into the hanging band) made side-wall artwork stall below the top of
// the green mounting zone while the stored/3D position kept moving.
for (const wallId of ['wall-left', 'wall-right']) {
  const shippingResolution = museumHub.resolveMuseumHub(
    ['fraktal', 'akt-27', 'side-a', 'side-b'].map((id) => ({
      id,
      title: id,
      image: `${id}.jpg`,
      dimensions: { width: 1000, height: 1300 },
    })),
    shippingConfig
  );
  const wall = shippingResolution.wallById.get(wallId);
  const slot = shippingResolution.pages[0].slots.find((candidate) => candidate.placement.wallId === wallId);
  assert.ok(wall?.room && slot, `${wallId} must have a shipping side-wall artwork`);
  const bandTop = wall.room.hangingBand.maxY - wall.room.hangingBand.margin;
  const height = 0.4;
  const requestedAnchor = { x: wall.room.width / 2, y: bandTop + height / 2 + 0.25 };
  const projection = geometry.projectSlotArtwork(
    wall,
    { ...slot.placement, physicalHeight: height, mountedHeight: height, anchor: requestedAnchor },
    slot.artworkAspect,
    shippingResolution.stage,
    'room-fixed'
  );
  assert.ok(projection?.placement, `${wallId} must project an artwork above the hanging band`);
  assert.deepEqual(
    projection.placement.anchor,
    requestedAnchor,
    `${wallId} room-fixed projection must not relocate the stored anchor`
  );
  assert.equal(projection.placement.validity.inHangingBand, false, `${wallId} must report the real hanging-band state`);
  assert.ok(
    projection.projectedQuad.every((corner) => geometry.pointInPolygon(corner, wall.mountingZone)),
    `${wallId} artwork above the hanging band must still fit inside the green mounting zone`
  );
  const relocated = geometry.solveRoomArtworkPlacement(wall.room, requestedAnchor, height, slot.artworkAspect, true);
  assert.notDeepEqual(relocated.anchor, requestedAnchor, 'default solver relocation must remain available for runtime fitting');
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
assert.equal(
  shipping.warnings.some((warning) => /projected geometry is invalid|active artwork\(s\) without/.test(warning)),
  false,
  `shipping calibration must retain active artwork geometry: ${shipping.warnings.join('; ')}`
);
assert.equal(shipping.slotToArtwork.size, 6, 'shipping configuration must retain all active artwork slots');
assert.equal(shipping.camera.verticalFovDeg, shippingConfig.camera.verticalFovDeg);
assert.equal(shipping.slotsPerPage, 4, 'resolved hub must limit each room to four artworks');

// Legacy-shaped placements retain their authored physical size when wall
// calibration changes the room frame.
const legacySizedConfig = JSON.parse(JSON.stringify(shippingConfig));
const legacySizedPlacement = legacySizedConfig.slots[0].placement;
delete legacySizedPlacement.horizontalPosition;
delete legacySizedPlacement.centerHeight;
delete legacySizedPlacement.physicalHeight;
legacySizedPlacement.mountedHeight = 1.23;
legacySizedPlacement.center = { x: 0.3, y: 1 - 2.32 / ROOM_HEIGHT };
legacySizedPlacement.uv = { x: 0.3, y: 2.32 / ROOM_HEIGHT };
const legacySized = museumHub.resolveMuseumHub(artworks, legacySizedConfig, null);
const legacySizedSlot = legacySized.pages.flatMap((page) => page.slots)
  .find((slot) => slot.id === legacySizedConfig.slots[0].id);
assert.ok(legacySizedSlot, 'legacy-sized artwork slot must resolve');
assert.equal(legacySizedSlot.placement.physicalHeight, 1.23, 'wall calibration must not scale artwork physical height');
assert.equal(legacySizedSlot.placement.mountedHeight, 1.23, 'wall calibration must not scale resolved artwork height');
const frontRoom = shipping.walls.find((wall) => wall.id === 'wall-front')?.room;
assert.ok(frontRoom, 'front wall must expose a room frame for physical-size checks');
const preserveSizePlacement = geometry.solveRoomArtworkPlacement(
  frontRoom,
  { x: frontRoom.width / 2, y: frontRoom.height / 2 },
  1.23,
  0.75,
  true
);
assert.equal(preserveSizePlacement.mountedHeight, 1.23, 'fixed-height fitting must preserve artwork height');
const oversizedPlacement = geometry.solveRoomArtworkPlacement(
  frontRoom,
  { x: frontRoom.width / 2, y: frontRoom.height / 2 },
  frontRoom.height * 2,
  0.75,
  true
);
assert.equal(
  oversizedPlacement.mountedHeight,
  frontRoom.height * 2,
  'fixed-height fitting must reject or move oversized artwork instead of shrinking it'
);
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
const calibrationReport = geometry.evaluateWallCalibration(
  geometry.mapReferenceQuadToStage(
    museumHub.HUB_REFERENCE_BACK_WALL_QUAD,
    museumHub.HUB_REFERENCE_IMAGE,
    shipping.stage
  ),
  museumHub.HUB_REFERENCE_BACK_WALL_QUAD,
  museumHub.HUB_REFERENCE_IMAGE,
  shipping.stage
);
assert.ok(calibrationReport, 'reference wall must map into the logical stage');
assert.ok(calibrationReport.averageErrorPx <= 0.01, `front wall average calibration error must be <= 0.01px (got ${calibrationReport.averageErrorPx})`);
assert.ok(calibrationReport.maximumErrorPx <= 0.01, `front wall maximum calibration error must be <= 0.01px (got ${calibrationReport.maximumErrorPx})`);
assert.equal(calibrationReport.offset.y, 0, 'contain mapping must preserve the full reference height');
assert.ok(Math.abs(calibrationReport.offset.x - 102.17872968980794) < 1e-9, 'contain mapping must center horizontal padding explicitly');

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
assert.deepEqual(firstRoomCensus, { front: 2, left: 0, right: 0 }, 'unknown authored side artworks must not be silently replaced by overflow fixtures');
const fullRoomCensus = { front: 0, left: 0, right: 0 };
for (const slot of builtInResolution.pages[0].slots.filter((slot) => slot.selectable && slot.artworkId)) {
  fullRoomCensus[slot.wallGroup] += 1;
}
assert.deepEqual(fullRoomCensus, { front: 2, left: 1, right: 1 }, 'a fully mapped built-in room must retain the 2 + 1 + 1 composition');
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
const shippedOnly = museumHub.resolveMuseumHub(artworks.slice(0, 2), shippedConfigFile, null);
assert.equal(
  shippedOnly.warnings.some((warning) => /projected geometry is invalid|active artwork\(s\) without/.test(warning)),
  false,
  `shipped-artwork warnings: ${shippedOnly.warnings.join('; ')}`
);
const shippedSlots = shippedOnly.pages.flatMap((page) => page.slots).filter((slot) => slot.selectable && slot.artworkId);
assert.equal(shippedSlots.length, 2, 'the two shipped artworks must resolve onto the front pair');
assert.ok(shippedSlots.every((slot) => slot.wallGroup === 'front'), 'shipped artworks land on the front wall pair');
assert.deepEqual(shippedConfigFile.slots.map((slot) => slot.artworkId), ['fraktal', 'akt-27', 'gartenszene', 'zdigital'], 'authored mappings must remain intact even when source artworks are absent');
assert.ok(shippedOnly.warnings.some((warning) => warning.includes('gartenszene')), 'missing left artwork must be diagnosed');
assert.ok(shippedOnly.warnings.some((warning) => warning.includes('zdigital')), 'missing right artwork must be diagnosed');

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
  if (projection.projectiveFallback) {
    assert.ok(projection.projectedQuad, `${slot.id} fallback must retain a projected quad`);
    assert.ok(projection.projectedAnchor, `${slot.id} fallback must retain a projected anchor`);
    continue;
  }
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
  const authoredSlot = shippingConfig.slots.find((candidate) => candidate.id === slot.id && candidate.artworkId === slot.artworkId);
  if (authoredSlot) {
    assert.equal(slot.placement.centerHeight, authoredSlot.placement.centerHeight, `${slot.id} resolved optical center height must remain authoritative`);
    assert.equal(slot.placement.physicalHeight, authoredSlot.placement.physicalHeight, `${slot.id} resolved physical height must remain authoritative`);
  } else {
    assert.ok(slot.placement.physicalHeight > 0 && Number.isFinite(slot.placement.centerHeight), `${slot.id} automatic overflow must retain finite positive mounting geometry`);
  }
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
// Both side walls recede along −Z (one-point perspective).  The confirmed
// calibration may intentionally splay the two wall rays, so only require
// finite, in-stage convergence rather than imposing artificial symmetry.
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
assert.equal(fallbackSlot.selectable, true, 'explicit placement must remain selectable through projective fallback');
assert.equal(fallbackSlot.placement.wallId, 'wall-left', 'explicit wall ownership must never change');
assert.equal(fallbackSlot.disabledReason, null, 'projective fallback placement must remain exportable');

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

// Even when metric room geometry is invalid, the edited projected wall remains
// an actionable surface through the projective fallback.
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
assert.equal(invalidPlacement.slotToArtwork.size, 1, 'projective fallback must keep the artwork selectable');
assert.equal(invalidSlot.selectable, true, 'projective fallback slot must remain enabled');
assert.equal(invalidSlot.disabledReason, null, 'projective fallback must not report a projection failure');

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

// v1.34 shared "stop at the limit and slide along it" solver used by every
// editor drag (artworks, wall corners, green-zone and safe-area points).
{
  const inUnitSquare = (candidate) => candidate.x >= 0 && candidate.x <= 1 && candidate.y >= 0 && candidate.y <= 1;
  const start = { x: 0.5, y: 0.5 };
  const up = constrainedDrag.slideToValid(start, { x: 0.5, y: 2 }, inUnitSquare);
  assert.equal(up.blocked, true, 'slide must report a blocked target');
  assert.ok(Math.abs(up.point.y - 1) < 1e-3 && Math.abs(up.point.x - 0.5) < 1e-9, 'slide must reach the blocking edge');
  const slide = constrainedDrag.slideToValid(start, { x: 2, y: 0.7 }, inUnitSquare);
  assert.ok(Math.abs(slide.point.x - 1) < 1e-3 && Math.abs(slide.point.y - 0.7) < 1e-9, 'blocked motion must slide along the edge');
  const corner = constrainedDrag.slideToValid(start, { x: 3, y: -4 }, inUnitSquare);
  assert.ok(Math.abs(corner.point.x - 1) < 1e-3 && Math.abs(corner.point.y) < 1e-3, 'diagonal overshoot must reach the zone corner');
  // Sloped limit: blocked horizontal motion must glide along the slope
  // instead of sticking (the bottom edge of a skewed green zone).
  const aboveSlope = (candidate) => candidate.y >= -0.1 * candidate.x && Math.abs(candidate.x) <= 5 && candidate.y <= 5;
  const glide = constrainedDrag.slideToValid({ x: 0, y: 0 }, { x: -4, y: 0 }, aboveSlope);
  assert.ok(glide.point.x < -3.9 && Math.abs(glide.point.y - 0.4) < 0.02, 'blocked motion must glide along sloped limits');
  const free = constrainedDrag.slideToValid(start, { x: 0.2, y: 0.9 }, inUnitSquare);
  assert.deepEqual(free, { point: { x: 0.2, y: 0.9 }, blocked: false, startValid: true }, 'valid targets are applied exactly');
  const invalidStart = constrainedDrag.slideToValid({ x: 4, y: 4 }, { x: 5, y: 5 }, inUnitSquare);
  assert.equal(invalidStart.startValid, false, 'invalid starts must be reported so callers can recover');
  assert.equal(constrainedDrag.polygonIsSimple(rect(0, 0, 1, 1)), true, 'rectangles are simple polygons');
  assert.equal(
    constrainedDrag.polygonIsSimple([{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 0 }, { x: 0, y: 1 }]),
    false,
    'bow-tie polygons must be rejected'
  );
  const edge = constrainedDrag.nearestPolygonEdge({ x: 0.5, y: 1.4 }, rect(0, 0, 1, 1));
  assert.deepEqual(edge, [{ x: 1, y: 1 }, { x: 0, y: 1 }], 'nearest zone edge must be the one closest to the blocked corner');
}

// v1.34 one shared projection: the shipped config must report the same
// validity in the editor (displayed projection), after loading (resolver), and
// in the 3D view (renderer mounting frame).
// Explicit synthetic side assignments exercise all three walls without changing
// or pretending to satisfy the missing production artwork IDs.
const projectionFixtureArtworks = [
  ['fraktal', 3780, 5046],
  ['akt-27', 3150, 3150],
  ['side-a', 1000, 1300],
  ['side-b', 1000, 1300],
].map(([id, width, height]) => ({ id, title: id, image: `${id}.png`, dimensions: { width, height } }));
const projectionFixtureConfig = {
  ...shippedConfigFile,
  slots: shippedConfigFile.slots.map((slot) => {
    const side = slot.placement.wallId;
    if (side === 'wall-front') return slot;
    return {
      ...slot,
      artworkId: side === 'wall-left' ? 'side-a' : 'side-b',
      placement: {
        ...slot.placement,
        horizontalPosition: 0.5,
        physicalHeight: 1.45,
        centerHeight: side === 'wall-left' ? 2.3 : 2.28,
      },
    };
  }),
};
{
  const resolution = museumHub.resolveMuseumHub(projectionFixtureArtworks, projectionFixtureConfig);
  assert.equal(
    resolution.warnings.some((warning) => warning.includes('stored placement is invalid')),
    false,
    `shipped placements must load valid: ${resolution.warnings.join(' | ')}`
  );
  for (const slot of resolution.pages[0].slots) {
    const wall = resolution.wallById.get(slot.placement.wallId);
    assert.ok(wall?.room && slot.selectable, `${slot.id} must be a visible shipped slot`);
    assert.equal(slot.placementIssues, undefined, `${slot.id} must load without placement issues`);
    const evaluation = museumHub.evaluateDisplayedPlacement(wall, slot.placement, slot.artworkAspect, resolution.stage);
    assert.equal(evaluation.valid, true, `${slot.id} must be valid in the editor projection (${evaluation.issues.join(', ')})`);
    const frame = geometry.createArtworkMountingFrame(
      wall.room,
      slot.placement.anchor,
      slot.placement.physicalHeight ?? slot.placement.mountedHeight,
      slot.artworkAspect,
      slot.placement.mountingGap,
      geometry.HUB_ARTWORK_DEPTH_M,
      true
    );
    assert.ok(frame, `${slot.id} must mount in 3D`);
    frame.frontQuad.forEach((corner, index) => {
      const displayed = evaluation.projection.worldQuad[index];
      assert.ok(
        Math.hypot(corner.x - displayed.x, corner.y - displayed.y, corner.z - displayed.z) < 1e-9,
        `${slot.id} 3D mounting corner ${index} must match the editor projection`
      );
      // The editor draws through the current wall calibration; the 3D camera
      // projects the same world corner. Both must agree within a few pixels
      // and both must sit inside the green mounting zone.
      const projected = geometry.projectWorldPoint(wall.camera, corner, resolution.stage);
      const nearestShown = Math.min(
        ...evaluation.projection.projectedQuad.map((shown) => Math.hypot(projected.x - shown.x, projected.y - shown.y))
      );
      assert.ok(nearestShown < 3, `${slot.id} 3D corner ${index} must project where the editor draws it (${nearestShown.toFixed(2)}px)`);
      assert.ok(geometry.pointInPolygon(projected, wall.mountingZone), `${slot.id} 3D corner ${index} must be inside the green zone`);
    });
  }
}

// v1.34 editor positions survive reloading: export → reload → compare every
// placement; invalid positions are flagged, never relocated.
{
  const first = museumHub.resolveMuseumHub(projectionFixtureArtworks, projectionFixtureConfig);
  const edited = {
    ...projectionFixtureConfig,
    slots: projectionFixtureConfig.slots.map((slot) => {
      if (slot.id === 'room-01.wall-left.a') {
        return { ...slot, placement: { ...slot.placement, horizontalPosition: 0.612, centerHeight: 2.947 } };
      }
      if (slot.id === 'room-01.wall-front.a') {
        // Deliberately outside the green zone: must stay exactly here, flagged.
        return { ...slot, placement: { ...slot.placement, centerHeight: 2.32 } };
      }
      return slot;
    }),
  };
  const loaded = museumHub.resolveMuseumHub(projectionFixtureArtworks, edited);
  const exported = {
    ...edited,
    slots: edited.slots.map((slot) => {
      const resolved = loaded.pages.flatMap((page) => page.slots).find((candidate) => candidate.id === slot.id);
      return resolved ? { ...slot, placement: museumHub.exportHubSlotPlacement(resolved.placement) } : slot;
    }),
  };
  const reloaded = museumHub.resolveMuseumHub(projectionFixtureArtworks, JSON.parse(JSON.stringify(exported)));
  for (const slot of exported.slots) {
    const original = edited.slots.find((candidate) => candidate.id === slot.id);
    const resolved = reloaded.pages.flatMap((page) => page.slots).find((candidate) => candidate.id === slot.id);
    assert.ok(resolved, `${slot.id} must survive reload`);
    assert.deepEqual(museumHub.exportHubSlotPlacement(resolved.placement), slot.placement, `${slot.id} placement must round-trip exactly`);
    for (const key of ['wallId', 'horizontalPosition', 'centerHeight', 'physicalHeight']) {
      assert.equal(slot.placement[key], original.placement[key], `${slot.id} ${key} must not be moved by loading`);
    }
  }
  const flagged = reloaded.pages[0].slots.find((slot) => slot.id === 'room-01.wall-front.a');
  assert.deepEqual(flagged.placementIssues, ['outside-mounting-zone'], 'invalid stored placements must be flagged');
  assert.equal(flagged.selectable, true, 'flagged placements stay visible for correction');
  assert.equal(flagged.placement.anchor.y, 2.32, 'flagged placements keep their exact stored anchor');
  assert.ok(
    reloaded.warnings.some((warning) => warning.includes('room-01.wall-front.a') && warning.includes('kept unchanged')),
    'flagged placements must produce a load warning'
  );
  assert.ok(first.pages[0].slots.every((slot) => !slot.placementIssues), 'baseline shipped config must not be flagged');
}

// Token sources for artwork, boot, fallback, and renderer must never use a
// white background fallback.
const scss = readFileSync(resolve(ROOT, 'src/styles/main.scss'), 'utf8');
const main = readFileSync(resolve(ROOT, 'src/main.ts'), 'utf8');
const renderer = readFileSync(resolve(ROOT, 'src/core/RendererManager.ts'), 'utf8');
const hub = readFileSync(resolve(ROOT, 'src/hub/MainMuseumHub.ts'), 'utf8');
const shell = readFileSync(resolve(ROOT, 'app.html'), 'utf8');
const editorShell = readFileSync(resolve(ROOT, 'placement-editor.html'), 'utf8');
const editorLauncher = readFileSync(resolve(ROOT, 'OPEN_ARTWORK_EDITOR.html'), 'utf8');
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
assert.match(hub, /createCalibrationEdgeHitTarget/);
assert.match(hub, /createCalibrationCornerHitTarget/);
assert.match(hub, /calibrationViewport\.offsetX/);
assert.match(hub, /captureElement\.setPointerCapture/);
assert.match(hub, /grabOffset/, 'artwork drags must keep the grabbed point under the pointer');
assert.match(hub, /slideToValid\(start, target, applyCenter/, 'blocked artwork drags must slide along the mounting-zone edge');
assert.match(hub, /event\.type === 'pointerup' \? event : this\.pendingCalibrationMove/, 'drag release must commit the final pointer position');
assert.match(hub, /private isPrimaryPointerDown/, 'only primary pointer presses may start editor drags');
assert.doesNotMatch(
  hub,
  /projectSlotArtwork\(wall, slot\.placement, slot\.artworkAspect, this\.resolution\.stage\)/,
  'editor validation must use the displayed room-fixed projection'
);
assert.match(hub, /calibrationRoomBoundaryVisible\s*=\s*false/);
assert.match(hub, /calibrationEditMode:\s*'wall'\s*\|\s*'safe'\s*\|\s*'mounting-zone'\s*\|\s*'room-boundary'/);
assert.match(hub, /calibrating && this\.calibrationRoomBoundaryVisible && this\.entranceBoundaryQuad/);
assert.match(hub, /this\.calibrating && active && this\.isWallCornerEditing\(\)/, 'wall corner handles appear only while "Wandecken bearbeiten" is on');
assert.match(hub, /Sicherheitsbereich bearbeiten/);
assert.match(hub, /Grüne Fläche bearbeiten/);
assert.match(hub, /Raumgrenze anzeigen/);
assert.match(hub, /applyCalibrationSnapshot\(JSON\.stringify\(sanitized\.config\), false\)/);
assert.match(hub, /applyRenderedWallGeometry = true/);
assert.match(hub, /if \(!applyRenderedWallGeometry\) continue/);
assert.match(hub, /calibrationRoomBoundaryVisible = select\.value === 'wall-rear'/);
assert.match(hub, /this\.updateCalibrationOverlayGeometry\(\);\s*this\.updateCalibrationOutput\(true\)/);
assert.match(scss, /\.museum-hub\.is-calibrating \.museum-hub__calibration-svg\s*\{[\s\S]*?pointer-events:\s*none/);
assert.match(scss, /\.museum-hub__calibration-edge-hit\s*\{[\s\S]*?stroke-width:\s*18/);
assert.match(hub, /startSafePolygon/);
assert.match(hub, /startMountingZone/);
assert.match(hub, /fitCalibrationWallsToView/);
assert.match(hub, /wall\.safePolygon\.forEach\(\(corner\) => \{\s*corner\.x \+= clamped\.x/);
assert.match(hub, /wall\.mountingZone\.forEach\(\(corner\) => \{\s*corner\.x \+= clamped\.x/);
assert.doesNotMatch(hub, /Artwork left/, 'arrow-button artwork moves were replaced by keys and dragging');
assert.doesNotMatch(hub, /Tilt \(not available/, 'the unavailable tilt control was removed');
assert.match(hub, /handle\.setAttribute\('r', '5'\)/);
assert.match(hub, /circle\.setAttribute\('r', '12'\)/);
assert.match(hub, /private calibrationViewport = \{ scale: 1, offsetX: 0, offsetY: 0 \}/);
assert.match(hub, /fitCalibrationWallsToView\(this\.activeCalibrationWallId/);
assert.match(hub, /fitCalibrationWallsToView\(\);/);
assert.match(hub, /matrix\(\$\{scale\} 0 0 \$\{scale\} \$\{offsetX\} \$\{offsetY\}\)/);
assert.match(hub, /clampWallDelta\(drag\.startQuad, delta\)/);
assert.match(hub, /startSafePolygon: wall\?\.safePolygon/);
assert.match(hub, /startMountingZone: wall\?\.mountingZone/);
assert.match(hub, /const target = this\.clampDisplayPoint\(stagePoint\)/);
assert.match(scss, /polygon\.museum-hub__calibration-wall\.is-active \{[\s\S]*?pointer-events: none/);
assert.match(hub, /this\.clampDisplayPoint\(point\(source\.x \+ delta\.x, source\.y \+ delta\.y\)\)/);
assert.match(scss, /\.museum-hub__calibration-svg \{[\s\S]*?transform-origin: 0 0/);
assert.match(scss, /\.museum-hub__rooms \{[\s\S]*?transform-origin: 0 0/);
assert.match(hub, /button\.addEventListener\('pointerdown', \(event\) => \{/);
assert.match(hub, /this\.selectCalibrationSlot\(slot\.id\)/);
assert.doesNotMatch(hub, /Fit selected wall to view|Fit all walls to view|Reset viewport|Frame Wall|Frame Corner/, 'view controls are merged into one German view group');
assert.match(hub, /'Ganzer Raum'/);
assert.match(hub, /'Ausgewählte Wand'/);
assert.match(scss, /\.museum-hub__calibration-envelope\s*\{[\s\S]*?pointer-events:\s*all/);
assert.match(scss, /\.museum-hub__calibration-safe\s*\{[\s\S]*?pointer-events:\s*none/);
assert.match(scss, /\.museum-hub__calibration-mounting-zone\s*\{[\s\S]*?pointer-events:\s*none/);
const editorText = readFileSync(resolve(ROOT, 'src/hub/editor/editorText.ts'), 'utf8');
const editorUi = [
  hub,
  editorText,
  readFileSync(resolve(ROOT, 'src/hub/editor/roomBar.ts'), 'utf8'),
  readFileSync(resolve(ROOT, 'src/hub/editor/artworkLibrary.ts'), 'utf8'),
  readFileSync(resolve(ROOT, 'src/hub/editor/saveTab.ts'), 'utf8'),
  readFileSync(resolve(ROOT, 'src/hub/editor/editorTabs.ts'), 'utf8'),
].join('\n');
for (const label of [
  'Orange Punkte',
  'Orange Kanten',
  'Blaue Fläche',
  'Grüne Fläche',
  'Violette Fläche',
  'Frontwand',
  'Linke Wand',
  'Rechte Wand',
  'Wandecken bearbeiten',
  'Grüne Fläche bearbeiten',
  'Eingangsbereich bearbeiten',
  'Zurücksetzen',
  'Gesamte Geometrie zurücksetzen',
  'Rückgängig',
  'Wiederholen',
  'Hilfslinien aus',
  'Erweitert: Diagnose und JSON',
  '+ Neuer Raum',
  'Raum duplizieren',
  'Raum löschen',
  'Nicht platziert',
  'Konfiguration herunterladen',
  'JSON kopieren',
  'Datei öffnen',
  'Letzte gültige Version wiederherstellen',
  'Im grünen Bereich zentrieren',
  'Bild entfernen',
  'Grüne Fläche geprüft ✓',
]) {
  assert.ok(editorUi.includes(label), `calibration editor must expose self-explanatory German control: ${label}`);
}
for (const english of ['Wall Edit Mode', 'Edit wall corners', 'Move complete wall', 'Currently editing:', 'LEFT WALL — drag', 'Confirm green mounting area']) {
  assert.ok(!editorUi.includes(english), `editor UI must not show the old English control: ${english}`);
}
assert.match(hub, /createEditorTabs\('museum-hub-editor'/, 'editor panel uses the three-tab pattern');
assert.match(editorUi, /'Raum'[\s\S]*'Bilder'[\s\S]*'Speichern'/);
assert.match(readFileSync(resolve(ROOT, 'src/hub/editor/editorTabs.ts'), 'utf8'), /ArrowRight[\s\S]*ArrowLeft[\s\S]*Home[\s\S]*End/, 'tabs switch with arrow keys');
assert.match(scss, /body\.placement-editor \{[\s\S]*?\.audio-controls,\s*\.prefs,\s*\.fullscreen-btn \{\s*display: none !important/, 'overlapping gallery icons are hidden in the editor');
assert.match(scss, /\.museum-hub__room-switcher/);
assert.match(scss, /\.museum-hub__editor-tab \{/);
assert.match(scss, /\.museum-hub__artwork\.is-empty-slot/);
assert.match(hub, /setAttribute\(\s*'aria-label'/);
assert.match(scss, /\.museum-hub__calibration-legend/);
assert.match(scss, /\.museum-hub__calibration-svg\.is-guides-hidden/);
assert.match(shell, /#c7ced4/i);
assert.match(editorShell, /hubCalibrate['"],\s*['"]1/);
assert.match(editorShell, /class="placement-editor"/);
assert.match(editorLauncher, /customer-preview\/placement-editor\.html/);
assert.ok(!/background:\s*#fff(?:fff)?\b/i.test(scss.slice(scss.indexOf('.museum-hub {'), scss.indexOf('.museum-hub[hidden]'))));

assert.match(hub, /addEventListener\('lostpointercapture', this\.handleCalibrationEnd[\s\S]*addEventListener\('lostpointercapture', this\.handleCalibrationEnd[\s\S]*addEventListener\('lostpointercapture', this\.handleCalibrationEnd/, 'every editor drag must end on lost pointer capture');
assert.match(hub, /slideToValid\(current, target, isValidCorner\)/, 'wall-corner drags must slide along the convexity limit');
assert.match(hub, /slideToValid\(current, target, isValidPoint\)/, 'green-zone and safe-area point drags must slide along their limits');
assert.match(hub, /applyAllSlotGeometry\(false\)/, 'wall drags must defer 3D rendering until release');
assert.match(hub, /refitSlotsOnWall\(drag\.wallId\)/, 'artworks must be re-fitted after wall or green-zone edits');
assert.match(hub, /!event\.repeat/, 'held arrow keys must produce a single undo entry');
assert.match(hub, /swipePointerId/, 'swipe navigation must track the starting pointer');
assert.match(hub, /addEventListener\('pointercancel', this\.handleSwipeCancel/, 'swipe navigation must reset on pointer cancel');
assert.doesNotMatch(hub, /projectSlotArtwork\(/, 'the editor must use the shared displayed projection from the config layer');
// ── v1.35 user-controlled rooms ─────────────────────────────────────────────
{
  const sanitize = (config) => {
    const result = museumHub.sanitizeMuseumHubConfig(JSON.parse(JSON.stringify(config)));
    assert.ok(result.config, `room config must sanitize: ${result.warnings.join(' | ')}`);
    return result.config;
  };
  const placedIds = (resolution) =>
    resolution.pages.flatMap((page) => page.slots).filter((slot) => slot.selectable && slot.artworkId).map((slot) => slot.artworkId);

  // Old files without a room list load unchanged: automatic extra rooms (option A).
  const legacyFile = JSON.parse(JSON.stringify(shippedConfigFile));
  delete legacyFile.rooms;
  delete legacyFile.fallbacks.autoPlaceUnmapped;
  const legacy = sanitize(legacyFile);
  assert.equal(legacy.fallbacks.autoPlaceUnmapped, true, 'files without a room list keep automatic extra rooms');
  const legacyResolution = museumHub.resolveMuseumHub(artworks, legacy, null);
  assert.equal(legacyResolution.pages.length, 2, 'legacy files still paginate overflow into automatic rooms');
  assert.equal(new Set(placedIds(legacyResolution)).size, artworks.length, 'legacy files still show every artwork');

  // Editor files (room list) hide unplaced artworks and list them (option B).
  const shipped = sanitize(shippedConfigFile);
  assert.equal(shipped.fallbacks.autoPlaceUnmapped, false);
  const hidden = museumHub.resolveMuseumHub(artworks, shipped, null);
  assert.equal(hidden.pages.length, 1, 'only Raum 1 exists in the shipped file');
  assert.deepEqual([...placedIds(hidden)].sort(), ['akt-27', 'fraktal']);
  assert.equal(hidden.unplacedArtworkIds.length, artworks.length - 2, 'unplaced artworks are listed');
  assert.ok(hidden.warnings.some((warning) => /not assigned to a room and stay hidden/.test(warning)), 'unplaced artworks are reported in diagnostics');
  assert.deepEqual(hidden.rooms.map((room) => room.id), ['room-01']);

  // Add a room: copies the current layout without artworks.
  const added = museumHub.addRoomToConfig(shippedConfigFile, { afterRoomId: 'room-01', templateRoomId: 'room-01' });
  assert.equal(added.roomId, 'room-02');
  assert.deepEqual(added.config.rooms.map((room) => room.id), ['room-01', 'room-02']);
  const room2Slots = added.config.slots.filter((slot) => slot.id.startsWith('room-02.'));
  assert.equal(room2Slots.length, 4, 'a new room has the four standard places');
  assert.ok(room2Slots.every((slot) => !slot.artworkId), 'a new room starts without artworks');
  for (const slot of room2Slots) {
    const template = shippedConfigFile.slots.find((candidate) => candidate.id === slot.id.replace('room-02.', 'room-01.'));
    assert.deepEqual(slot.placement, template.placement, `${slot.id} copies the layout of its Raum 1 place`);
  }
  // Empty rooms stay editable but are skipped in the gallery.
  const editorEmpty = museumHub.resolveMuseumHub(artworks, sanitize(added.config), null, { editor: true });
  assert.equal(editorEmpty.rooms.length, 2, 'the editor keeps empty rooms');
  assert.equal(editorEmpty.pages.length, 2, 'the editor keeps pages for empty rooms');
  const galleryEmpty = museumHub.resolveMuseumHub(artworks, sanitize(added.config), null);
  assert.equal(galleryEmpty.pages.length, 1, 'the gallery skips empty rooms');

  // Assign two artworks to Raum 2; swapping keeps each artwork exactly once.
  let edited = museumHub.assignArtworkInConfig(added.config, 'room-02.wall-front.a', 'square-fixture').config;
  edited = museumHub.assignArtworkInConfig(edited, 'room-02.wall-front.b', 'square-fixture-2').config;
  const swap = museumHub.assignArtworkInConfig(edited, 'room-02.wall-front.a', 'fraktal');
  assert.equal(swap.swappedWithSlotId, 'room-01.wall-front.a', 'assigning a placed artwork swaps the two places');
  assert.equal(swap.config.slots.find((slot) => slot.id === 'room-01.wall-front.a').artworkId, 'square-fixture');
  const removed = museumHub.assignArtworkInConfig(edited, 'room-02.wall-front.b', null);
  assert.equal(removed.replacedArtworkId, 'square-fixture-2');
  assert.equal(removed.config.slots.find((slot) => slot.id === 'room-02.wall-front.b').artworkId, undefined);

  // Copied layout stays inside the green area (shared evaluateDisplayedPlacement).
  const twoRooms = museumHub.resolveMuseumHub(artworks, sanitize(edited), null, { editor: true });
  for (const slot of twoRooms.pages[1].slots.filter((candidate) => candidate.artworkId)) {
    const wall = twoRooms.wallById.get(slot.placement.wallId);
    const evaluation = museumHub.evaluateDisplayedPlacement(wall, slot.placement, slot.artworkAspect, twoRooms.stage);
    assert.equal(evaluation.valid, true, `${slot.id} copied layout must stay valid (${evaluation.issues.join(', ')})`);
  }
  // Without a template, new rooms use safe defaults inside the green area.
  const fallbackRoom = museumHub.addRoomToConfig(shippedConfigFile);
  const fallbackFront = fallbackRoom.config.slots.filter((slot) => slot.id.startsWith(`${fallbackRoom.roomId}.wall-front`));
  assert.ok(fallbackFront.every((slot) => slot.placement.centerHeight === museumHub.HUB_SAFE_FRONT_CENTERLINE_M));

  // Export → reload round trip keeps the room list, order, names, and assignment.
  const named = museumHub.renameRoomInConfig(edited, 'room-02', '  Grafik   Raum ');
  assert.equal(named.rooms.find((room) => room.id === 'room-02').name, 'Grafik Raum');
  const reloaded = sanitize(named);
  assert.deepEqual(reloaded.rooms, named.rooms, 'room list survives export and reload');
  const reloadedResolution = museumHub.resolveMuseumHub(artworks, reloaded, null);
  assert.equal(reloadedResolution.pages.length, 2);
  assert.deepEqual(
    reloadedResolution.pages[1].slots.filter((slot) => slot.artworkId).map((slot) => slot.artworkId).sort(),
    ['square-fixture', 'square-fixture-2']
  );
  assert.equal(reloadedResolution.rooms[1].name, 'Grafik Raum');

  // Reordering changes the visitor walk order.
  const moved = museumHub.moveRoomInConfig(named, 'room-02', -1);
  assert.deepEqual(moved.rooms.map((room) => room.id), ['room-02', 'room-01']);
  const movedResolution = museumHub.resolveMuseumHub(artworks, sanitize(moved), null);
  assert.ok(movedResolution.pages[0].slots.every((slot) => slot.id.startsWith('room-02.')), 'first page is the first listed room');
  assert.equal(museumHub.moveRoomInConfig(named, 'room-01', -1), null, 'the first room cannot move earlier');

  // Duplicate (layout + name), then delete rooms.
  const duplicate = museumHub.addRoomToConfig(named, { afterRoomId: 'room-02', templateRoomId: 'room-02', name: 'Grafik Raum (Kopie)' });
  assert.equal(duplicate.roomId, 'room-03');
  assert.equal(duplicate.config.slots.filter((slot) => slot.id.startsWith('room-03.') && slot.artworkId).length, 0);
  const deleteEmpty = museumHub.deleteRoomFromConfig(duplicate.config, 'room-03', 'unplaced');
  assert.deepEqual(deleteEmpty.config.rooms.map((room) => room.id), ['room-01', 'room-02']);
  const toPrevious = museumHub.deleteRoomFromConfig(named, 'room-02', 'previous');
  assert.equal(toPrevious.targetRoomId, 'room-01');
  assert.deepEqual(toPrevious.movedArtworkIds, [], 'unavailable authored mappings still occupy their saved places');
  assert.deepEqual(toPrevious.unplacedArtworkIds.sort(), ['square-fixture', 'square-fixture-2'], 'artworks without a free destination become unplaced');
  const withFreePlaces = {
    ...named,
    slots: named.slots.map((slot) => slot.id.startsWith('room-01.wall-left') || slot.id.startsWith('room-01.wall-right')
      ? { ...slot, artworkId: undefined }
      : slot),
  };
  const intoFreePlaces = museumHub.deleteRoomFromConfig(withFreePlaces, 'room-02', 'previous');
  assert.deepEqual(intoFreePlaces.movedArtworkIds.sort(), ['square-fixture', 'square-fixture-2'], 'artworks move into explicitly freed places of the previous room');
  const toUnplaced = museumHub.deleteRoomFromConfig(named, 'room-02', 'unplaced');
  assert.deepEqual(toUnplaced.unplacedArtworkIds.sort(), ['square-fixture', 'square-fixture-2']);
  assert.equal(museumHub.deleteRoomFromConfig(shippedConfigFile, 'room-01', 'unplaced'), null, 'the only room cannot be deleted');

  // Import accepts a different room count and assignment; only fixed fields must match.
  assert.equal(
    museumHub.hubFixedFieldsSignature(sanitize(duplicate.config)),
    museumHub.hubFixedFieldsSignature(shipped),
    'room count and assignment are not fixed fields'
  );
  const changedCamera = sanitize({ ...shippedConfigFile, camera: { ...shippedConfigFile.camera, verticalFovDeg: shippedConfigFile.camera.verticalFovDeg + 5 } });
  assert.notEqual(museumHub.hubFixedFieldsSignature(changedCamera), museumHub.hubFixedFieldsSignature(shipped));
  const ghost = museumHub.assignArtworkInConfig(named, 'room-01.wall-left.a', 'ghost-artwork').config;
  const cleaned = museumHub.dropUnknownArtworkAssignments(ghost, new Set([
    ...artworks.map((artwork) => artwork.id), ...shippedConfigFile.slots.map((slot) => slot.artworkId),
  ]));
  assert.deepEqual(cleaned.droppedArtworkIds, ['ghost-artwork'], 'unknown artwork ids are reported and dropped');
  assert.equal(cleaned.config.slots.find((slot) => slot.id === 'room-01.wall-left.a').artworkId, undefined);
}

// v1.37 resizing a wall quad in the editor never stretches artwork: the
// projected artwork keeps its on-screen aspect (height/width) and size at its
// centre while the wall gets taller, wider, or both.
{
  const projectedAspect = (projection) => {
    const [a, b, c, d] = projection.projectedQuad;
    const width = (Math.hypot(b.x - a.x, b.y - a.y) + Math.hypot(c.x - d.x, c.y - d.y)) / 2;
    const height = (Math.hypot(d.x - a.x, d.y - a.y) + Math.hypot(c.x - b.x, c.y - b.y)) / 2;
    return { width, height };
  };
  const stretchQuad = (quad, sx, sy) => {
    const cx = quad.reduce((sum, corner) => sum + corner.x, 0) / 4;
    const bottom = Math.max(...quad.map((corner) => corner.y));
    return quad.map((corner) => ({ x: cx + (corner.x - cx) * sx, y: bottom + (corner.y - bottom) * sy }));
  };
  const resolution = museumHub.resolveMuseumHub(projectionFixtureArtworks, projectionFixtureConfig);
  for (const slot of resolution.pages[0].slots) {
    const wall = resolution.wallById.get(slot.placement.wallId);
    if (!wall?.room || slot.placement.targetSizePolicy !== 'fixed-height') continue;
    const before = museumHub.projectDisplayedPlacement(wall, slot.placement, slot.artworkAspect, resolution.stage);
    assert.ok(before, `${slot.id} must project before the wall edit`);
    for (const [sx, sy] of [[1, 1.4], [1.3, 1], [1.25, 1.6], [0.85, 1.2]]) {
      const edited = { ...wall, quad: stretchQuad(wall.quad, sx, sy) };
      assert.notEqual(edited.quad, wall.referenceQuad);
      const after = museumHub.projectDisplayedPlacement(edited, slot.placement, slot.artworkAspect, resolution.stage);
      assert.ok(after, `${slot.id} must project after scaling the wall ${sx}×${sy}`);
      const original = projectedAspect(before);
      const scaled = projectedAspect(after);
      const ratioBefore = original.height / original.width;
      const ratioAfter = scaled.height / scaled.width;
      assert.ok(
        Math.abs(ratioAfter / ratioBefore - 1) < 0.03,
        `${slot.id} must keep its aspect when the wall is scaled ${sx}×${sy} (${ratioBefore.toFixed(3)} → ${ratioAfter.toFixed(3)})`
      );
      assert.ok(
        Math.abs(scaled.height / original.height - 1) < 0.05,
        `${slot.id} must keep its size when the wall is scaled ${sx}×${sy} (${original.height.toFixed(1)} → ${scaled.height.toFixed(1)} px)`
      );
    }
  }
  // Resolving must not alias the editable quad with the calibration reference.
  for (const wall of resolution.walls) {
    if (wall.room) assert.notEqual(wall.quad, wall.referenceQuad, `${wall.id} quad must be a copy of referenceQuad`);
  }
}

console.log('PASS: 9×12 m daylit room invariants, mirrored doorways, four-work 2+1+1 rooms, overflow pagination, calibrated projection, selection persistence hooks, token consistency, user-controlled rooms, and 404 fallback are valid.');
