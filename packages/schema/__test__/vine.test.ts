import { describe, expectTypeOf, it } from 'vitest'
import type { InstanceTypeOf, VineFieldCtor } from '../src'
import { Literal, Null, ObjectType, Optional, Type, Undefined, getInstance, meta, schema } from '../src'

const getType = <T extends VineFieldCtor>(Ctor: T): InstanceTypeOf<T>['__type__'] => getInstance<T>(Ctor)[Type]

describe('@vine-kit/schema', () => {
  it('basic meta', () => {
    expectTypeOf(getType(String)).toMatchTypeOf<string>()
    expectTypeOf(getType(meta(String))).toMatchTypeOf<string>()
    expectTypeOf(getType(meta(Number))).toMatchTypeOf<number>()
    expectTypeOf(getType(meta(Boolean))).toMatchTypeOf<boolean>()
  })

  it('basic meta with attributes', () => {
    const ID = meta(String, {}, { create: { label: '' } })

    expectTypeOf(getInstance(ID)[Type]).toEqualTypeOf<string>()
    expectTypeOf(getInstance(ID).descriptors).toEqualTypeOf<NonNullable<unknown>>()
    expectTypeOf(getInstance(ID).groups).toEqualTypeOf<{ create: { label: string } }>()
  })

  it('basic schema', () => {
    const People = schema({
      id: String,
      name: String,
      age: Number,
    })

    expectTypeOf(getInstance(People)[Type]).toEqualTypeOf<{
      id: string
      name: string
      age: number
    }>()
  })

  it('basic class Schema', () => {
    class People extends ObjectType {
      id = String
      name = String
      age = Number
    }

    expectTypeOf(getInstance(People)[Type]).toEqualTypeOf<{
      id: string
      name: string
      age: number
    }>()
  })

  it('basic schema with meta', () => {
    const ID = meta(String, { description: 'ID' })
    const People = schema({
      id: ID,
      name: String,
    })

    expectTypeOf(getInstance(People)[Type]).toEqualTypeOf<{
      id: string
      name: string
    }>()
  })

  it('optional', () => {
    const OptionalNumber = Optional(Number)
    const OptionalString = Optional(String)
    const OptionalBoolean = Optional(Boolean)

    expectTypeOf(getType(OptionalNumber)).toEqualTypeOf<number | undefined>()
    expectTypeOf(getType(OptionalString)).toEqualTypeOf<string | undefined>()
    expectTypeOf(getType(OptionalBoolean)).toEqualTypeOf<boolean | undefined>()
  })

  it('literal', () => {
    expectTypeOf(getType(Null)).toEqualTypeOf<null>()
    expectTypeOf(getType(Undefined)).toEqualTypeOf<undefined>()
    expectTypeOf(getType(Literal('null'))).toEqualTypeOf<'null'>()
    expectTypeOf(getType(Literal(0))).toEqualTypeOf<0>()
    expectTypeOf(getType(Literal(true))).toEqualTypeOf<true>()
  })
})
