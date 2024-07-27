import swc from 'unplugin-swc'
import { defaultExclude, defineConfig } from 'vitest/config'

import { alias } from './scripts/alias'

export default defineConfig({
  define: {
    __DEV__: true,
    __TEST__: true,
  },
  optimizeDeps: {
    entries: [],
  },
  resolve: {
    alias,
  },
  test: {
    testTimeout: 30_000,
    name: 'unit',
    exclude: [...defaultExclude],
    coverage: {
      include: ['**/src/**'],
    },
  },
  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
    }),
  ],
})
