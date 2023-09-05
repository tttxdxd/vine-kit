import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import g from '@vine-kit/model'

describe('meta', () => {
  // 普通 meta
  it('meta', () => {
    const Username = g.meta({
      type: z.string(),
      default: '小明',
    })

    const username = new Username()

    expect(Username).toBeInstanceOf(Function)
    expect(username.value).toBe('小明')
    expect(username.prop).toBe('')
    expect(username.label).toBe('')
    expect(username.required).toBe(false)
    expect(username.readonly).toBe(false)
    expect(username.disabled).toBe(false)
    expect(username.hidden).toBe(false)
  })

  // 定制 meta
  it('meta special', () => {
    const Username = g.meta({
      type: z.string(),
      default: '小明',
      required: true,
      readonly: true,
      disabled: true,
      hidden: true,
    })

    const username = new Username()

    expect(username.required).toBe(true)
    expect(username.readonly).toBe(true)
    expect(username.disabled).toBe(true)
    expect(username.hidden).toBe(true)
  })

  it('meta extend', () => {
    const Username = g.meta({
      type: z.string(),
      default: '2',
    })

    const SuperUsername = Username.extend({
      required: true,
    })

    const username = new SuperUsername()

    expect(username.value).toBe('2')
    expect(username.required).toBe(true)
  })

  it('meta type', () => {
    const Username = g.meta({
      type: z.string(),
      default: '2',
    })

    const username = new Username()
  })
})
