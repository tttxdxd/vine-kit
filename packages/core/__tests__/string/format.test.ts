import { describe, expect, it, vi } from 'vitest'
import { StringUtil } from '@vine-kit/core'

describe('stringUtil.format', () => {
  it('should format with object and fallback function', () => {
    const template = '{name} is {age} years old'
    const object = { name: 'John', age: 30 }
    const fallback = vi.fn(key => `[${key}]`)

    expect(StringUtil.format(template, object, fallback)).toEqual('John is 30 years old')
    expect(StringUtil.format(template, {}, fallback)).toEqual('[name] is [age] years old')
  })

  it('should format with object and fallback value', () => {
    const template = '{name} is {age} years old'
    const object = { name: 'John', age: 30 }
    const fallback = '[fallback]'

    expect(StringUtil.format(template, object, fallback)).toEqual('John is 30 years old')
    expect(StringUtil.format(template, {}, fallback)).toBe('[fallback] is [fallback] years old')
  })

  it('should format with positional arguments', () => {
    const template = '{0} is {1} years old'

    expect(StringUtil.format(template, 'John', 30)).toEqual('John is 30 years old')
    expect(StringUtil.format(template, 'Jane', 25)).toEqual('Jane is 25 years old')
    expect(StringUtil.format(template, 'Alice')).toEqual('Alice is undefined years old')
  })
})
