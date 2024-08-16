export * from './assign'
export * from './clone'
export * from './defaults'
export * from './merge'
export * from './define'

/**
 * Checks if an object is empty.
 *
 * @category ObjectUtil
 */
export function isEmptyObject(val: object): boolean {
  // eslint-disable-next-line no-unreachable-loop
  for (const _ in val)
    return false
  return true
}
