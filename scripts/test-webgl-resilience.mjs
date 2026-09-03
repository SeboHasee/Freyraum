import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const result = buildSync({
  entryPoints: [resolve(root, 'src/utils/webgl.ts')],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  write: false,
  target: ['es2020'],
});
const webgl = await import(
  `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`
);

const attemptedPreferences = [];
const released = [];
const dependencies = {
  createCanvas() {
    const index = attemptedPreferences.length;
    return {
      getContext(_type, attributes) {
        attemptedPreferences.push(attributes.powerPreference);
        return {
          getExtension(name) {
            return name === 'WEBGL_lose_context'
              ? { loseContext: () => released.push(index) }
              : null;
          },
        };
      },
    };
  },
  createRenderer(parameters) {
    if (attemptedPreferences.length < 3) throw new Error('simulated initialization failure');
    return { domElement: parameters.canvas };
  },
};

const creation = webgl.createResilientWebGLRenderer({}, dependencies);
assert.deepEqual(creation.attempts, ['preferred', 'compatibility', 'battery']);
assert.deepEqual(attemptedPreferences, ['high-performance', 'default', 'low-power']);
assert.deepEqual(released, [0, 1], 'failed contexts must be explicitly released');
assert.equal(creation.mode, 'battery');

assert.throws(
  () => webgl.createResilientWebGLRenderer({}, {
    ...dependencies,
    createRenderer() {
      throw new Error('always fails');
    },
  }),
  (error) => {
    assert.equal(error.name, 'WebGLRendererCreationError');
    assert.deepEqual(error.attempts, ['preferred', 'compatibility', 'battery']);
    return true;
  }
);

const mainSource = readFileSync(resolve(root, 'src/main.ts'), 'utf8');
const hubSource = readFileSync(resolve(root, 'src/hub/MainMuseumHub.ts'), 'utf8');
const fallbackSource = readFileSync(resolve(root, 'src/ui/FallbackScreen.ts'), 'utf8');
const previewWriter = readFileSync(resolve(root, 'scripts/write-local-preview.mjs'), 'utf8');

assert.doesNotMatch(mainSource, /isWebGLAvailable/);
assert.match(mainSource, /category: 'startup'/);
assert.match(mainSource, /rendererMode !== 'preferred'/);
assert.match(hubSource, /hubRoomRenderer: HubRoomRenderer \| null/);
assert.match(hubSource, /classList\.add\('is-2d'\)/);
assert.match(fallbackSource, /In 2D fortfahren/);
assert.match(fallbackSource, /\{ once: true \}/);
assert.doesNotMatch(previewWriter, /fonts\.googleapis\.com/);
assert.match(previewWriter, /__FREYRAUM_PREVIEW_ASSET_FAILURE__/);

console.log('WebGL resilience checks passed.');
