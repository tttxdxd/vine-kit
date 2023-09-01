import { defaultExclude, defineConfig } from 'vitest/config'
import { alias } from './alias'

export default defineConfig({
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
  },
})
