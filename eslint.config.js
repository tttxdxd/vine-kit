import antfu from '@antfu/eslint-config'

export default antfu(
  {
    regexp: {
      overrides: {
        'regexp/no-empty-capturing-group': 'off',
        'regexp/no-empty-group': 'off',
        'ts/no-empty-object-type': 'off',
      },
    },
  },
)
