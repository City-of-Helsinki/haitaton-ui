import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        loadPaths: ['node_modules', '.'],
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        // Suppress CSSOM parse errors from hds-react injecting modern CSS into jsdom
        resources: 'usable',
      },
    },
    setupFiles: ['./src/setupTests.ts'],
    testTimeout: 240000,
    exclude: ['node_modules', 'e2e/**'],
    css: {
      modules: {
        // Use identity class names (matches CRA/Jest CSS module behavior)
        classNameStrategy: 'non-scoped',
      },
    },
    onConsoleLog(log) {
      if (log.includes('Could not parse CSS stylesheet')) return false;
      // hds-react internal minified components still use defaultProps (unfixable without upgrading hds-react)
      if (log.includes('Support for defaultProps will be removed')) return false;
    },
    server: {
      deps: {
        inline: ['ol'], // OpenLayers must be transformed (replaces transformIgnorePatterns)
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text'],
      reportsDirectory: './coverage',
    },
  },
});
