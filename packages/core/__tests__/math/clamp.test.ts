import { describe, expect, it } from 'vitest'
import { MathUtil } from '@vine-kit/core'

describe('mathUtil.clamp', () => {
  it('should clamp value within min and max', () => {
    expect(MathUtil.clamp(5, 0, 10)).toBe(5)
  })

  it('should clamp value to min', () => {
    expect(MathUtil.clamp(-5, 0, 10)).toBe(0)
  })

  it('should clamp value to max', () => {
    expect(MathUtil.clamp(15, 0, 10)).toBe(10)
  })
})
