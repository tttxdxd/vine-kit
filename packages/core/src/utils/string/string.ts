import { Char, every, isEmpty, isFunction, isObject, isString, some } from '../external'

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
 * @example
 * ```js
 * StringUtil.isNumeric()         // false
 * StringUtil.isNumeric('')       // false
 * StringUtil.isNumeric('123')    // true
 * StringUtil.isNumeric('abc')    // false
 * ```
 */
export function isNumeric(str: string): boolean {
  return !isEmpty(str) && every(str, Char.isNumber)
}

/**
 * 检查字符串是否以指定的字符串开始
 * @param str 要检查的字符串
 * @param searchString 要搜索的字符串。
 * @param position 可选参数，指定从字符串的哪个位置开始搜索，默认为 0。
 * @example
 * ```js
 * StringUtil.isStartsWith('abc', 'a')         // true
 * StringUtil.isStartsWith('abc', 'b')         // false
 * StringUtil.isStartsWith('abc', 'a', 1)     // false
 * ```
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
 * @example
 * ```js
 * StringUtil.isEndsWith('abc', 'c')         // true
 * StringUtil.isEndsWith('abc', 'b')         // false
 * StringUtil.isEndsWith('abc', 'c', 2)     // false
 * ```
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
 * @example
 * ```js
 * 1. StringUtil.trim('   abc   ')         // 'abc'
 * 2. StringUtil.trim('   abc   ', TrimMode.Start)     // 'abc   '
 * 3. StringUtil.trim('   abc   ', TrimMode.End)      // '   abc'
 * 4. StringUtil.trim('   abc   ', TrimMode.Both)      // 'abc'
 * ```
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

/**
 * 去除字符串开头的空白字符
 *
 * @param str 要处理的字符串
 * @returns 返回处理后的字符串
 */
export function trimStart(str: string) {
  return trim(str, -1)
}

/**
 * 去除字符串末尾的空白字符
 *
 * @param str 待处理的字符串
 * @returns 返回处理后的字符串
 */
export function trimEnd(str: string) {
  return trim(str, 1)
}

/**
 * 重复字符串指定次数
 *
 * @param str 要重复的字符串
 * @param count 重复次数
 * @returns 重复后的字符串
 */
export function repeat(str: string, count: number) {
  let result = ''
  for (let i = 0; i < count; i++)
    result += str
  return result
}

/**
 * 隐藏字符串中指定范围内的字符
 *
 * @param str 要处理的字符串
 * @param start 开始隐藏的起始位置（包含该位置），默认为0
 * @param end 结束隐藏的结束位置（不包含该位置），如果大于字符串长度，则自动调整为字符串长度
 * @param char 用于替换隐藏字符的字符
 * @returns 返回处理后的字符串
 */
export function replace(str: string, start: number, end: number, char: string) {
  if (isEmpty(str))
    return str
  if (start < 0)
    start = 0
  if (end < 0)
    end = str.length + end + 1
  if (end > str.length)
    end = str.length
  if (start > end || start > str.length)
    return str

  return str.substring(0, start) + repeat(char, end - start) + str.substring(end, str.length)
}

/**
 * 默认使用'*'隐藏字符串中指定范围内的字符
 *
 * @param str 要处理的字符串
 * @param start 隐藏范围的起始索引（包含）
 * @param end 隐藏范围的结束索引（不包含）
 * @returns 隐藏指定范围字符后的新字符串
 * @example
 * 1. StringUtil.hide('1234567890', 2, 6)    // '12******7890'
 * 2. StringUtil.hide('1234567890', -2, 6)   // '********7890'
 * ```
 */
export function hide(str: string, start: number, end: number) {
  return replace(str, start, end, Char.ASTERISK)
}

/**
 * @param template - 模板字符串，其中包含占位符 {property} 或 {number}
 * @param...args - 传递给模板的参数，可以是对象或值
 * @category String
 * @returns 替换占位符后的字符串
 * @example
 * ```js
 * StringUtil.format('Hello, {0}!', 'world'); // 返回 'Hello, world!'
 * StringUtil.format('Hello, {name}!', { name: 'John' }); // 返回 'Hello, John!'
 * ```
 */
export function format(template: string, object: Record<string, any>, fallback?: string | ((key: string) => string)): string
export function format(template: string, ...args: (number | string)[]): string
export function format(template: string, ...args: any[]) {
  const [object, fallback] = args

  if (isObject(object)) {
    return template.replace(/\{(\w+)\}/g, (_, key) => {
      return object[key] ?? (isFunction(fallback) ? fallback(key) : fallback) ?? key
    })
  }
  return template.replace(/\{(\d+)\}/g, (_, index) => {
    return args[index]
  })
}
