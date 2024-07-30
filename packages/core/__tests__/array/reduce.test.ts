import { describe, expect, it } from 'vitest'

import { ArrayUtil } from '@vine-kit/core'

describe('arrayUtil.reduce', () => {
  it('should reduce an array', () => {
    const numbers = [1, 2, 3, 4]
    const sum = ArrayUtil.reduce(numbers, (accumulator, currentValue) => accumulator + currentValue, 0)
    expect(sum).toBe(10)
  })

  it('should reduce an arraylike object', () => {
    const arrayLike = { length: 4, 0: 1, 1: 2, 2: 3, 3: 4 }
    const sum = ArrayUtil.reduce(arrayLike, (accumulator, currentValue) => accumulator + currentValue, 0)
    expect(sum).toBe(10)
  })

  it('should reduce a Set', () => {
    const set = new Set([1, 2, 3, 4])
    const sum = ArrayUtil.reduce(set, (accumulator, currentValue) => accumulator + currentValue, 0)
    expect(sum).toBe(10)
  })

  it('should reduce a Map', () => {
    const map = new Map([[1, 1], [2, 2], [3, 3], [4, 4]])
    const sum = ArrayUtil.reduce(map, (accumulator, currentValue) => accumulator + currentValue[1], 0)
    expect(sum).toBe(10)
  })

  it('should reduce a string', () => {
    const string = '1234'
    const concatenated = ArrayUtil.reduce(string, (accumulator, currentValue) => accumulator + currentValue, '')
    expect(concatenated).toBe('1234')
  })

  it('should throw an error when no initial value is provided for an empty iterable', () => {
    const emptyArray: Iterable<any> | ArrayLike<any> = []
    expect(ArrayUtil.reduce(emptyArray, (a, b) => a + b)).toBe(undefined)
  })

  it('should use the initial value for an empty iterable', () => {
    const emptyArray: Iterable<any> | ArrayLike<any> = []
    const initialValue = 100
    const result = ArrayUtil.reduce(emptyArray, (a, b) => a + b, initialValue)
    expect(result).toBe(initialValue)
  })
})
