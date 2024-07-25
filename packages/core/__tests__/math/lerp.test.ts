import { describe, expect, it } from 'vitest'
import { MathUtil } from '@vine-kit/core'

describe('mathUtil.lerp', () => {
  it('should return the correct value when t is 0', () => {
    expect(MathUtil.lerp(0, 10, 0)).toEqual(0)
  })

  it('should return the correct value when t is 1', () => {
    expect(MathUtil.lerp(0, 10, 1)).toEqual(10)
  })

  it('should return the correct value when t is 0.5', () => {
    expect(MathUtil.lerp(0, 10, 0.5)).toEqual(5)
  })

  it('should return the correct value when a and b are the same', () => {
    expect(MathUtil.lerp(5, 5, 0.5)).toEqual(5)
  })

  it('should return the correct value when t is negative', () => {
    expect(MathUtil.lerp(0, 10, -0.5)).toEqual(-5)
  })

  it('should return the correct value when t is greater than 1', () => {
    expect(MathUtil.lerp(0, 10, 1.5)).toEqual(15)
  })

  it('should return the correct value when a and b are negative', () => {
    expect(MathUtil.lerp(-5, -10, 0.5)).toEqual(-7.5)
  })

  it('should return the correct value when a is greater than b', () => {
    expect(MathUtil.lerp(10, 0, 0.5)).toEqual(5)
  })
})
