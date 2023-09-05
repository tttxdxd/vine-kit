import { Char, every, isEmpty, some } from '../external'

/**
 * 字符串是否为空白 空格、全角空格、制表符、换行符，等不可见字符
 * @param str
 * @example
 * ```js
 * StringUtil.isBlank()         // true
 * StringUtil.isBlank('')       // true
 * StringUtil.isBlank(' \t\n')  // true
 * StringUtil.isBlank('abc')    // false
 * ```
 */
export function isBlank(str?: string): boolean {
  return isEmpty(str) || every(str, Char.isBlank)
}

/**
 * 字符串是否不为空白 空格、全角空格、制表符、换行符，等不可见字符
 * @param str
 * @example
 * ```js
 * StringUtil.notBlank()         // false
 * StringUtil.notBlank('')       // false
 * StringUtil.notBlank(' \t\n')  // false
 * StringUtil.notBlank('abc')    // true
 * ```
 */
export function notBlank(str?: string): boolean {
  return !isBlank(str)
}

/**
 * 多个字符串是否为包含空白字符串
 * @param val
 * @example
 * ```js
 * StringUtil.hasBlank([])         // true
 * StringUtil.hasBlank([''])       // true
 * StringUtil.hasBlank([' \t\n'])  // true
 * StringUtil.hasBlank(['abc'])    // false
 * ```
 */
export function hasBlank(val: string[]): boolean {
  return isEmpty(val) || some(val, isBlank)
}

export enum TrimMode {
  Start = -1,
  Both = 0,
  End = 1,
}

/**
 * 去除字符串的首尾空白
 * @param str
 * @param mode
 * @param predicate
 * @returns
 */
export function trim(str: string, mode: TrimMode = TrimMode.Both, predicate: (char: string) => boolean = Char.isBlank) {
  if (isEmpty(str))
    return str

  let start = 0
  let end = str.length - 1

  if (mode <= 0) {
    while (start <= end && predicate(str.charAt(start)))
      start++
  }
  if (mode >= 0) {
    while (end >= start && predicate(str.charAt(end)))
      end--
  }

  if (start > 0 || end < str.length - 1)
    return str.slice(start, end + 1)

  return str
}

export function trimStart(str: string) {
  return trim(str, -1)
}

export function trimEnd(str: string) {
  return trim(str, 1)
}

export function repeat(str: string, count: number) {
  let result = ''
  for (let i = 0; i < count; i++)
    result += str
  return result
}

/**
 * 替换指定字符串的指定区间内字符为固定字符
 * @param str
 * @param start
 * @param end
 * @param char
 */
export function replace(str: string, start: number, end: number, char: string) {
  if (isEmpty(str))
    return str
  if (start > end || start > str.length)
    return str
  if (start < 0)
    start = 0
  if (end > str.length)
    end = str.length

  return str.substring(0, start) + repeat(char, end - start) + str.substring(end, str.length)
}

export function hide(str: string, start: number, end: number) {
  return replace(str, start, end, Char.ASTERISK)
}
