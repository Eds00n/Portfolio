import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: path.resolve(__dirname, '../../js/treino-do-dia'),
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/mount.jsx'),
      name: 'TreinoDoDiaWidget',
      formats: ['es'],
      fileName: 'treino-do-dia',
    },
    rollupOptions: {
      output: {
        assetFileNames: 'treino-do-dia.[ext]',
      },
    },
  },
});
