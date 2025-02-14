import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      input: 'src/index',
    },
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
})
