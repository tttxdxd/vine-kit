import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      input: 'src/index',
    },
    {
      input: 'src/locales/index.ts',
      outDir: 'dist/locales/',
    },
    {
      input: 'src/locales/en.ts',
      outDir: 'dist/locales/',
    },
    {
      input: 'src/locales/zh-CN.ts',
      outDir: 'dist/locales/',
    },
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
})
