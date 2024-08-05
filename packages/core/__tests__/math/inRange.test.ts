import { describe, expect, it } from 'vitest'
import { MathUtil } from '@vine-kit/core'

describe('mathUtil.inRange', () => {
  it('should return true when value is within the range', () => {
    expect(MathUtil.inRange(5, 1, 10)).toBe(true)
  })

  it('should return false when value is less than the minimum', () => {
    expect(MathUtil.inRange(0, 1, 10)).toBe(false)
  })

  it('should return false when value is greater than the maximum', () => {
    expect(MathUtil.inRange(11, 1, 10)).toBe(false)
  })

  it('should handle equal to minimum correctly', () => {
    expect(MathUtil.inRange(1, 1, 10)).toBe(true)
  })

  it('should handle equal to maximum correctly', () => {
    expect(MathUtil.inRange(10, 1, 10)).toBe(true)
  })

  it('should handle negative numbers correctly', () => {
    expect(MathUtil.inRange(-5, -10, 0)).toBe(true)
  })

  it('should handle mixed positive and negative numbers correctly', () => {
    expect(MathUtil.inRange(0, -5, 5)).toBe(true)
  })

  it('should handle edge case with same min and max', () => {
    expect(MathUtil.inRange(5, 5, 5)).toBe(true)
    expect(MathUtil.inRange(4, 5, 5)).toBe(false)
  })
})
