import { ArrayUtil } from '@vine-kit/core'
import { describe, expect, it } from 'vitest'

describe('arrayUtil.range', () => {
  it('should throw an error when step is 0', () => {
    expect(() => ArrayUtil.range(0, 10, 0)).toThrow('step must not be 0')
  })

  it('should return an empty array when length is negative', () => {
    expect(ArrayUtil.range(10, 0)).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
  })

  it('should return a correct range when start and stop are provided', () => {
    expect(ArrayUtil.range(1, 5)).toEqual([1, 2, 3, 4])
  })

  it('should return a correct range when start, stop and step are provided', () => {
    expect(ArrayUtil.range(1, 10, 2)).toEqual([1, 3, 5, 7, 9])
  })

  it('should return an array of numbers with start, stop and negative step', () => {
    expect(ArrayUtil.range(10, 5, -1)).toEqual([10, 9, 8, 7, 6])
  })

  it('should return an array of numbers with start', () => {
    expect(ArrayUtil.range(10, 5)).toEqual([10, 9, 8, 7, 6])
  })

  it('should return an array of numbers with negative start', () => {
    expect(ArrayUtil.range(-5)).toEqual([0, -1, -2, -3, -4])
  })
})
