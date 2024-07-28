import { describe, expect, it } from 'vitest'
import { RandomUtil, range } from '@vine-kit/core'

describe('randomUtil', () => {
  it('should return a number between 0 and Number.MAX_SAFE_INTEGER when no arguments are provided', () => {
    const result = RandomUtil.randomInt()
    expect(typeof result).toBe('number')
    expect(result >= 0 && result <= Number.MAX_SAFE_INTEGER).toBe(true)
  })

  it('should return a number between 0 and the specified max when one argument is provided', () => {
    const max = 100
    const result = RandomUtil.randomInt(max)
    expect(typeof result).toBe('number')
    expect(result >= 0 && result < max).toBe(true)
  })

  it('should return a number between the specified min and max when two arguments are provided', () => {
    const min = 10
    const max = 20
    const result = RandomUtil.randomInt(min, max)
    expect(typeof result).toBe('number')
    expect(result >= min && result <= max).toBe(true)
  })

  it('should handle edge case where min equals max by returning min', () => {
    const min = 5
    const max = 5
    const result = RandomUtil.randomInt(min, max)
    expect(typeof result).toBe('number')
    expect(result).toBe(min)
  })

  it('randomInt', () => {
    const COUNT = 100

    for (let i = 0; i < COUNT; i++) {
      expect(RandomUtil.randomInt(5)).toBeGreaterThanOrEqual(0)
      expect(RandomUtil.randomInt(5)).toBeLessThan(5)
      expect(RandomUtil.randomInt(5, 10)).toBeGreaterThanOrEqual(5)
      expect(RandomUtil.randomInt(5, 10)).toBeLessThanOrEqual(10)
      expect(RandomUtil.randomInt(5, 5)).toBe(5)
    }
  })

  it('randomBoolean', () => {
    expect(typeof RandomUtil.randomBoolean()).toBe('boolean')
  })
})
