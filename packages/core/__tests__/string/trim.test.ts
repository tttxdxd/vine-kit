import { describe, expect, it } from 'vitest'

import { StringUtil } from '@vine-kit/core'

describe('stringUtil.trim', () => {
  it('should trim whitespaces from both ends', () => {
    const str = '  hello  '
    const result = StringUtil.trim(str)
    expect(result).toEqual('hello')
  })

  it('should not trim if no whitespaces', () => {
    const str = 'hello'
    const result = StringUtil.trim(str)
    expect(result).toEqual(str)
  })

  it('should trim from start', () => {
    const str = '  hello'
    const result = StringUtil.trim(str, StringUtil.TrimMode.Start)
    expect(result).toEqual('hello')
  })

  it('should trim from end', () => {
    const str = 'hello  '
    const result = StringUtil.trim(str, StringUtil.TrimMode.End)
    expect(result).toEqual('hello')
  })

  it('should return empty for empty string', () => {
    const str = ''
    const result = StringUtil.trim(str)
    expect(result).toEqual('')
  })

  it('should not trim if all whitespaces', () => {
    const str = '   '
    const result = StringUtil.trim(str)
    expect(result).toEqual('')
  })

  it('should handle null input', () => {
    expect(
      StringUtil.trim(null!),
    ).toEqual(null)
  })

  it('should handle undefined input', () => {
    expect(
      StringUtil.trim(undefined!),
    ).toEqual(undefined)
  })
})
