import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: '/Freyraum/',
  build: {
    outDir: 'dist',
    target: 'es2018',
    minify: 'esbuild',
    rollupOptions: {
      // Root index.html remains the local preview launcher. The placement editor
      // is a dedicated entry that reuses the same application runtime.
      input: {
        app: resolve(process.cwd(), 'app.html'),
        'placement-editor': resolve(process.cwd(), 'placement-editor.html'),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  }
});
