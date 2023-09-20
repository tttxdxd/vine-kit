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

/**
 * 检查字符串是否都为数字组成
 * @param str
 */
export function isNumeric(str: string): boolean {
  return !isEmpty(str) && every(str, Char.isNumber)
}

/**
 * 检查字符串是否以指定的字符串开始
 * @param str 要检查的字符串
 * @param searchString 要搜索的字符串。
 * @param position 可选参数，指定从字符串的哪个位置开始搜索，默认为 0。
 */
export function isStartsWith(str: string, searchString: string, position: number = 0) {
  str = String(str)
  if (searchString.length === 0)
    return true
  if (str.length < searchString.length)
    return false
  if (position < 0)
    position = 0

  return str.substring(position, position + searchString.length) === searchString
}

/**
 * 检查字符串是否以指定的字符串结束
 * @param str 要检查的字符串
 * @param searchString 要搜索的字符串。
 * @param endPosition 可选参数，指定从字符串的哪个位置结束搜索，默认为要检查的字符串的长度。
 */
export function isEndsWith(str: string, searchString: string, endPosition: number = str.length) {
  str = String(str)
  if (searchString.length === 0)
    return true
  if (str.length < searchString.length)
    return false
  if (endPosition > str.length)
    endPosition = str.length

  return str.substring(endPosition - searchString.length, endPosition) === searchString
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
