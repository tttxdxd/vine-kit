import { readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

function r(p: string, subModule: boolean = false) {
  if (subModule)
    return resolve(__dirname, '../packages', p, 'src/index.ts')
  return resolve(__dirname, '../packages', p)
}

const dirs = readdirSync(r(''))
const alias: Record<string, string> = {
  'vine-kit': r('vine-kit', true),
}

for (const dir of dirs) {
  if (dir === 'vine-kit')
    continue

  const key = `@vine-kit/${dir}`
  if (
    !(key in alias)
    && statSync(r(dir)).isDirectory()
  )
    alias[key] = r(dir, true)
}

export { alias }
