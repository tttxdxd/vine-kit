import { describe, expect, it } from 'vitest'
import { StringUtil } from '@vine-kit/core'

describe('stringUtil.blank', () => {
  it('should return true if string is blank', () => {
    expect(StringUtil.isBlank('')).toBeTruthy()
    expect(StringUtil.isBlank('  ')).toBeTruthy()
    expect(StringUtil.isBlank('  \n ')).toBeTruthy()
    expect(StringUtil.isBlank('  \n \t ')).toBeTruthy()

    expect(StringUtil.notBlank('')).toBeFalsy()
    expect(StringUtil.notBlank('  ')).toBeFalsy()
    expect(StringUtil.notBlank('  \n ')).toBeFalsy()
    expect(StringUtil.notBlank('  \n \t ')).toBeFalsy()
  })

  it('should return false if string is not blank', () => {
    expect(StringUtil.isBlank('a')).toBeFalsy()
    expect(StringUtil.isBlank(' a ')).toBeFalsy()

    expect(StringUtil.notBlank('a')).toBeTruthy()
    expect(StringUtil.notBlank(' a ')).toBeTruthy()
  })

  // hasBlank
  it('should return true if string has blank', () => {
    expect(StringUtil.hasBlank([''])).toBeTruthy()
    expect(StringUtil.hasBlank(['  '])).toBeTruthy()
    expect(StringUtil.hasBlank(['  \n '])).toBeTruthy()
    expect(StringUtil.hasBlank(['  \n \t '])).toBeTruthy()
    expect(StringUtil.hasBlank(['a'])).toBeFalsy()
  })
})
