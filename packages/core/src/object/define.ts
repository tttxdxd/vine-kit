import { hasOwn, isFunction, isPlainObject } from '@vine-kit/shared'

/**
 * Adds a property to an object, or modifies attributes of an existing property.
 *
 * @category ObjectUtil
 * @param o Object on which to add or modify the property. This can be a native JavaScript object (that is, a user-defined object or a built in object) or a DOM object.
 * @param p The property name.
 * @param value The value to be assigned to the property. This can be either a property descriptor object or a getter function.
 */
export function define(o: any, p: PropertyKey, value: (PropertyDescriptor & ThisType<any> | (() => any))) {
  if (isFunction(value)) {
    Object.defineProperty(o, p, {
      get() { return value() },
    })
  }
  else if (isPlainObject(value)) {
    if (hasOwn(value, 'get') || hasOwn(value, 'set') || hasOwn(value, 'value'))
      Object.defineProperty(o, p, value)
    else
      Object.defineProperty(o, p, { value })
  }
  else { Object.defineProperty(o, p, { value }) }
}

/**
 * Defines a lazy property in an object.
 *
 * @category ObjectUtil
 */
export function defineLazy(o: any, p: PropertyKey, initail: () => any) {
  Object.defineProperty(o, p, {
    get() {
      const temp = initail()
      define(o, p, temp)
      return isFunction(temp) ? temp() : hasOwn(temp, 'value') ? temp.value : temp
    },
    set(v) {
      o[p] = v
    },
    configurable: true,
  })
}
