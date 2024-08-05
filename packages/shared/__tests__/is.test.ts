import { isArrayLike, isBooleanConstructor, isConstructor, isDate, isDateConstructor, isFloat, isInstanceOf, isInteger, isMap, isNull, isNumberConstructor, isPlainObject, isPromise, isSet, isStringConstructor, isUndefined, notNull } from '@vine-kit/shared'
import { describe, expect, it } from 'vitest'

describe('@vine-kit/shared is', () => {
  describe('isNull', () => {
    it('should return true for null', () => {
      expect(isNull(null)).toBe(true)
    })
    it('should return false for non-null values', () => {
      expect(isNull(undefined)).toBe(false)
      expect(isNull(0)).toBe(false)
      expect(isNull('')).toBe(false)
      expect(isNull({})).toBe(false)
    })
  })

  describe('notNull', () => {
    it('should return true for non-null values', () => {
      expect(notNull(0)).toBe(true)
      expect(notNull('')).toBe(true)
      expect(notNull({})).toBe(true)
    })
    it('should return false for null', () => {
      expect(notNull(null)).toBe(false)
    })
  })

  describe('isUndefined', () => {
    it('should return true for undefined', () => {
      expect(isUndefined(undefined)).toBe(true)
    })
    it('should return false for non-undefined values', () => {
      expect(isUndefined(null)).toBe(false)
      expect(isUndefined(0)).toBe(false)
      expect(isUndefined('')).toBe(false)
      expect(isUndefined({})).toBe(false)
    })
  })

  describe('isPromise', () => {
    it('should return true for a promise', () => {
      const promise = new Promise(() => { })
      expect(isPromise(promise)).toBe(true)
    })
    it('should return false for non-promise values', () => {
      expect(isPromise({})).toBe(false)
      expect(isPromise(null)).toBe(false)
      expect(isPromise(undefined)).toBe(false)
      expect(isPromise(123)).toBe(false)
    })
  })

  describe('isDate', () => {
    it('should return true for a date object', () => {
      const date = new Date()
      expect(isDate(date)).toBe(true)
    })
    it('should return false for non-date objects', () => {
      expect(isDate({})).toBe(false)
      expect(isDate(null)).toBe(false)
      expect(isDate(undefined)).toBe(false)
      expect(isDate('2023-01-01')).toBe(false)
    })
  })

  describe('isArrayLike', () => {
    it('should return true for array-like objects', () => {
      expect(isArrayLike([1, 2, 3])).toBe(true)
      expect(isArrayLike({ length: 0 })).toBe(true)
      expect(isArrayLike({ length: 10, 0: 'a' })).toBe(true)
      expect(isArrayLike('string')).toBe(true)
    })
    it('should return false for non-array-like objects', () => {
      expect(isArrayLike(null)).toBe(false)
      expect(isArrayLike(undefined)).toBe(false)
      expect(isArrayLike(true)).toBe(false)
      expect(isArrayLike(123)).toBe(false)
      expect(isArrayLike({})).toBe(false)
    })
  })

  describe('isConstructor', () => {
    it('should return true for constructors', () => {
      class MyClass { }
      expect(isConstructor(MyClass)).toBe(true)
    })
    it('should return false for non-constructors', () => {
      expect(isConstructor({})).toBe(false)
      expect(isConstructor(null)).toBe(false)
      expect(isConstructor(undefined)).toBe(false)
      expect(isConstructor(123)).toBe(false)
      expect(isConstructor('string')).toBe(false)
      expect(isConstructor(() => { })).toBe(false)
    })
  })

  describe('isInstanceOf', () => {
    class MyClass { }
    class SubClass extends MyClass { }

    it('should return true for strict instance checks with correct type', () => {
      const instance = new MyClass()
      expect(isInstanceOf(instance, MyClass, true)).toBe(true)
    })

    it('should return false for strict instance checks with wrong type', () => {
      class AnotherClass { }
      const instance = new MyClass()
      expect(isInstanceOf(instance, AnotherClass, true)).toBe(false)
    })

    it('should return true for loose instance checks with subclass', () => {
      const instance = new SubClass()
      expect(isInstanceOf(instance, MyClass, false)).toBe(true)
    })

    it('should return false for loose instance checks with unrelated type', () => {
      class AnotherClass { }
      const instance = new MyClass()
      expect(isInstanceOf(instance, AnotherClass, false)).toBe(false)
    })

    it('should return false for non-object values', () => {
      expect(isInstanceOf(null, MyClass, false)).toBe(false)
      expect(isInstanceOf(undefined, MyClass, false)).toBe(false)
      expect(isInstanceOf(123, MyClass, false)).toBe(false)
      expect(isInstanceOf('string', MyClass, false)).toBe(false)
    })
  })

  describe('isMap', () => {
    it('should return true for a Map instance', () => {
      const map = new Map()
      expect(isMap(map)).toBe(true)
    })
    it('should return false for non-Map values', () => {
      expect(isMap({})).toBe(false)
      expect(isMap([])).toBe(false)
      expect(isMap(null)).toBe(false)
      expect(isMap(undefined)).toBe(false)
      expect(isMap(123)).toBe(false)
      expect(isMap('string')).toBe(false)
    })
  })

  describe('isSet', () => {
    it('should return true for a Set instance', () => {
      const set = new Set()
      expect(isSet(set)).toBe(true)
    })
    it('should return false for non-Set values', () => {
      expect(isSet({})).toBe(false)
      expect(isSet([])).toBe(false)
      expect(isSet(null)).toBe(false)
      expect(isSet(undefined)).toBe(false)
      expect(isSet(123)).toBe(false)
      expect(isSet('string')).toBe(false)
      expect(isSet(() => { })).toBe(false)
    })
  })

  describe('isPlainObject', () => {
    it('should return true for plain objects', () => {
      expect(isPlainObject({})).toBe(true)
      expect(isPlainObject({ a: 1 })).toBe(true)
    })
    it('should return false for non-plain objects', () => {
      expect(isPlainObject(null)).toBe(false)
      expect(isPlainObject(undefined)).toBe(false)
      expect(isPlainObject([])).toBe(false)
      expect(isPlainObject(new Date())).toBe(false)
      expect(isPlainObject(/regex/)).toBe(false)
      expect(isPlainObject(() => { })).toBe(false)
      expect(isPlainObject(new Map())).toBe(false)
    })
    it('should return true for objects created with Object.create(null)', () => {
      const obj = Object.create(null)
      expect(isPlainObject(obj)).toBe(true)
    })
  })

  describe('isInteger', () => {
    it('should return true for integer values', () => {
      expect(isInteger(1)).toBe(true)
      expect(isInteger(-1)).toBe(true)
      expect(isInteger(Number.MAX_SAFE_INTEGER)).toBe(true)
    })
    it('should return false for non-integer values', () => {
      expect(isInteger(1.1)).toBe(false)
      expect(isInteger(Number.NaN)).toBe(false)
      expect(isInteger('1')).toBe(false)
      expect(isInteger(Infinity)).toBe(false)
    })
  })

  describe('isFloat', () => {
    it('should return true for floating-point numbers', () => {
      expect(isFloat(1.1)).toBe(true)
      expect(isFloat(-0.5)).toBe(true)
      expect(isFloat(Number.EPSILON)).toBe(true)
      expect(isFloat(Infinity)).toBe(true)
    })

    it('should return false for non-number values', () => {
      expect(isFloat(Number.NaN)).toBe(false)
      expect(isFloat('1.1')).toBe(false)
      expect(isFloat(true)).toBe(false)
    })
  })

  describe('isNumberConstructor', () => {
    it('should return true for the Number constructor', () => {
      expect(isNumberConstructor(Number)).toBe(true)
    })

    it('should return false for non-Number constructors', () => {
      expect(isNumberConstructor(String)).toBe(false)
      expect(isNumberConstructor(Boolean)).toBe(false)
      expect(isNumberConstructor(Object)).toBe(false)
      expect(isNumberConstructor(null)).toBe(false)
      expect(isNumberConstructor(undefined)).toBe(false)
      expect(isNumberConstructor(123)).toBe(false)
      expect(isNumberConstructor('Number')).toBe(false)
    })
  })

  describe('isStringConstructor', () => {
    it('should return true for the String constructor', () => {
      expect(isStringConstructor(String)).toBe(true)
    })
    it('should return false for non-String constructors', () => {
      expect(isStringConstructor(Object)).toBe(false)
      expect(isStringConstructor(null)).toBe(false)
      expect(isStringConstructor(undefined)).toBe(false)
      expect(isStringConstructor(123)).toBe(false)
      expect(isStringConstructor('string')).toBe(false)
    })
  })

  describe('isBooleanConstructor', () => {
    it('should return true for the Boolean constructor', () => {
      expect(isBooleanConstructor(Boolean)).toBe(true)
    })
    it('should return false for non-Boolean constructors', () => {
      expect(isBooleanConstructor(Object)).toBe(false)
      expect(isBooleanConstructor(null)).toBe(false)
      expect(isBooleanConstructor(undefined)).toBe(false)
      expect(isBooleanConstructor(123)).toBe(false)
      expect(isBooleanConstructor(true)).toBe(false)
    })
  })

  describe('isDateConstructor', () => {
    it('should return true for the Date constructor', () => {
      expect(isDateConstructor(Date)).toBe(true)
    })
    it('should return false for non-Date constructors', () => {
      expect(isDateConstructor(Object)).toBe(false)
      expect(isDateConstructor(null)).toBe(false)
      expect(isDateConstructor(undefined)).toBe(false)
      expect(isDateConstructor(123)).toBe(false)
      expect(isDateConstructor(new Date())).toBe(false)
    })
  })
})
