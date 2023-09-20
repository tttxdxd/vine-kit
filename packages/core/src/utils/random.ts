import { isUndefined } from './general'

/**
 * 获取一个在 [min, max) 之间的随机浮点数
 *
 * @example
 *
 */
export function random(min: number = 0, max: number = 1): number {
  return Math.random() * (max - min) + min
}

/**
 * 获取一个随机整数 [0, MAX_SAFE_INTEGER)
 *
 * @example
 *
 * randomInt()
 * // => an integer between 0 and MAX_SAFE_INTEGER
 */
export function randomInt(): number
/**
 * 获取一个随机整数 [0, max)
 *
 * @param {number} max 最大值(不含)
 * @example
 *
 * randomInt(5)
 * // => an integer between 0 and 5
 */
export function randomInt(max: number): number
/**
 * 获取一个随机整数 [min, max)
 *
 * @param {number} min 最小值(包含)
 * @param {number} max 最大值(不含)
 * @example
 *
 * randomInt(0, 5)
 * // => an integer between 0 and 5
 */
export function randomInt(min: number, max: number): number
export function randomInt(arg1?: number, arg2?: number): number {
  let min = 0
  let max = Number.MAX_SAFE_INTEGER

  if (isUndefined(arg2)) {
    max = arg1!
  }
  else {
    min = arg1!
    max = arg2!
  }

  return Math.floor(Math.random() * (max - min)) + min
}

/**
 * 获取一个随机布尔值 true or false
 */
export function randomBoolean() {
  return randomInt(2) === 0
}
