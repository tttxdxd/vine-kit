import { isEmpty } from './general'
import { Char, repeat } from './string'

/**
 * 密码加密显示
 * @param password
 */
export function password(password: string) {
  if (isEmpty(password))
    return Char.EMPTY

  return repeat('*', password.length)
}
