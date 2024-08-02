import { Char, every, isEmpty, isFunction, isObject, some } from '../external'

/**
 * Checks if a string is blank. A string is considered blank if it is empty or consists only of whitespace characters.
 *
 * @param str - The string to be checked. This parameter is optional.
 * @returns `true` if the string is blank, otherwise `false`.
 *
 * @example
 * ```js
 * isBlank()         // true
 * isBlank('')       // true
 * isBlank(' \t\n')  // true
 * isBlank('abc')    // false
 * ```
 */
export function isBlank(str?: string): boolean {
  return isEmpty(str) || every(str, Char.isBlank)
}

/**
 * Checks if a string is not blank. A string is considered blank if it is empty or consists only of whitespace characters.
 *
 * @param str - The string to be checked.
 * @returns `true` if the string is not blank, otherwise `false`.
 *
 * @example
 * ```js
 * notBlank()         // false
 * notBlank('')       // false
 * notBlank(' \t\n')  // false
 * notBlank('abc')    // true
 * ```
 */
export function notBlank(str?: string): boolean {
  return !isBlank(str)
}

/**
 * Checks if an array of strings contains any blank strings.
 *
 * @param val - The array of strings to check.
 * @returns `true` if the array contains a blank string, otherwise `false`.
 *
 * A string is considered blank if it is empty or consists only of whitespace characters.
 *
 * @example
 * ```js
 * hasBlank([])         // true
 * hasBlank([''])       // true
 * hasBlank([' \t\n'])  // true
 * hasBlank(['abc'])    // false
 * hasBlank(['abc', '']) // true
 * ```
 */
export function hasBlank(val: string[]): boolean {
  return isEmpty(val) || some(val, isBlank)
}

/**
 * Checks if a string consists entirely of numeric characters.
 *
 * @param str - The string to be checked.
 * @returns `true` if the string is numeric, otherwise `false`.
 *
 * @example
 * ```js
 * isNumeric('12345') // true
 * isNumeric('abc123') // false
 * isNumeric('') // false
 * isNumeric(null) // false
 * ```
 */
export function isNumeric(str: string): boolean {
  return !isEmpty(str) && every(str, Char.isNumber)
}

/**
 * Checks if a string starts with a specified search string at a given position.
 *
 * @param str - The string to be searched.
 * @param searchString - The string to search for at the start of `str`.
 * @param position - Optional parameter specifying the position in `str` where the search should start. Defaults to 0.
 * @returns `true` if `str` starts with `searchString` at `position`, otherwise `false`.
 *
 * @example
 * ```js
 * isStartsWith('abcdef', 'abc') // true
 * isStartsWith('abcdef', 'bcd') // false
 * isStartsWith('abcdef', 'def', 3) // true
 * isStartsWith('abcdef', 'abc', 1) // false
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
 * Checks if a string ends with a specified search string at a given end position.
 *
 * @param str - The string to be searched.
 * @param searchString - The string to search for at the end of `str`.
 * @param endPosition - Optional parameter specifying the position in `str` where the search should end. Defaults to the length of `str`.
 * @returns `true` if `str` ends with `searchString` at `endPosition`, otherwise `false`.
 *
 * @example
 * ```js
 * isEndsWith('abcdef', 'def') // true
 * isEndsWith('abcdef', 'def', 5) // false
 * isEndsWith('abcdef', 'cde', 5) // true
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
 * Trim function to remove specific characters from the start and/or end of a string.
 *
 * @param str - The string to trim.
 * @param mode - TrimMode enum value specifying the trim mode: Start, Both, or End. Default is Both.
 * @param predicate - A function that takes a character and returns a boolean indicating whether the character should be trimmed. Default is Char.isBlank.
 * @returns The trimmed string.
 *
 * @example
 * ```js
 * // Basic usage
 * trim('   Hello, World!   ') // 'Hello, World!'
 *
 * // Trim only from the start
 * trim('   Hello, World!   ', TrimMode.Start) // 'Hello, World!   '
 *
 * // Trim only from the end
 * trim('   Hello, World!   ', TrimMode.End) // '   Hello, World!'
 *
 * // Custom predicate to trim digits
 * trim('123Hello456', TrimMode.Both, char => /\d/.test(char)) // 'Hello'
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
 * Removes whitespace characters from the beginning of a string.
 *
 * @param str - The string to trim.
 * @returns The string with leading whitespace removed.
 *
 * @example
 * ```js
 * trimStart('   Hello World') // 'Hello World'
 * ```
 */
export function trimStart(str: string, predicate?: (char: string) => boolean) {
  return trim(str, -1, predicate)
}

/**
 * Removes whitespace characters from the end of a string.
 *
 * @param str - The string to trim.
 * @returns The string with trailing whitespace removed.
 *
 * @example
 * ```js
 * trimEnd('Hello World   ') // 'Hello World'
 * ```
 */
export function trimEnd(str: string, predicate?: (char: string) => boolean) {
  return trim(str, 1, predicate)
}

/**
 * Repeats a string a specified number of times.
 *
 * @param str - The string to be repeated.
 * @param count - The number of times to repeat the string.
 * @returns The repeated string.
 *
 * @example
 * ```js
 * repeat('abc', 3) // 'abcabcabc'
 * ```
 */
export function repeat(str: string, count: number) {
  let result = ''
  for (let i = 0; i < count; i++)
    result += str
  return result
}

/**
 * Replaces a specified range of characters in a string with a repeated character.
 *
 * @param str - The original string to be modified.
 * @param start - The starting index of the range to be replaced (inclusive).
 * @param end - The ending index of the range to be replaced (exclusive).
 * @param char - The character to replace the range with.
 * @returns The modified string with the specified range replaced.
 *
 * @example
 * ```js
 * replace('Hello, World!', 0, 5, '*') // Returns '*****o, World!'
 * ```
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
 * Hides a specified range of characters in a string by replacing them with asterisks (*).
 *
 * @param str - The original string.
 * @param start - The starting index of the range to be hidden (inclusive).
 * @param end - The ending index of the range to be hidden (exclusive).
 * @returns The modified string with the specified range hidden.
 *
 * @example
 * ```js
 * hide('1234567890', 2, 6)  // Returns '12******7890'
 * ```
 */
export function hide(str: string, start: number, end: number) {
  return replace(str, start, end, Char.ASTERISK)
}

/**
 * Replaces placeholders in a template string with provided values.
 *
 * If the first argument after the template is an object, placeholders in the form `{key}` will be replaced with corresponding values from the object.
 * If a placeholder key is not found in the object, the fallback value or function will be used.
 * If the fallback is a function, it will be called with the missing key as its argument.
 *
 * If the first argument after the template is not an object, placeholders in the form `{index}` will be replaced with corresponding values from the argument list.
 *
 * @param {string} template - The template string containing placeholders.
 * @param {Record<string, any>} object - An object with values to replace the placeholders in the template.
 * @param {string | ((key: string) => string)} [fallback] - A fallback value or function to use if a placeholder key is not found in the object.
 * @returns {string} - The formatted string with placeholders replaced.
 *
 * @example
 * ```typescript
 * format('Hello, {name}!', { name: 'Alice' }); // 'Hello, Alice!'
 * format('The {0} {1} {2}', 'quick', 'brown', 'fox'); // 'The quick brown fox'
 * format('Item {0} is {1}', 1, 'apple'); // 'Item 1 is apple'
 * ```
 */
export function format(template: string, object: Record<string, any>, fallback?: string | ((key: string) => string)): string
/**
 * Replaces placeholders in a template string with provided values.
 *
 * If the first argument after the template is an object, placeholders in the form `{key}` will be replaced with corresponding values from the object.
 * If a placeholder key is not found in the object, the fallback value or function will be used.
 * If the fallback is a function, it will be called with the missing key as its argument.
 *
 * If the first argument after the template is not an object, placeholders in the form `{index}` will be replaced with corresponding values from the argument list.
 *
 * @param {string} template - The template string containing placeholders.
 * @param {...(number | string)[]} args - Values to replace the placeholders in the template.
 * @returns {string} - The formatted string with placeholders replaced.
 *
 * @example
 * ```typescript
 * format('Hello, {name}!', { name: 'Alice' }); // 'Hello, Alice!'
 * format('The {0} {1} {2}', 'quick', 'brown', 'fox'); // 'The quick brown fox'
 * format('Item {0} is {1}', 1, 'apple'); // 'Item 1 is apple'
 * ```
 */
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
