import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, '..');
const SHIPPING_CONFIG_PATH = resolve(ROOT, 'customer-artworks/museum-hub.json');

async function loadTsModule(relativePath) {
  const entry = resolve(ROOT, relativePath);
  const result = buildSync({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    platform: 'browser',
    write: false,
    target: ['es2020'],
  });
  const code = result.outputFiles[0].text;
  const moduleUrl = 'data:text/javascript;base64,' + Buffer.from(code).toString('base64');
  return import(moduleUrl);
}

const museumHub = await loadTsModule('src/config/museumHub.ts');
const geometry = await loadTsModule('src/hub/projectiveGeometry.ts');

const artworks = [
  {
    id: 'portrait-work',
    title: 'Portrait Work',
    image: 'portrait.png',
    dimensions: { width: 900, height: 1200 },
  },
  {
    id: 'square-work',
    title: 'Square Work',
    image: 'square.png',
    dimensions: { width: 1200, height: 1200 },
  },
  {
    id: 'wide-work',
    title: 'Wide Work',
    image: 'wide.png',
    dimensions: { width: 2400, height: 900 },
  },
];

const v1Config = {
  version: 1,
  coverage: 'all-active-artworks',
  background: { src: 'Backgrounds/museum-empty.png', aspect: 1366 / 768 },
  visualTokens: { galleryWall: '#D8DDDB', museumWall: '#D8DDDB' },
  slots: [
    {
      id: 'room-01.wall-left.outer',
      enabled: true,
      selectable: true,
      artworkId: 'portrait-work',
      placement: { cx: 0.185, cy: 0.514, maxW: 0.056, maxH: 0.207, rotateYDeg: 18 },
    },
    {
      id: 'room-01.wall-right.inner',
      enabled: true,
      selectable: true,
      artworkId: 'square-work',
      placement: { cx: 0.625, cy: 0.515, maxW: 0.098, maxH: 0.16, rotateYDeg: -6 },
    },
  ],
};

const migrated = museumHub.resolveMuseumHub(artworks, v1Config, null);
assert.equal(migrated.source, 'v1-migrated');
assert.equal(migrated.slotToArtwork.get('room-01.wall-left.outer'), 'portrait-work');
assert.equal(migrated.slotToArtwork.get('room-01.wall-right.inner'), 'square-work');
assert.ok(migrated.warnings.some((warning) => warning.includes('migrated provisionally')));

const leftWall = migrated.wallById.get('wall-left-outer');
assert.ok(leftWall, 'expected built-in left outer wall to resolve');
const leftSlot = migrated.pages.flatMap((page) => page.slots).find((slot) => slot.id === 'room-01.wall-left.outer');
assert.ok(leftSlot, 'expected migrated slot to resolve');
const projection = geometry.projectSlotArtwork(leftWall, leftSlot.placement, leftSlot.artworkAspect, migrated.stage);
assert.ok(projection, 'expected projected artwork geometry');
assert.ok(projection.shortEdge >= 84, 'expected readable projected short edge');

const overlapConfig = {
  version: 2,
  coverage: 'all-active-artworks',
  stage: { width: 1366, height: 768 },
  background: { src: 'Backgrounds/museum-empty.png', aspect: 1366 / 768 },
  visualTokens: { galleryWall: '#D8DDDB', museumWall: '#D8DDDB' },
  walls: [
    {
      id: 'wall-left-inner',
      group: 'left',
      planeAspect: 1.06,
      quad: [
        { x: 362, y: 234 },
        { x: 688, y: 246 },
        { x: 732, y: 610 },
        { x: 332, y: 614 },
      ],
      safePolygon: [
        { x: 376, y: 250 },
        { x: 674, y: 260 },
        { x: 712, y: 594 },
        { x: 348, y: 598 },
      ],
    },
  ],
  fallbacks: {
    requireAllMapped: true,
    autoPlaceUnmapped: false,
    overflow: 'paginate',
    invalidMapping: 'disable-slot',
    missingImage: 'placeholder-exact-target',
    selectionTimeoutMs: 1500,
    selectionTimeout: 'open-exact-target-procedural',
  },
  slots: [
    {
      id: 'room-01.wall-left.outer',
      enabled: true,
      selectable: true,
      artworkId: 'portrait-work',
      placement: {
        wallId: 'wall-left-inner',
        center: { x: 0.35, y: 0.55 },
        mountedHeight: 0.34,
      },
    },
    {
      id: 'room-01.wall-left.inner',
      enabled: true,
      selectable: true,
      artworkId: 'wide-work',
      placement: {
        wallId: 'wall-left-inner',
        center: { x: 0.39, y: 0.55 },
        mountedHeight: 0.34,
      },
    },
  ],
};

const overlapped = museumHub.resolveMuseumHub(artworks, overlapConfig, null);
assert.ok(overlapped.warnings.some((warning) => warning.includes('overlaps')), 'expected overlap warning');

function rectPolygon(minX, minY, maxX, maxY) {
  return [
    { x: minX, y: minY },
    { x: maxX, y: minY },
    { x: maxX, y: maxY },
    { x: minX, y: maxY },
  ];
}

const shippingConfig = JSON.parse(readFileSync(SHIPPING_CONFIG_PATH, 'utf8'));
assert.ok(Array.isArray(shippingConfig.walls), 'shipping museum-hub config must include walls');
assert.ok(shippingConfig.walls.length > 2, 'shipping museum-hub config must encode more than two wall planes');

const shippingArtworks = [
  {
    id: 'fraktal',
    title: 'Fraktal',
    image: 'fraktal.png',
    dimensions: { width: 900, height: 1200 },
  },
  {
    id: 'akt-27',
    title: 'Akt 27',
    image: 'akt-27.png',
    dimensions: { width: 1200, height: 1200 },
  },
  {
    id: 'shipping-landscape-fixture',
    title: 'Landscape Fixture',
    image: 'landscape.png',
    dimensions: { width: 1800, height: 1100 },
  },
  {
    id: 'shipping-panoramic-fixture',
    title: 'Panoramic Fixture',
    image: 'panoramic.png',
    dimensions: { width: 2600, height: 1000 },
  },
];

const shipping = museumHub.resolveMuseumHub(shippingArtworks, shippingConfig, null);
const blockingWarningPatterns = [
  /projected artwork bounds extend outside wall safePolygon/i,
  /projected short edge .* below/i,
  /overlaps slot/i,
  /projected geometry is invalid/i,
];
for (const warning of shipping.warnings) {
  assert.ok(
    !blockingWarningPatterns.some((pattern) => pattern.test(warning)),
    `shipping museum-hub geometry warning must hard-fail: ${warning}`
  );
}

const expectedWallBySlotId = new Map([
  ['room-01.wall-left.outer', 'wall-left-outer'],
  ['room-01.wall-left.inner', 'wall-left-inner'],
  ['room-01.wall-right.inner', 'wall-right-inner'],
  ['room-01.wall-right.outer', 'wall-right-outer'],
]);

const resolvedSelectableSlots = shipping.pages
  .flatMap((page) => page.slots)
  .filter((slot) => slot.selectable && !!slot.artworkId);
assert.deepEqual(
  resolvedSelectableSlots.map((slot) => slot.id).sort(),
  [...expectedWallBySlotId.keys()].sort(),
  'shipping config must resolve all canonical wall slots'
);

const forbiddenDoorwayRegions = [
  rectPolygon(0, 120, 86, 768),
  rectPolygon(1280, 120, 1366, 768),
];

for (const slot of resolvedSelectableSlots) {
  const expectedWallId = expectedWallBySlotId.get(slot.id);
  assert.equal(slot.placement.wallId, expectedWallId, `${slot.id} must resolve to the expected wall plane`);
  const wall = shipping.wallById.get(slot.placement.wallId);
  assert.ok(wall, `wall ${slot.placement.wallId} must exist`);
  const projected = geometry.projectSlotArtwork(wall, slot.placement, slot.artworkAspect, shipping.stage);
  assert.ok(projected, `slot ${slot.id} must produce projected geometry`);
  assert.ok(projected.shortEdge >= 84, `slot ${slot.id} short edge (${projected.shortEdge.toFixed(1)}px) must stay readable`);

  for (const corner of projected.projectedQuad) {
    assert.ok(
      geometry.pointInPolygon(corner, wall.safePolygon),
      `slot ${slot.id} corner (${corner.x.toFixed(1)}, ${corner.y.toFixed(1)}) must stay inside stage-space safePolygon`
    );
  }
  for (const forbidden of forbiddenDoorwayRegions) {
    assert.ok(
      !geometry.polygonsIntersect(projected.projectedQuad, forbidden),
      `slot ${slot.id} must not intersect doorway forbidden regions`
    );
  }
}

const expectedProjectedCorners = {
  'room-01.wall-left.outer': [
    { x: 171.57, y: 352.16 },
    { x: 292.61, y: 365.06 },
    { x: 279.48, y: 530.73 },
    { x: 152.59, y: 526.97 },
  ],
  'room-01.wall-left.inner': [
    { x: 472.68, y: 384.1 },
    { x: 603.88, y: 386.54 },
    { x: 609.62, y: 476.31 },
    { x: 471.78, y: 475.32 },
  ],
  'room-01.wall-right.inner': [
    { x: 793.17, y: 386.44 },
    { x: 877.45, y: 384.88 },
    { x: 877.81, y: 481.48 },
    { x: 789.78, y: 482.02 },
  ],
  'room-01.wall-right.outer': [
    { x: 1037.99, y: 397.5 },
    { x: 1262.37, y: 376.41 },
    { x: 1273.23, y: 468.99 },
    { x: 1042.29, y: 481.47 },
  ],
};

const cornerTolerancePx = 28;
for (const slot of resolvedSelectableSlots) {
  const wall = shipping.wallById.get(slot.placement.wallId);
  assert.ok(wall, `wall ${slot.placement.wallId} must resolve for projection tolerance checks`);
  const projected = geometry.projectSlotArtwork(wall, slot.placement, slot.artworkAspect, shipping.stage);
  assert.ok(projected, `${slot.id} must project for tolerance checks`);
  const expected = expectedProjectedCorners[slot.id];
  assert.ok(expected, `expected projected-corner fixture is missing for ${slot.id}`);
  projected.projectedQuad.forEach((corner, index) => {
    const target = expected[index];
    const distance = Math.hypot(corner.x - target.x, corner.y - target.y);
    assert.ok(
      distance <= cornerTolerancePx,
      `${slot.id} corner ${index} drift ${distance.toFixed(2)}px exceeds ${cornerTolerancePx}px tolerance`
    );
  });
}

const homographyProbePoints = [
  { x: 0.2, y: 0.2 },
  { x: 0.5, y: 0.5 },
  { x: 0.8, y: 0.7 },
];
for (const wall of shipping.walls) {
  for (const probe of homographyProbePoints) {
    const stagePoint = geometry.projectWallPoint(wall, probe);
    assert.ok(stagePoint, `wall ${wall.id} must project probe point`);
    const localPoint = geometry.invertWallPoint(wall, stagePoint);
    assert.ok(localPoint, `wall ${wall.id} must invert projected probe point`);
    const error = Math.hypot(localPoint.x - probe.x, localPoint.y - probe.y);
    assert.ok(error <= 0.01, `wall ${wall.id} homography roundtrip error ${error.toFixed(5)} exceeds 0.01`);
  }
}

console.log('PASS: museum-hub geometry migration, overlap checks, and shipping wall-plane constraints are valid.');
