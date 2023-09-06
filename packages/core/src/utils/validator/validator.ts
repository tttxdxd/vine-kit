import { RegexUtil } from '../external'

export function isEmail(val: string): boolean {
  return RegexUtil.test(RegexUtil.EMAIL, val)
}

export function isUsername(val: string): boolean {
  return RegexUtil.test(RegexUtil.USERNAME, val)
}

export function isPassword(val: string, strong?: boolean): boolean {
  return RegexUtil.test(strong ? RegexUtil.PASSWORD_STRONG : RegexUtil.PASSWORD, val)
}

export function isMobile(val: string): boolean {
  return RegexUtil.test(RegexUtil.MOBILE, val)
}

export function isIP(val: string): boolean {
  return isIP_V4(val) || isIP_V6(val)
}

export function isIP_V4(val: string): boolean {
  return RegexUtil.test(RegexUtil.IP_V4, val)
}

export function isIP_V6(val: string): boolean {
  return RegexUtil.test(RegexUtil.IP_V6, val)
}

export function isEnglishName(val: string): boolean {
  return RegexUtil.test(RegexUtil.ENGLISH_NAME, val)
}

export function isChineseName(val: string): boolean {
  return RegexUtil.test(RegexUtil.CHINESE_NAME, val)
}

export function isID_CARD(val: string): boolean {
  return RegexUtil.test(RegexUtil.ID_CARD, val)
}
