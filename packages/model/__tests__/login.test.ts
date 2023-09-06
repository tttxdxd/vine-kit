import { Buffer } from 'node:buffer'
import { describe, expect, it } from 'vitest'
import { DesensitizedUtil } from '@vine-kit/core'
import g from '@vine-kit/model'

// 定义账号类型
const Account = g.meta({
  type: g.string().min(6),
  default: '',
  label: '账号',
  required: true,
})

// 定义密码类型
const Password = g.meta({
  type: g.string(),
  default: '',
  label: '密码',
  required: true,
  formatter(value) {
    return DesensitizedUtil.password(value)
  },
})

// 定义登录模型
const LoginModel = g.model({
  account: Account,
  password: Password,
})

// 测试登录表单渲染
describe('login', () => {
  it('渲染登录表单', () => {
    const loginModel = new LoginModel()

    expect(loginModel.$views.account).toMatchObject({
      label: '账号',
      required: true,
    })
    expect(loginModel.$views.password).toMatchObject({
      label: '密码',
      required: true,
    })

    loginModel.password = '123456'
    expect(loginModel.$views.account.label).toBe('账号')
    expect(loginModel.$views.account.text).toBe('')
    expect(loginModel.$views.password.label).toBe('密码')
    expect(loginModel.$views.password.text).toBe('******')
  })

  it('提交登录表单', () => {
    const loginModel = new LoginModel()

    loginModel.account = 'admin'
    loginModel.password = '123456'

    expect(loginModel.toJSON()).toMatchObject({
      account: 'admin',
      password: '123456',
    })

    expect(
      loginModel
        .fromJSON({
          account: 'apple',
        }).toJSON(),
    ).toMatchObject({
      account: 'apple',
      password: '123456',
    })
  })

  it('密码提交前需加密', () => {
    const encrypt = (str: string) => Buffer.from(str).toString('base64')
    const decrypt = (str: string) => Buffer.from(str, 'base64').toString()
    const LoginModel = g.model({
      account: Account,
      password: Password.extend({
        toJSON(val) {
          return encrypt(val)
        },
      }),
    })
    const loginModel = new LoginModel()
    const xxxxxx = encrypt('123456')

    expect(
      loginModel
        .fromJSON({
          account: 'apple',
          password: '123456',
        }).toJSON(),
    ).toMatchObject({
      account: 'apple',
      password: xxxxxx,
    })

    expect(decrypt(xxxxxx)).toBe('123456')
  })

  it('表单校验', () => {
    const LoginModel = g.model({
      account: Account,
      password: Password,
    })
    const loginModel = new LoginModel()

    loginModel.account = 'adm3in'
    loginModel.password = '123456'
    expect(loginModel.validate()).toBe(true)

    loginModel.account = ''
    expect(loginModel.validate()).toBe(false)

    loginModel.account = 'admin'
    loginModel.password = ''
    expect(loginModel.validate()).toBe(false)

    loginModel.password = '123456'
  })
})