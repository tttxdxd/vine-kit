import { describe, expect, it } from 'vitest'
import { StringUtil } from '@vine-kit/core'

describe('replace', () => {
  it('should replace substring correctly', () => {
    const str = 'hello world'
    const result = StringUtil.replace(str, 1, 5, '')
    expect(result).toEqual('h world')
  })

  it('should not replace if start > end', () => {
    const str = 'hello'
    const result = StringUtil.replace(str, 2, 1, '*')
    expect(result).toEqual('hello')
  })

  it('should not replace if start > length', () => {
    const str = 'hello'
    const result = StringUtil.replace(str, 10, 2, '*')
    expect(result).toEqual('hello')
  })

  it('should handle start = 0', () => {
    const str = 'hello'
    const result = StringUtil.replace(str, 0, 1, '*')
    expect(result).toEqual('*ello')
  })

  it('should handle end = length - 1', () => {
    const str = 'hello'
    const result = StringUtil.replace(str, 1, 4, '*')
    expect(result).toEqual('h***o')
  })

  it('should return origin string if empty', () => {
    const str = ''
    const result = StringUtil.replace(str, 0, 1, '*')
    expect(result).toEqual('')
  })

  it('should throw if start < 0', () => {
    const str = ''
    const result = StringUtil.replace('hello', -1, 1, '*')
    expect(result).toEqual('*ello')
  })
})
