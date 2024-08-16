import { describe, expect, it } from 'vitest'

import { mergeDeep } from '@vine-kit/core'

describe('objectUtil.mergeDeep', () => {
  it('should return the original object if no patch is provided', () => {
    const original = { a: 1, b: 2 }
    const result = mergeDeep(original)
    expect(result).toEqual(original)
  })

  it('should merge objects with simple values', () => {
    const original = { a: 1, b: 2 }
    const patch = { b: 3, c: 4 }
    const result = mergeDeep(original, patch)
    expect(result).toEqual({ a: 1, b: 3, c: 4 })
  })

  it('should merge nested objects', () => {
    const original = { a: 1, b: { c: 2 } }
    const patch = { b: { d: 3 } }
    const result = mergeDeep(original, patch as any)
    expect(result).toEqual({ a: 1, b: { c: 2, d: 3 } })
  })

  it('should replace nested objects if they are not objects', () => {
    const original = { a: 1, b: { c: 2 } }
    const patch = { b: 3 }
    const result = mergeDeep(original, patch as any)
    expect(result).toEqual({ a: 1, b: 3 })
  })

  it('should merge arrays if mergeArray is true', () => {
    const original = [1, 2]
    const patch = [3, 4]
    const result = mergeDeep(original, patch, true)
    expect(result).toEqual([1, 2, 3, 4])
  })

  it('should replace arrays if mergeArray is false', () => {
    const original = [1, 2]
    const patch = [3, 4]
    const result = mergeDeep(original, patch, false)
    expect(result).toEqual([3, 4])
  })

  it('should handle nested arrays correctly', () => {
    const original = { a: [1, 2], b: { c: [3, 4] } }
    const patch = { a: [5], b: { c: [6] } }
    const result = mergeDeep(original, patch, true)
    expect(result).toEqual({ a: [1, 2, 5], b: { c: [3, 4, 6] } })
  })

  it('should handle mixed types', () => {
    const original = { a: 1, b: [2, 3], c: { d: 4 } }
    const patch = { b: [4], c: { e: 5 }, f: true }
    const result = mergeDeep(original, patch as any, true)
    expect(result).toEqual({ a: 1, b: [2, 3, 4], c: { d: 4, e: 5 }, f: true })
  })

  it('should handle null/undefined values', () => {
    const original = { a: 1, b: { c: 2 } }
    const patch = { b: null }
    const result = mergeDeep(original, patch as any)
    expect(result).toEqual({ a: 1, b: null })
  })

  it('should handle empty patch object', () => {
    const original = { a: 1, b: 2 }
    const patch = {}
    const result = mergeDeep(original, patch)
    expect(result).toEqual({ a: 1, b: 2 })
  })
})
