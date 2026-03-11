import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: false,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        loadPaths: ['node_modules', '.'],
      },
    },
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    // Main app bundle remains ~1.8 MB until route-based lazy loading is implemented.
    // Vendor libraries are already split into separate cached chunks below.
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-hds': ['hds-react'],
          'vendor-ol': ['ol'],
          'vendor-chakra': ['@chakra-ui/react', 'framer-motion'],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'yup'],
          'vendor-query': ['react-query'],
          'vendor-i18n': ['i18next', 'react-i18next'],
        },
      },
    },
  },
});
