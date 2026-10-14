import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';
import * as THREE from 'three';

const root = new URL('../', import.meta.url);
const loadTsModule = async (relativePath) => {
  const source = await readFile(new URL(relativePath, root), 'utf8');
  const result = await build({
    stdin: {
      contents: source,
      loader: 'ts',
      resolveDir: new URL(relativePath, root).pathname.replace(/[^/]+$/, ''),
    },
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
    absWorkingDir: new URL('../', import.meta.url).pathname,
  });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
};

const [museumHub, geometry, artworks] = await Promise.all([
  loadTsModule('src/config/museumHub.ts'),
  loadTsModule('src/hub/projectiveGeometry.ts'),
  loadTsModule('src/config/artworks.ts'),
]);

const resolution = museumHub.resolveMuseumHub(artworks.artworks, undefined);
const fixtures = [
  ['portrait', 1800 / 2400],
  ['square', 2100 / 2100],
  ['landscape', 2400 / 1600],
  ['panoramic', 2800 / 1200],
];
const tolerance = 1e-9;
const ratio = (width, height) => width / height;
const boundsOfAttribute = (attribute, component) => {
  const values = [];
  for (let index = component; index < attribute.count * attribute.itemSize; index += attribute.itemSize) {
    values.push(attribute.array[index]);
  }
  return Math.max(...values) - Math.min(...values);
};
const applyHomography = (matrix, x, y) => {
  const denominator = matrix[6] * x + matrix[7] * y + matrix[8];
  return {
    x: (matrix[0] * x + matrix[1] * y + matrix[2]) / denominator,
    y: (matrix[3] * x + matrix[4] * y + matrix[5]) / denominator,
  };
};

console.log('ARTWORK ASPECT DIAGNOSTIC');
for (const [label, sourceAspect] of fixtures) {
  const artwork = artworks.artworks.find((candidate) => Math.abs(
    candidate.dimensions.width / candidate.dimensions.height - sourceAspect
  ) < tolerance);
  assert.ok(artwork, `${label} fixture must exist`);
  const nativeWidth = artwork.dimensions.width;
  const nativeHeight = artwork.dimensions.height;
  const nativeAspectRatio = ratio(nativeWidth, nativeHeight);
  const artworkHeight = 1.25;
  const artworkWidth = artworkHeight * nativeAspectRatio;

  const plane = new THREE.PlaneGeometry(1, 1);
  const geometryWidth = boundsOfAttribute(plane.getAttribute('position'), 0) * artworkWidth;
  const geometryHeight = boundsOfAttribute(plane.getAttribute('position'), 1) * artworkHeight;
  const uv = plane.getAttribute('uv');
  const uvWidth = boundsOfAttribute(uv, 0);
  const uvHeight = boundsOfAttribute(uv, 1);

  console.log(`\n${label}`);
  console.log(`SOURCE       ${nativeWidth}x${nativeHeight} ${nativeAspectRatio.toFixed(9)}`);
  console.log(`MODEL        ${artworkWidth.toFixed(9)}x${artworkHeight.toFixed(9)} ${ratio(artworkWidth, artworkHeight).toFixed(9)}`);
  console.log(`GEOMETRY     ${geometryWidth.toFixed(9)}x${geometryHeight.toFixed(9)} ${ratio(geometryWidth, geometryHeight).toFixed(9)}`);
  console.log(`UV           ${uvWidth.toFixed(9)}x${uvHeight.toFixed(9)} ${ratio(uvWidth, uvHeight).toFixed(9)}`);
  assert.ok(Math.abs(ratio(geometryWidth, geometryHeight) - nativeAspectRatio) < tolerance);
  assert.equal(uvWidth, 1);
  assert.equal(uvHeight, 1);
  plane.dispose();

  for (const wallId of ['wall-front', 'wall-left', 'wall-right']) {
    const wall = resolution.wallById.get(wallId);
    const template = resolution.pages[0].slots.find((slot) => slot.placement.wallId === wallId)
      ?? resolution.pages[0].slots[0];
    const projection = geometry.projectSlotArtwork(
      wall,
      { ...template.placement, mountedHeight: artworkHeight, physicalHeight: artworkHeight },
      nativeAspectRatio,
      resolution.stage
    );
    assert.ok(projection, `${label}/${wallId} projection must exist`);
    const domRatio = ratio(projection.sourceWidth, projection.sourceHeight);
    const projectedSourceCorners = [
      [0, 0],
      [projection.sourceWidth, 0],
      [projection.sourceWidth, projection.sourceHeight],
      [0, projection.sourceHeight],
    ];
    const projectedQuad = projection.projectedQuad;
    const projectiveMatrix = geometry.computeHomographyFromUnitSquare(projectedQuad);
    assert.ok(projectiveMatrix);
    const cornerError = projectedSourceCorners.reduce((maxError, [x, y], index) => {
      const normalized = applyHomography(
        projectiveMatrix,
        x / projection.sourceWidth,
        y / projection.sourceHeight
      );
      const target = projectedQuad[index];
      return Math.max(maxError, Math.hypot(normalized.x - target.x, normalized.y - target.y));
    }, 0);
    console.log(`DISPLAY/${wallId} source ${projection.sourceWidth.toFixed(6)}x${projection.sourceHeight.toFixed(6)} ${domRatio.toFixed(9)} cornerError=${cornerError.toExponential(3)}`);
    assert.ok(Math.abs(domRatio - nativeAspectRatio) < tolerance);
    assert.ok(cornerError < tolerance);
  }
}

console.log('\nPASS: source, model, actual plane, UV, DOM source rectangle, and projective corner mapping preserve native aspect.');
