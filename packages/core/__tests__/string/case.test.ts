import { describe, expect, it } from 'vitest'
import { StringUtil } from '@vine-kit/core'

describe('stringUtil.case', () => {
  describe('toUpperCase', () => {
    it('converts string to uppercase', () => {
      expect(StringUtil.toUpperCase('hello')).toBe('HELLO')
      expect(StringUtil.toUpperCase('World')).toBe('WORLD')
      expect(StringUtil.toUpperCase('ALREADY_UPPER')).toBe('ALREADY_UPPER')
    })
  })

  describe('toLowerCase', () => {
    it('converts string to lowercase', () => {
      expect(StringUtil.toLowerCase('HELLO')).toBe('hello')
      expect(StringUtil.toLowerCase('World')).toBe('world')
      expect(StringUtil.toLowerCase('already_lower')).toBe('already_lower')
    })
  })

  describe('isUpperCase', () => {
    it('checks if string is all uppercase', () => {
      expect(StringUtil.isUpperCase('HELLO')).toBe(true)
      expect(StringUtil.isUpperCase('Hello')).toBe(false)
      expect(StringUtil.isUpperCase('hello')).toBe(false)
    })
  })

  describe('isLowerCase', () => {
    it('checks if string is all lowercase', () => {
      expect(StringUtil.isLowerCase('hello')).toBe(true)
      expect(StringUtil.isLowerCase('Hello')).toBe(false)
      expect(StringUtil.isLowerCase('HELLO')).toBe(false)
    })
  })

  describe('capitalizeFirst', () => {
    it('capitalizes the first letter of a string', () => {
      expect(StringUtil.capitalizeFirst('hello')).toBe('Hello')
      expect(StringUtil.capitalizeFirst('WORLD')).toBe('WORLD')
      expect(StringUtil.capitalizeFirst('')).toBe('')
    })
  })

  describe('lowercaseFirst', () => {
    it('lowercases the first letter of a string', () => {
      expect(StringUtil.lowercaseFirst('Hello')).toBe('hello')
      expect(StringUtil.lowercaseFirst('WORLD')).toBe('wORLD')
      expect(StringUtil.lowercaseFirst('')).toBe('')
    })
  })
  describe('toLowerCamelCase', () => {
    it('converts snake_case to lowerCamelCase', () => {
      expect(StringUtil.toLowerCamelCase('hello_world')).toBe('helloWorld')
      expect(StringUtil.toLowerCamelCase('user_id')).toBe('userId')
    })

    it('converts kebab-case to lowerCamelCase', () => {
      expect(StringUtil.toLowerCamelCase('hello-world')).toBe('helloWorld')
      expect(StringUtil.toLowerCamelCase('user-id')).toBe('userId')
    })

    it('handles strings starting with underscore or dash', () => {
      expect(StringUtil.toLowerCamelCase('_hello_world')).toBe('helloWorld')
      expect(StringUtil.toLowerCamelCase('-hello-world')).toBe('helloWorld')
    })

    it('preserves consecutive uppercase letters', () => {
      expect(StringUtil.toLowerCamelCase('convert_to_utf8')).toBe('convertToUtf8')
    })

    it('converts PascalCase to lowerCamelCase', () => {
      expect(StringUtil.toLowerCamelCase('HelloWorld')).toBe('helloWorld')
    })
  })

  describe('toUpperCamelCase', () => {
    it('converts snake_case to UpperCamelCase', () => {
      expect(StringUtil.toUpperCamelCase('hello_world')).toBe('HelloWorld')
      expect(StringUtil.toUpperCamelCase('user_id')).toBe('UserId')
    })

    it('converts kebab-case to UpperCamelCase', () => {
      expect(StringUtil.toUpperCamelCase('hello-world')).toBe('HelloWorld')
      expect(StringUtil.toUpperCamelCase('user-id')).toBe('UserId')
    })

    it('handles strings starting with underscore or dash', () => {
      expect(StringUtil.toUpperCamelCase('_hello_world')).toBe('HelloWorld')
      expect(StringUtil.toUpperCamelCase('-hello-world')).toBe('HelloWorld')
    })

    it('preserves consecutive uppercase letters', () => {
      expect(StringUtil.toUpperCamelCase('convert_to_utf8')).toBe('ConvertToUtf8')
    })

    it('converts lowerCamelCase to UpperCamelCase', () => {
      expect(StringUtil.toUpperCamelCase('helloWorld')).toBe('HelloWorld')
    })
  })
})
