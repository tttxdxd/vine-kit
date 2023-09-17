import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const rootPath = resolve(__dirname, '../')

const tsPath = resolve(rootPath, 'tsconfig.json')
const tsconfig = JSON.parse(readFileSync(tsPath, 'utf8'))
const paths: any = tsconfig.compilerOptions.paths
const keys = Object.keys(paths)
const alias: Record<string, string> = {}

keys.forEach((key) => {
  const path = paths[key][0]

  alias[key] = resolve(rootPath, path)
})

export { alias }
