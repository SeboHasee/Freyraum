import { defineConfig } from 'vite';

export default defineConfig({
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
