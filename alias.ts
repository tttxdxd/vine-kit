import { resolve } from 'node:path'

function r(p: string) {
  return resolve(__dirname, p)
}

export const alias: Record<string, string> = {
  '@vine-kit/core': r('./packages/core/src/'),
  'vine-kit': r('./packages/vine-kit/src/'),
}
