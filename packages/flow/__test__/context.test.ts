import { describe, expect, expectTypeOf, it } from 'vitest'
import { defineContext } from '../src'

describe('@vine-kit/schema', () => {
  it('basic context', () => {
    const BasicContext = defineContext({ name: '' })
    const ctx = new BasicContext().set('name', '123')

    expect(ctx.get()).toMatchObject({ name: '123' })
    expectTypeOf(ctx.get()).toEqualTypeOf<{ name: string }>()
  })
})
