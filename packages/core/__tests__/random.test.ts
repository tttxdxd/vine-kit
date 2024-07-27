import { describe, expect, it } from 'vitest'
import { RandomUtil, range } from '@vine-kit/core'

describe('randomUtil', () => {
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
