import { describe, expect, expectTypeOf, it } from 'vitest'
import { Type, getInstance, schema } from '../src'

describe('schema', () => {
  // it('basic schema', () => {
  //   const PeopleSchema = schema({
  //     id: String,
  //     name: String,
  //     age: Number,
  //   }, { description: '123' })

  //   expect(PeopleSchema.descriptors).toEqual({ description: '123' })
  //   expectTypeOf(getInstance(PeopleSchema)[Type]).toEqualTypeOf<{
  //     id: string
  //     name: string
  //     age: number
  //   }>()
  // })

  // it('get schema info', () => {
  //   const PeopleSchema = schema({
  //     id: String,
  //     name: String,
  //     age: Number,
  //   }, { description: '123' })

  //   PeopleSchema.descriptors
  // })
})