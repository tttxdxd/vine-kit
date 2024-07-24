import { ArrayUtil, NO } from '@vine-kit/core'
import { describe, expect, it } from 'vitest'

describe('arrayUtil.every', () => {
  it('测试空数组', () => {
    expect(ArrayUtil.every([], () => true)).toBe(false)
  })

  it('测试数组全部满足条件', () => {
    expect(ArrayUtil.every([1, 2, 3], num => num > 0)).toBe(true)
  })

  it('测试数组部分不满足条件', () => {
    expect(ArrayUtil.every([1, 2, 0], num => num > 0)).toBe(false)
  })

  it('测试函数参数为空', () => {
    expect(ArrayUtil.every([], () => true)).toBe(false)
  })

  it('测试空迭代器', () => {
    const iterable = {
      [Symbol.iterator]: () => ({
        next: () => ({ value: undefined, done: true }),
      }),
    }
    expect(ArrayUtil.every(iterable, NO)).toBe(false)
  })

  it('测试迭代器全部满足条件', () => {
    let value = 1
    const max = 10
    const iterable = {
      [Symbol.iterator]: () => ({
        next: () => ({ value: value++, done: value > max }),
      }),
    }
    expect(ArrayUtil.every(iterable, num => num > 0)).toBe(true)
  })

  it('测试迭代器部分不满足条件', () => {
    let value = 1
    const max = 10
    const iterable = {
      [Symbol.iterator]: () => ({
        next: () => ({ value: value++, done: value > max }),
      }),
    }
    expect(ArrayUtil.every(iterable, num => num > 5)).toBe(false)
  })
})
