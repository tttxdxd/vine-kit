const hasOwnProperty = Object.prototype.hasOwnProperty
/**
 * Determines whether an object has a property with the specified name.
 *
 * @param val
 * @param key — A property name.
 */
export const hasOwn = (val: object, key: string | symbol): key is keyof typeof val => hasOwnProperty.call(val, key)
export const objectToString = Object.prototype.toString

/**
 * Converts a type of value to a string.
 *
 * @category ObjectUtil
 */
export const toTypeString = (val: unknown): string => objectToString.call(val)

/**
 * Always return undefined.
 */
export function NOOP() { }

/**
 * Always return false.
 */
export const NO = () => false
