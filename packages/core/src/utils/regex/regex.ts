import { isEmpty } from '../external'

/**
 * 99.99%有效的电子邮件地址正则表达式 符合RFC 5322规范
 * @link https://emailregex.com/
 */
export const EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i

// #region any-rule
// @link https://any86.github.io/any-rule/

/**
 * 网址（URL）
 */
export const URL = /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{1,64})?\.)+[a-z]{2,6}\/?/

/**
 * ip-v4[:端口]
 */
export const IP_V4 = /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:\d|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?$/

/**
 * ip-v6[:端口]
 */
export const IP_V6 = /(^(?:(?:[0-9A-F]{1,4}:){7}[0-9A-F]{1,4}|(([0-9A-F]{1,4}:){6}:[0-9A-F]{1,4})|(([0-9A-F]{1,4}:){5}:([0-9A-F]{1,4}:)?[0-9A-F]{1,4})|(([0-9A-F]{1,4}:){4}:([0-9A-F]{1,4}:){0,2}[0-9A-F]{1,4})|(([0-9A-F]{1,4}:){3}:([0-9A-F]{1,4}:){0,3}[0-9A-F]{1,4})|(([0-9A-F]{1,4}:){2}:([0-9A-F]{1,4}:){0,4}[0-9A-F]{1,4})|(([0-9A-F]{1,4}:){6}((((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2})))\.){3}(((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))))|(([0-9A-F]{1,4}:){0,5}:((((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2})))\.){3}(((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))))|(::([0-9A-F]{1,4}:){0,5}((((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2})))\.){3}(((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))))|([0-9A-F]{1,4}::([0-9A-F]{1,4}:){0,5}[0-9A-F]{1,4})|(::([0-9A-F]{1,4}:){0,6}[0-9A-F]{1,4})|(([0-9A-F]{1,4}:){1,7}:))$)|(^\[(?:(?:[0-9A-F]{1,4}:){7}[0-9A-F]{1,4}|(([0-9A-F]{1,4}:){6}:[0-9A-F]{1,4})|(([0-9A-F]{1,4}:){5}:([0-9A-F]{1,4}:)?[0-9A-F]{1,4})|(([0-9A-F]{1,4}:){4}:([0-9A-F]{1,4}:){0,2}[0-9A-F]{1,4})|(([0-9A-F]{1,4}:){3}:([0-9A-F]{1,4}:){0,3}[0-9A-F]{1,4})|(([0-9A-F]{1,4}:){2}:([0-9A-F]{1,4}:){0,4}[0-9A-F]{1,4})|(([0-9A-F]{1,4}:){6}((((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2})))\.){3}(((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))))|(([0-9A-F]{1,4}:){0,5}:((((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2})))\.){3}(((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))))|(::([0-9A-F]{1,4}:){0,5}((((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2})))\.){3}(((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))))|([0-9A-F]{1,4}::([0-9A-F]{1,4}:){0,5}[0-9A-F]{1,4})|(::([0-9A-F]{1,4}:){0,6}[0-9A-F]{1,4})|(([0-9A-F]{1,4}:){1,7}:))\](?::(?:\d|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?$)/i

/**
 * 用户名 字母开头，允许字母数字下划线组合
 */
export const USERNAME = /^[a-z]\w+$/i

/**
 * 密码 数字和英文字母组成，并且同时含有数字和英文字母
 */
export const PASSWORD = /^(?=.*[a-z])(?=.*\d).+$/i

/**
 * 强校验密码 大写字母，小写字母，数字，特殊符号 `@#$%^&*`~()-+=` 中任意3项密码
 */
export const PASSWORD_STRONG = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[\s\S]/

/**
 * 英文姓名
 */
export const ENGLISH_NAME = /(^[a-z][a-z\s]{0,20}[a-z]$)/i

/**
 * 中文姓名
 */
export const CHINESE_NAME = /^[\u4E00-\u9FA5·]{2,16}$/

/**
 * 手机号(mobile phone)中国(宽松), 只要是13,14,15,16,17,18,19开头即可
 */
export const MOBILE = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/

/**
 * 身份证号(1代,15位数字)
 */
export const ID_CARD_V1 = /^[1-9]\d{7}(?:0\d|10|11|12)(?:0[1-9]|[12]\d|30|31)\d{3}$/

/**
 * 身份证号(2代,18位数字),最后一位是校验位,可能为数字或字符X
 */
export const ID_CARD = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[12]\d|30|31)\d{3}[\dX]$/i

// #endregion

export function test(regex: RegExp, str?: string) {
  if (isEmpty(str))
    return false
  return regex.test(str)
}
