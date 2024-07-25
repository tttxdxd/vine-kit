import { describe, expect, it } from 'vitest'
import { MathUtil } from '@vine-kit/core'

describe('mathUtil.remap', () => {
  it('should MathUtil.remap value within range', () => {
    const result = MathUtil.remap(50, 0, 100, 0, 200)
    expect(result).toEqual(100)
  })

  it('should handle min and max values', () => {
    const result = MathUtil.remap(0, 0, 100, 0, 200)
    expect(result).toEqual(0)

    const result2 = MathUtil.remap(100, 0, 100, 0, 200)
    expect(result2).toEqual(200)
  })

  it('should handle negative values', () => {
    const result = MathUtil.remap(-50, -100, 0, 0, 100)
    expect(result).toEqual(50)
  })
})
