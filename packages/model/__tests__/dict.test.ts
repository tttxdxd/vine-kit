import { describe, expect, it } from 'vitest'

import * as g from '@vine-kit/model'

describe('dict', () => {
  // 普通 meta
  it('普通 dict', () => {
    const STATUS_CODE = [{
      value: 0,
      label: '正常',
    }, {
      value: 1,
      label: '上架',
    }]

    const Status = g.dict({
      type: Number,
      label: '状态',
      options: STATUS_CODE,
    })

    const status = new Status()

    expect(status.value).toBe(0)
    expect(status.text).toBe('正常')
    expect(status.label).toBe('状态')
    expect(status.options).toEqual(STATUS_CODE)
    expect(Status.$options).toEqual(STATUS_CODE)
  })
})
