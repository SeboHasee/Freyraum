import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'customer-preview',
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      input: 'app.html',
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
