/**
 * 字符相关工具函数
 */

/** 空 */
export const EMPTY = ''
/** 空格符 '\u0020' */
export const SPACE = ' '
/** 制表符 */
export const TAB = '\t'
/** 回车符 */
export const CR = '\r'
/** 换行符 */
export const LF = '\n'
export const CRLF = '\r\n'
/** 换页符 */
export const FF = '\f'
/** Vertical Tab 垂直制表符 */
export const VT = '\v'
export const DOT = '.'
export const SLASH = '/'
export const BACKSLASH = '\\'
export const COLON = ':'
export const SEMICOLON = ';'
export const COMMA = ','
export const SINGLE_QUOTE = '\''
export const DOUBLE_QUOTE = '"'
export const EQUAL = '='
export const AT = '@'
export const DOLLAR = '$'
export const POUND = '#'
export const PERCENT = '%'
export const PIPE = '|'
export const ASTERISK = '*'
export const PLUS = '+'
export const MINUS = '-'
export const DASH = '-'
export const UNDERSCORE = '_'
export const HASH = '#'
export const AMPERSAND = '&'
export const TILDE = '~'
export const QUESTION = '?'
export const EXCLAMATION = '!'

/**
 * Checks if a character is an ASCII character.
 *
 * @param char The character to check.
 * @returns `true` if the character is ASCII, otherwise `false`.
 */
export function isASCII(char: string): boolean {
  return char.charCodeAt(0) <= 0x7F // 0x7F = 127
}

/**
 * Checks if a character is an uppercase letter.
 *
 * @param char The character to check.
 * @returns `true` if the character is an uppercase letter, otherwise `false`.
 */
export function isLetterUpper(char: string): boolean {
  return char >= 'A' && char <= 'Z'
}

/**
 * Checks if a character is a lowercase letter.
 *
 * @param char The character to check.
 * @returns `true` if the character is a lowercase letter, otherwise `false`.
 */
export function isLetterLower(char: string): boolean {
  return char >= 'a' && char <= 'z'
}

/**
 * Checks if a character is a letter (either uppercase or lowercase).
 *
 * @param char The character to check.
 * @returns `true` if the character is a letter, otherwise `false`.
 */
export function isLetter(char: string): boolean {
  return isLetterUpper(char) || isLetterLower(char)
}

/**
 * Checks if a character is a digit (0-9).
 *
 * @param char The character to check.
 * @returns `true` if the character is a digit, otherwise `false`.
 */
export function isNumber(char: string): boolean {
  return char >= '0' && char <= '9'
}

/**
 * Checks if a character is a whitespace character.
 * Whitespace characters include space, tab, full-width space, and non-breaking space.
 *
 * @param char The character to check.
 * @returns `true` if the character is a whitespace character, otherwise `false`.
 */
export function isBlank(char: string): boolean {
  return '\f\n\r\t\v\u0020\u00A0\u1680\u2000\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF'.includes(char)
}
