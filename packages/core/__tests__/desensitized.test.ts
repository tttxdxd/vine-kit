import { describe, expect, it } from 'vitest'
import { DesensitizedUtil } from '@vine-kit/core'

describe('password', () => {
  it('should mask password with ', () => {
    const pw = '123456'
    const result = DesensitizedUtil.password(pw)
    expect(result).toBe('******')
  })

  it('should return empty for empty pw', () => {
    const pw = ''
    const result = DesensitizedUtil.password(pw)
    expect(result).toBe('')
  })

  it('should return same length mask', () => {
    const pw = 'hello'
    const result = DesensitizedUtil.password(pw)
    expect(result.length).toBe(pw.length)
  })

  it('should replace multi-char pw', () => {
    const pw = 'abc123'
    const result = DesensitizedUtil.password(pw)
    expect(result).toBe('******')
  })

  it('should handle non-ASCII pw', () => {
    const pw = '你好'
    const result = DesensitizedUtil.password(pw)
    expect(result).toBe('**')
  })
})
