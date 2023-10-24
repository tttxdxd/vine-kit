/**
 * Returns a pseudorandom number between the given range.
 *
 * @category RandomUtil
 * @example
 *
 * RandomUtil.random()
 */
export function random(min: number = 0, max: number = 1): number {
  return Math.random() * (max - min) + min
}

/**
 * 获取一个随机整数 [0, MAX_SAFE_INTEGER)
 *
 * @category RandomUtil
 * @example
 *
 * RandomUtil.randomInt()
 * // => an integer between 0 and MAX_SAFE_INTEGER
 */
export function randomInt(): number
/**
 * 获取一个随机整数 [0, max)
 *
 * @category RandomUtil
 * @param {number} max 最大值(不含)
 * @example
 *
 * RandomUtil.randomInt(5)
 * // => an integer between 0 and 5
 */
export function randomInt(max: number): number
/**
 * 获取一个随机整数 [min, max)
 *
 * @category RandomUtil
 * @param {number} min 最小值(包含)
 * @param {number} max 最大值(不含)
 * @example
 *
 * RandomUtil.randomInt(0, 5)
 * // => an integer between 0 and 5
 */
export function randomInt(min: number, max: number): number
export function randomInt(...args: number[]): number {
  let min = 0
  let max = Number.MAX_SAFE_INTEGER

  if (args.length === 1)
    [max] = args
  else if (args.length === 2)
    [min, max] = args

  return Math.floor(Math.random() * (max - min)) + min
}

/**
 * Generates a random boolean value.
 *
 * @category RandomUtil
 * @example
 *
 * RandomUtil.randomBoolean(); // true or false
 */
export function randomBoolean() {
  return randomInt(2) === 0
}
