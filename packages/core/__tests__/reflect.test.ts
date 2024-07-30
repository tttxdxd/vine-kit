import { beforeEach, describe, expect, it } from 'vitest'

import { ReflectUtil } from '@vine-kit/core'

describe('reflectUtil', () => {
  const key = 'key'
  const value = 'value'

  beforeEach(() => {
    ReflectUtil.clear()
  })

  it('should define metadata on class', () => {
    class Test { }

    ReflectUtil.defineMetadata(key, value, Test.prototype)
    expect(ReflectUtil.hasOwnMetadata(key, Test.prototype)).toBe(true)
    expect(ReflectUtil.getOwnMetadata(key, Test.prototype)).toBe(value)
    expect(ReflectUtil.getOwnMetadataKeys(Test.prototype)).toEqual([key])
    expect(ReflectUtil.listOwnMeta(key)).toMatchObject([{ target: Test.prototype, key, value }])

    expect(ReflectUtil.hasMetadata(key, Test.prototype)).toBe(true)
    expect(ReflectUtil.getMetadata(key, Test.prototype)).toBe(value)
    expect(ReflectUtil.getMetadataKeys(Test.prototype)).toEqual([key])
    expect(ReflectUtil.listMeta(key)).toMatchObject([{ target: Test.prototype, key, value }])
  })

  it('should define metadata on class property', () => {
    class Test {
      declare prop: string
    }
    ReflectUtil.defineMetadata(key, value, Test.prototype, 'prop')
    expect(ReflectUtil.hasOwnMetadata(key, Test.prototype, 'prop')).toBe(true)
    expect(ReflectUtil.getOwnMetadata(key, Test.prototype, 'prop')).toBe(value)
    expect(ReflectUtil.getOwnMetadataKeys(Test.prototype, 'prop')).toEqual([key])
    expect(ReflectUtil.listOwnMeta(key, Test.prototype)).toMatchObject([{ target: Test.prototype, propertyKey: 'prop', key, value }])

    expect(ReflectUtil.hasMetadata(key, Test.prototype, 'prop')).toBe(true)
    expect(ReflectUtil.getMetadata(key, Test.prototype, 'prop')).toBe(value)
    expect(ReflectUtil.getMetadataKeys(Test.prototype, 'prop')).toEqual([key])
    expect(ReflectUtil.listMeta(key, Test.prototype)).toMatchObject([{ target: Test.prototype, propertyKey: 'prop', key, value }])
  })

  it('should define metadata on class method', () => {
    class Test {
      method() { }
    }
    ReflectUtil.defineMetadata(key, value, Test.prototype, 'method')
    expect(ReflectUtil.hasOwnMetadata(key, Test.prototype, 'method')).toBe(true)
    expect(ReflectUtil.getOwnMetadata(key, Test.prototype, 'method')).toBe(value)
    expect(ReflectUtil.getOwnMetadataKeys(Test.prototype, 'method')).toEqual([key])
    expect(ReflectUtil.listOwnMeta(key, Test.prototype)).toMatchObject([{ target: Test.prototype, propertyKey: 'method', key, value }])

    expect(ReflectUtil.hasMetadata(key, Test.prototype, 'method')).toBe(true)
    expect(ReflectUtil.getMetadata(key, Test.prototype, 'method')).toBe(value)
    expect(ReflectUtil.getMetadataKeys(Test.prototype, 'method')).toEqual([key])
    expect(ReflectUtil.listOwnMeta(key, Test.prototype)).toMatchObject([{ target: Test.prototype, propertyKey: 'method', key, value }])
  })

  it('should define metadata on class static method', () => {
    class Test {
      static method() { }
    }
    ReflectUtil.defineMetadata(key, value, Test, 'method')
    expect(ReflectUtil.hasOwnMetadata(key, Test, 'method')).toBe(true)
    expect(ReflectUtil.getOwnMetadata(key, Test, 'method')).toBe(value)
    expect(ReflectUtil.getOwnMetadataKeys(Test, 'method')).toEqual([key])
    expect(ReflectUtil.listOwnMeta(key, Test)).toMatchObject([{ target: Test, propertyKey: 'method', key, value }])

    expect(ReflectUtil.hasMetadata(key, Test, 'method')).toBe(true)
    expect(ReflectUtil.getMetadata(key, Test, 'method')).toBe(value)
    expect(ReflectUtil.getMetadataKeys(Test, 'method')).toEqual([key])
    expect(ReflectUtil.listMeta(key, Test)).toMatchObject([{ target: Test, propertyKey: 'method', key, value }])
  })

  it('should define metadata on super class', () => {
    class Test { }
    class Test2 extends Test { }

    ReflectUtil.defineMetadata(key, value, Test.prototype)
    expect(ReflectUtil.hasOwnMetadata(key, Test2.prototype)).toBe(false)
    expect(ReflectUtil.getOwnMetadata(key, Test2.prototype)).toBe(undefined)
    expect(ReflectUtil.getOwnMetadataKeys(Test2.prototype)).toEqual([])
    expect(ReflectUtil.listMeta(key)).toMatchObject([{ target: Test.prototype, key, value }])

    expect(ReflectUtil.hasMetadata(key, Test2.prototype)).toBe(true)
    expect(ReflectUtil.getMetadata(key, Test2.prototype)).toBe(value)
    expect(ReflectUtil.getMetadataKeys(Test2.prototype)).toEqual([key])
    expect(ReflectUtil.listMeta(key)).toMatchObject([{ target: Test.prototype, key, value }])
  })
})
