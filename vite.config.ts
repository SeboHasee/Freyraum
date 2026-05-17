import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    target: 'es2018',
    minify: 'esbuild',
    rollupOptions: {
      // app.html is the Vite development entry; root index.html is reserved as the one-click local launcher.
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
