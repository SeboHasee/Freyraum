/**
 * v1.39 — Builds the FREYRAUM Editor desktop app into `desktop/dist/`:
 *   main.cjs / preload.cjs   Electron main process and preload (esbuild)
 *   editor/                  the editor bundle from the repository build
 *                            (customer-preview/) plus app pages without
 *                            inline scripts (strict Content Security Policy)
 *   importer/                scripts/import-artworks.mjs ("Update Gallery")
 *
 * Run `npm run build` in the repository root first.
 */
import { build } from 'esbuild';
import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const desktopDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(desktopDir, '..');
const previewDir = join(repoRoot, 'customer-preview');
const distDir = join(desktopDir, 'dist');
const editorDir = join(distDir, 'editor');
const importerDir = join(distDir, 'importer');

const required = ['freyraum-gallery.js', 'style.css'];
const missing = required.filter((file) => !existsSync(join(previewDir, file)));
if (missing.length) {
  console.error(`✗ Missing ${missing.map((file) => `customer-preview/${file}`).join(', ')}.`);
  console.error('  Run "npm run build" in the repository root first.');
  process.exit(1);
}

rmSync(distDir, { recursive: true, force: true });
mkdirSync(editorDir, { recursive: true });
mkdirSync(importerDir, { recursive: true });

const common = {
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node22',
  external: ['electron'],
  sourcemap: false,
  logLevel: 'warning',
  legalComments: 'none',
};
await build({ ...common, entryPoints: [join(desktopDir, 'src', 'main.ts')], outfile: join(distDir, 'main.cjs') });
await build({ ...common, entryPoints: [join(desktopDir, 'src', 'preload.ts')], outfile: join(distDir, 'preload.cjs') });

for (const file of ['freyraum-gallery.js', 'style.css', 'webgpu-probe.js']) {
  if (existsSync(join(previewDir, file))) copyFileSync(join(previewDir, file), join(editorDir, file));
}
copyFileSync(join(repoRoot, 'scripts', 'import-artworks.mjs'), join(importerDir, 'import-artworks.mjs'));

// Data scripts are served from the opened project folder (see appProtocol.ts);
// the app sends `Cache-Control: no-store`, so no cache-busting query is needed.
const page = ({ title, description, bodyClass = '' }) => `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${description}" />
  <title>${title}</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
  <div id="app"></div>
  <script src="./customer-artworks.js"></script>
  <script src="./customer-audio.js"></script>
  <script src="./freyraum-gallery.js"></script>
</body>
</html>
`;

writeFileSync(
  join(editorDir, 'placement-editor.html'),
  page({ title: 'FREYRAUM Editor', description: 'FREYRAUM Editor — Bilder platzieren', bodyClass: 'placement-editor' })
);
writeFileSync(
  join(editorDir, 'app.html'),
  page({ title: 'FREYRAUM — Galerie-Vorschau', description: 'FREYRAUM Galerie-Vorschau' })
);
writeFileSync(
  join(editorDir, 'loading.html'),
  `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>FREYRAUM Editor</title>
  <style>
    html, body { height: 100%; margin: 0; }
    body { display: grid; place-items: center; background: #12171b; color: #f4efe6; font-family: system-ui, sans-serif; }
    main { text-align: center; }
    h1 { font-weight: 300; letter-spacing: 0.3em; font-size: 1.4rem; margin: 0 0 1rem; }
    p { opacity: 0.75; margin: 0; }
    .bar { width: 14rem; height: 2px; margin: 1.5rem auto 0; background: rgba(244, 239, 230, 0.15); overflow: hidden; }
    .bar::after { content: ''; display: block; width: 35%; height: 100%; background: #c8a46a; animation: slide 1.4s ease-in-out infinite; }
    @keyframes slide { from { transform: translateX(-100%); } to { transform: translateX(300%); } }
    @media (prefers-reduced-motion: reduce) { .bar::after { animation: none; width: 100%; } }
  </style>
</head>
<body>
  <main role="status" aria-live="polite">
    <h1>FREYRAUM</h1>
    <p>Galerie wird aktualisiert …</p>
    <div class="bar" aria-hidden="true"></div>
  </main>
</body>
</html>
`
);

console.log('✓ Desktop app built into desktop/dist/');
