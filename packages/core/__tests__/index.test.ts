import { describe, expect, it } from 'vitest'
import { DesensitizedUtil } from '../src'

describe('browser', () => {
  it('password', () => {
    const password = '<PASSWORD>'
    expect(DesensitizedUtil.password(password)).toEqual('**********')
  })
})
