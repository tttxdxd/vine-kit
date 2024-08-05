import { describe, expect, it } from 'vitest'

import { NO, NOOP, hasOwn, toTypeString } from '@vine-kit/shared'

describe('@vine-kit/shared base', () => {
  describe('hasOwn', () => {
    it('should return true if the object has the specified property', () => {
      const obj = { key: 'value' }
      expect(hasOwn(obj, 'key')).toBe(true)
    })

    it('should return false if the object does not have the specified property', () => {
      const obj = { key: 'value' }
      expect(hasOwn(obj, 'nonExistentKey')).toBe(false)
    })

    it('should work with symbols as keys', () => {
      const symbolKey = Symbol('unique')
      const obj = { [symbolKey]: 'value' }
      expect(hasOwn(obj, symbolKey)).toBe(true)
    })

    it('should return false for inherited properties', () => {
      const obj = Object.create({ inheritedKey: 'inheritedValue' })
      expect(hasOwn(obj, 'inheritedKey')).toBe(false)
    })
  })

  describe('toTypeString', () => {
    it('should return the correct string representation for an object', () => {
      expect(toTypeString({})).toBe('[object Object]')
    })

    it('should return the correct string representation for an array', () => {
      expect(toTypeString([])).toBe('[object Array]')
    })

    it('should return the correct string representation for a string', () => {
      expect(toTypeString('hello')).toBe('[object String]')
    })

    it('should return the correct string representation for a number', () => {
      expect(toTypeString(42)).toBe('[object Number]')
    })

    it('should return the correct string representation for null', () => {
      expect(toTypeString(null)).toBe('[object Null]')
    })

    it('should return the correct string representation for undefined', () => {
      expect(toTypeString(undefined)).toBe('[object Undefined]')
    })
  })

  describe('nOOP', () => {
    it('should return undefined', () => {
      expect(NOOP()).toBeUndefined()
    })
  })

  describe('nO', () => {
    it('should return false', () => {
      expect(NO()).toBe(false)
    })
  })
})
