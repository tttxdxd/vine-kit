import { describe, expect, it } from 'vitest'

import * as g from '@vine-kit/model'
import { Validator } from '@vine-kit/model'

describe('meta', () => {
  // 普通 meta
  it('普通 meta', () => {
    const Username = g.meta({
      type: String,
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
  it('定制 meta', () => {
    const Username = g.meta({
      type: String,
      prop: 'name',
      label: '姓名',
      default: '小明',
      required: true,
      readonly: true,
      disabled: true,
      hidden: true,
    })

    const username = new Username()

    expect(Username).toBeInstanceOf(Function)
    expect(username.value).toBe('小明')
    expect(username.prop).toBe('name')
    expect(username.label).toBe('姓名')
    expect(username.required).toBe(true)
    expect(username.readonly).toBe(true)
    expect(username.disabled).toBe(true)
    expect(username.hidden).toBe(true)
  })

  it('meta extend', () => {
    const Username = g.meta({
      type: String,
      default: '2',
    })

    const SuperUsername = Username.extend({
      required: true,
    })

    const username = new SuperUsername()

    expect(username.value).toBe('2')
    expect(username.required).toBe(true)
  })

  it('meta alias', () => {
    const Username = g.string('小明')

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

  it('meta validator', () => {
    const Username = g.string('小明').extend({
      validators: [g.min(6)],
    })

    const username = new Username()
    expect(username.value).toBe('小明')
    expect(username.validators[1]).toEqual(g.min(6))

    expect(username.error).toBe(undefined)
    expect(username.validate('')).toBe(false)
    expect(username.error).toBe('String must contain at least 6 character(s)')

    expect(username.validate('123456')).toBe(true)
    expect(username.error).toBe(undefined)
  })

  it('meta scenes', () => {
    const Username = g.meta({
      type: String,
      prop: 'username',
      required: true,
    }, {
      Login: {
        validators: [g.min(6)],
      },
      Register: {
        validators: [Validator.custom(val => ['123456'].includes(val), '不存在该账号')],
      },
    })

    const username = new Username.$scenes.Login()

    expect(username.required).toBe(true)
    expect(username.readonly).toBe(false)
    expect(username.disabled).toBe(false)
    expect(username.hidden).toBe(false)

    expect(username.validate('12345')).toBe(false)
  })
})
