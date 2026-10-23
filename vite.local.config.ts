import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

// v1.46 — `public/customer-artworks.js` is the web manifest without embedded
// image bytes. The local `file://` preview needs the importer's variant with
// `webglImage` fallbacks, so keep it across `emptyOutDir` and the public copy.
const LOCAL_PREVIEW_MANIFESTS = ['customer-artworks.js', 'customer-artworks.web.js'];

function keepLocalPreviewManifests(): Plugin {
  const kept = new Map<string, string>();
  return {
    name: 'freyraum-keep-local-preview-manifests',
    apply: 'build',
    buildStart() {
      for (const name of LOCAL_PREVIEW_MANIFESTS) {
        const path = resolve('customer-preview', name);
        if (existsSync(path)) kept.set(path, readFileSync(path, 'utf8'));
      }
    },
    closeBundle() {
      for (const [path, contents] of kept) writeFileSync(path, contents, 'utf8');
      // Web-only WebP derivatives (B2) are not referenced by the local manifest.
      rmSync(resolve('customer-preview', 'web-images'), { recursive: true, force: true });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [keepLocalPreviewManifests()],
  build: {
    outDir: 'customer-preview',
    emptyOutDir: true,
    target: 'es2018',
    cssCodeSplit: false,
    lib: {
      entry: 'src/main.ts',
      name: 'FreyraumApp',
      formats: ['iife'],
      fileName: () => 'freyraum-gallery.js',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
