import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['pdfjs-dist/build/pdf.worker.entry'],
  },
  server: {
    host: true,
    port: 3000,
    watch: {
      usePolling: true,
    },
  },
});
