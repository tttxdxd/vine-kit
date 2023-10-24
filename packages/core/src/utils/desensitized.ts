import { isEmpty } from './general'
import { Char, repeat } from './string'

/**
 * Encrypts a password for display purposes.
 *
 * @category DesensitizedUtil
 * @example
 *
 * password("password"); // "********"
 * password("pass");     // "****"
 */
export function password(password: string): string {
  if (isEmpty(password))
    return Char.EMPTY

  return repeat('*', password.length)
}
