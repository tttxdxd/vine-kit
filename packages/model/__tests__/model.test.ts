import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import g from '@vine-kit/model'

const Username = g.meta({
  type: z.string().default(''),
  label: '用户名',
})

const Age = g.meta({
  type: z.number().default(0),
  label: '年龄',
})

const Title = g.meta({
  type: z.string(),
  default: '',
  label: '用户标题',
  computed() {
    return `${this.username}${this.age}`
  },
})

describe('model', () => {
  // 普通 model
  it('model', () => {
    const UserModel = g.model({
      username: Username,
      age: Age,
      title: Title,
    })

    const user = new UserModel({
      username: '小明',
      age: 13,
    })

    expect(user.username).toBe('小明')
    expect(user.age).toBe(13)
    expect(user.title).toBe('小明13')
  })

  // 定制 model
  it('model special', () => {
    const UserModel = g.model({
      username: Username.extend({
        default: '小明',
        required: true,
        readonly: true,
        disabled: true,
        hidden: true,
      }),
    })

    const user = new UserModel()

    expect(user.username).toBe('小明')
    expect(user.$views.username.required).toBe(true)
    expect(user.$views.username.readonly).toBe(true)
    expect(user.$views.username.disabled).toBe(true)
    expect(user.$views.username.hidden).toBe(true)
  })

  it('model $store', () => {
    const UserModel = g.model({
      /** 用户名称 */
      username: Username.default('小明'),
      age: Age.default(13),
      title: Title,

      description: g.meta({
        type: z.string(),
        default: '',
        computed() {
          return `${this.username}`
        },
      }),
    })

    const user = new UserModel()

    expect(user.$store.username).toBe('小明')
    expect(user.$store.age).toBe(13)
    expect(user.$store.title).toBe('小明13')

    user.$store.username = '小红'

    expect(user.$store.username).toBe('小红')
    expect(user.username).toBe('小红')
    expect(user.$store.title).toBe('小红13')
  })

  it('多层 model 嵌套 ', () => {
    const RoleModel = g.model({
      title: g.meta({
        type: z.string(),
        label: 'title',
        default: '学生',
      }),
      weight: g.meta({
        type: z.number(),
        default: 0,
        computed() {
          return this.$parent.age * 10
        },
      }),
    })

    const UserModel = g.model({
      /** 用户名称 */
      username: Username.default('小明'),
      age: Age.default(13),
      role: RoleModel,
    })

    const user = new UserModel()

    expect(user.$store.role.title).toBe('学生')
    expect(user.$store.role.weight).toBe(130)
  })
})
