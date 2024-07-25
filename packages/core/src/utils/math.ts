/**
 * 限幅函数，将值限制在指定的最小值和最大值之间
 * @param value - 要限制的值
 * @param min - 允许的最小值
 * @param max - 允许的最大值
 * @returns value 限制在 [min, max] 范围内的值
 */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/**
 * 在两个数字 a 和 b 之间进行线性插值的函数
 *
 * @param a - 起始数字
 * @param b - 结束数字
 * @param t - 插值比例（0 <= t <= 1）。t = 0 时返回 a，t = 1 时返回 b
 * @returns  - a 和 b 之间的插值结果
 */
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/**
 * 将一个数值从一个范围重新映射到另一个范围
 *
 * @param value - 要重新映射的值
 * @param oldMin - 原来范围的最小值
 * @param oldMax - 原来范围的最大值
 * @param newMin - 目标范围的最小值
 * @param newMax - 目标范围的最大值
 * @returns value 在目标范围 [newMin, newMax] 内重新映射后的值
 */
export function remap(value: number, oldMin: number, oldMax: number, newMin: number, newMax: number) {
  return lerp(newMin, newMax, (value - oldMin) / (oldMax - oldMin))
}

/**
 * 计算一个数字数组的总和
 *
 * @param numbers - 要相加的数字数组。数组可以是任何长度，并且可以包含任意数量的数字。
 * @returns 数组中所有数字的总和。
 */
export function sum(...numbers: number[]) {
  return numbers.reduce((a, b) => a + b, 0)
}
