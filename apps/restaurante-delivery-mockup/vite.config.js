import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: path.resolve(__dirname, '../../js/restaurante-delivery'),
    emptyOutDir: true,
    cssMinify: true,
    lib: {
      entry: path.resolve(__dirname, 'src/mount.jsx'),
      name: 'RestauranteDeliveryWidget',
      formats: ['es'],
      fileName: 'restaurante-delivery',
    },
    rollupOptions: {
      treeshake: true,
      output: {
        assetFileNames: 'restaurante-delivery.[ext]',
      },
    },
  },
});
