import { defineConfig } from 'vite'
import path from 'path';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  root: path.resolve(__dirname, 'src'),
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    minify: true,
    manifest: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "src/js/main.js"),
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer],
    },
  },
  server: {
    port: 8080
  }
})
