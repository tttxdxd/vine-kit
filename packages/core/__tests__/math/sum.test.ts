import { describe, expect, it } from 'vitest'
import { MathUtil } from '@vine-kit/core'

describe('mathUtil.sum', () => {
  it('should return 0 when given an empty array', () => {
    expect(MathUtil.sum([])).toBe(0)
  })

  it('should return the sum of a single number', () => {
    expect(MathUtil.sum([5])).toBe(5)
  })

  it('should return the sum of multiple numbers', () => {
    expect(MathUtil.sum([1, 2, 3])).toBe(6)
  })

  it('should handle negative numbers', () => {
    expect(MathUtil.sum([-1, -2, -3])).toBe(-6)
  })

  it('should handle large numbers', () => {
    expect(MathUtil.sum([1000000, 2000000])).toBe(3000000)
  })

  it('should return the sum of rest parameters', () => {
    expect(MathUtil.sum(1, 2, 3, 4, 5)).toBe(15)
    expect(MathUtil.sum(10, -5, 20, -10)).toBe(15)
  })
})
