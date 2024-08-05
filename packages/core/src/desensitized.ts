import { isEmpty } from '@vine-kit/shared'
import { Char, repeat, replace } from './string'

/**
 * 生成密码的掩码字符串
 *
 * @param password 密码字符串
 * @returns 返回由 '*' 组成的与密码长度相同的字符串
 * @example
 * ```js
 *  password('<PASSWORD>') // => '******'
 *  password('') // => ''
 * ```
 */
export function password(password: string): string {
  if (isEmpty(password))
    return Char.EMPTY

  return repeat('*', password.length)
}

/**
 * 格式化电话号码，隐藏中间四位数字
 *
 * @param phone 电话号码字符串
 * @returns 返回格式化后的电话号码字符串
 * @example
 * ```js
 * phone('13800138000') // => '138****8000'
 * ```
 */
export function phone(phone: string): string {
  return replace(phone, 3, 7, '*')
}
