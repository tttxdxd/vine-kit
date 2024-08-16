import { describe, expect, it } from 'vitest'

import { ObjectUtil } from '@vine-kit/core'

describe('objectUtil.defaults', () => {
  it('should return a new object with default values for undefined keys', () => {
    const options = { a: 1 }
    const defaultsOptions = { a: 2, b: 2 }
    const result = ObjectUtil.defaults(options, defaultsOptions)

    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('should handle nested objects', () => {
    const options = { a: { x: 1 } }
    const defaultsOptions = { a: { x: 2, y: 3 }, b: 4 }
    const result = ObjectUtil.defaults(options, defaultsOptions)

    expect(result).toEqual({ a: { x: 1 }, b: 4 })
  })

  it('should not overwrite existing keys', () => {
    const options = { a: 1, b: 2 }
    const defaultsOptions = { a: 3, c: 4 }
    const result = ObjectUtil.defaults(options, defaultsOptions)

    expect(result).toEqual({ a: 1, b: 2, c: 4 })
  })

  it('should handle arrays gracefully (ignoring deep merging)', () => {
    const options = { a: [1] }
    const defaultsOptions = { a: [2], b: 3 }
    const result = ObjectUtil.defaults(options, defaultsOptions)

    expect(result).toEqual({ a: [1], b: 3 })
  })

  it('should handle empty defaults', () => {
    const options = { a: 1 }
    const defaultsOptions = {}
    const result = ObjectUtil.defaults(options, defaultsOptions)

    expect(result).toEqual({ a: 1 })
  })

  it('should handle empty options', () => {
    const options = {}
    const defaultsOptions = { a: 1, b: 2 }
    const result = ObjectUtil.defaults(options, defaultsOptions)

    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('should handle both options and defaults as empty', () => {
    const options = {}
    const defaultsOptions = {}
    const result = ObjectUtil.defaults(options, defaultsOptions)

    expect(result).toEqual({})
  })
})
