import { trim } from './string'
import { isLetterLower, isLetterUpper, isNumber } from './char'

/**
 * Converts a string to uppercase.
 *
 * @param str - The string to convert.
 * @returns The uppercase string.
 *
 * @example
 * ```js
 * toUpperCase('hello') // 'HELLO'
 * toUpperCase('World') // 'WORLD'
 * ```
 */
export function toUpperCase(str: string): string {
  return str.toUpperCase()
}

/**
 * Converts a string to lowercase.
 *
 * @param str - The string to convert.
 * @returns The lowercase string.
 *
 * @example
 * ```js
 * toLowerCase('HELLO') // 'hello'
 * toLowerCase('World') // 'world'
 * ```
 */
export function toLowerCase(str: string): string {
  return str.toLowerCase()
}

/**
 * Checks if a string is all uppercase.
 *
 * @param str - The string to check.
 * @returns True if the string is all uppercase, false otherwise.
 *
 * @example
 * ```js
 * isUpperCase('HELLO') // true
 * isUpperCase('Hello') // false
 * ```
 */
export function isUpperCase(str: string): boolean {
  return str === str.toUpperCase()
}

/**
 * Checks if a string is all lowercase.
 *
 * @param str - The string to check.
 * @returns True if the string is all lowercase, false otherwise.
 *
 * @example
 * ```js
 * isLowerCase('hello') // true
 * isLowerCase('Hello') // false
 * ```
 */
export function isLowerCase(str: string): boolean {
  return str === str.toLowerCase()
}

/**
 * Capitalizes the first letter of a string.
 *
 * @param str - The string to capitalize.
 * @returns The string with its first letter capitalized.
 *
 * @example
 * ```js
 * capitalizeFirst('hello') // 'Hello'
 * capitalizeFirst('WORLD') // 'WORLD'
 * capitalizeFirst('') // ''
 * ```
 */
export function capitalizeFirst(str: string): string {
  return str.length === 0 ? str : str[0].toUpperCase() + str.slice(1)
}

/**
 * Lowercases the first letter of a string.
 *
 * @param str - The string to lowercase.
 * @returns The string with its first letter lowercased.
 *
 * @example
 * ```js
 * lowercaseFirst('Hello') // 'hello'
 * lowercaseFirst('WORLD') // 'wORLD'
 * lowercaseFirst('') // ''
 * ```
 */
export function lowercaseFirst(str: string): string {
  return str.length === 0 ? str : str[0].toLowerCase() + str.slice(1)
}

/**
 * Converts a camelCase string to snake_case.
 *
 * @param str - The camelCase string to convert.
 * @returns The string in snake_case.
 *
 * @example
 * ```js
 * camelToSnakeCase('helloWorld') // 'hello_world'
 * camelToSnakeCase('HTTP') // 'h_t_t_p'
 * camelToSnakeCase('ABC') // 'a_b_c'
 * ```
 */
export function toSnakeCase(str: string): string {
  let result = ''
  let prevChar = ''

  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const nextChar = str[i + 1] || ''

    if (
      (isLetterUpper(char) && (isLetterLower(prevChar) || isNumber(prevChar)))
      || (isLetterUpper(char) && isLetterUpper(prevChar) && isLetterLower(nextChar))
      || (isNumber(char) && isLetterLower(prevChar))
    ) {
      result += '_'
    }

    if (char === '-' || char === '_') {
      result += '_'
    }
    else {
      result += char.toLowerCase()
    }

    prevChar = char
  }

  return result.replace(/^_/, '').replace(/_+/g, '_')
}

/**
 * Converts a string to lowerCamelCase.
 *
 * @param str - The string to convert
 * @returns The converted lowerCamelCase string
 *
 * @example
 * toLowerCamelCase('hello_world') // returns 'helloWorld'
 * toLowerCamelCase('user-id') // returns 'userId'
 * toLowerCamelCase('HelloWorld') // returns 'helloWorld'
 */
export function toLowerCamelCase(str: string): string {
  let result = ''
  let capitalizeNext = false

  str = trim(str, 0, c => ['-', '_'].includes(c))

  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    if (char === '-' || char === '_') {
      capitalizeNext = true
    }
    else if (capitalizeNext) {
      result += char.toUpperCase()
      capitalizeNext = false
    }
    else if (i === 0) {
      result += char.toLowerCase()
    }
    else {
      result += char
    }
  }

  return result
}

/**
 * Converts a string to UpperCamelCase.
 *
 * @param str - The string to convert
 * @returns The converted UpperCamelCase string
 *
 * @example
 * toUpperCamelCase('hello_world') // returns 'HelloWorld'
 * toUpperCamelCase('user-id') // returns 'UserId'
 * toUpperCamelCase('helloWorld') // returns 'HelloWorld'
 */
export function toUpperCamelCase(str: string): string {
  let result = ''
  let capitalizeNext = true

  str = trim(str, 0, c => ['-', '_'].includes(c))

  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    if (char === '-' || char === '_') {
      capitalizeNext = true
    }
    else if (capitalizeNext) {
      result += char.toUpperCase()
      capitalizeNext = false
    }
    else {
      result += char
    }
  }

  return result
}
