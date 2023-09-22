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
/** 垂直制表符 */
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
 * 是否为 ASCII 字符
 * @param char
 */
export function isASCII(char: string): boolean {
  return char.charCodeAt(0) <= 0x7F // 0x7F = 127
}

export function isLetterUpper(char: string): boolean {
  return char >= 'A' && char <= 'Z'
}

export function isLetterLower(char: string): boolean {
  return char >= 'a' && char <= 'z'
}

export function isLetter(char: string): boolean {
  return isLetterUpper(char) || isLetterLower(char)
}

export function isNumber(char: string): boolean {
  return char >= '0' && char <= '9'
}

/**
 * 是否空白符<br>
 * 空白符包括空格、制表符、全角空格和不间断空格<br>
 *
 * @param char 字符
 * @return 是否空白符
 */
export function isBlank(char: string): boolean {
  return '\f\n\r\t\v\u0020\u00A0\u1680\u2000\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF'.includes(char)
}
