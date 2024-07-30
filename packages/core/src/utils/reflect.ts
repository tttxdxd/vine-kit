import type { Constructor } from '../types'
import { isUndefined, notNull, notUndefined } from './general'

type Target = Constructor | object
type PropertyKey = string | symbol

// eslint-disable-next-line ts/no-wrapper-object-types, unused-imports/no-unused-vars
export declare interface MetadataKey<T = any> extends String { }

export function defineMetadateKey<T>(key: string): MetadataKey<T> {
  return key
}

export interface IClassMeta<T = any> {
  target: Target
  key: MetadataKey<T>
  value: T
}

export interface IPropMeta<T = any> {
  target: Target
  propertyKey: string | symbol
  key: MetadataKey<T>
  value: T
}

export type IMeta<T = any> = IClassMeta<T> | IPropMeta<T>

let metadataRegistry = new WeakMap<Target, Map<PropertyKey | undefined, Map<MetadataKey, any>>>()
let classRegistry = new Map<MetadataKey, Map<Target, IClassMeta>>()
let registry = new Map<MetadataKey, Map<Target, Map<PropertyKey, IPropMeta>>>()

export function clear() {
  metadataRegistry = new WeakMap()
  classRegistry = new Map()
  registry = new Map()
}

export const DESIGN_TYPE = defineMetadateKey<any>('design:type')
export const DESIGN_PARAMTYPES = defineMetadateKey<any>('design:paramtypes')
export const DESIGN_RETURNTYPE = defineMetadateKey<any>('design:returntype')

/**
 * Defines metadata for a class or a class property.
 *
 * @param key A unique string that identifies the metadata.
 * @param value The metadata value to associate with the key.
 * @param target The target object (class or class prototype) on which the metadata is defined.
 * @param propertyKey Optional. If provided, the metadata is associated with a specific property of the target object.
 *                    If not provided, the metadata is associated with the target class itself.
 */
export function defineMetadata<T>(key: MetadataKey<T>, value: T, target: Target, propertyKey?: PropertyKey): void {
  if (isUndefined(propertyKey))
    getOrCreateClassMetaMap(key).set(target, { key, value, target })
  else
    getOrCreatePropMetaMap(key, target).set(propertyKey, { key, value, target, propertyKey })

  getOrCreateMetadataMap(target, propertyKey).set(key, value)
}

export function deleteMetadata<T>(key: MetadataKey<T>, target: Target, propertyKey?: PropertyKey) {
  if (isUndefined(propertyKey))
    getOrCreateClassMetaMap(key).delete(target)
  else
    getOrCreatePropMetaMap(key, target).delete(propertyKey)
  getOrCreateMetadataMap(target, propertyKey).delete(key)
}

/**
 * Defines metadata for a class, property, or method.
 * This function serves as a universal decorator which can be applied to classes, class properties, or class methods.
 * It uses the provided key and value to associate metadata with the target.
 *
 * @param key A unique string identifier for the metadata.
 * @param value The metadata value to associate with the target. This can be of any type.
 * @returns A decorator function that can be used as a class decorator, property decorator, or method decorator.
 * The decorator accepts a target (class, property, or method) and an optional propertyKey (for properties and methods).
 * It then calls the `defineMetadata` function with the provided key, value, target, and propertyKey.
 */
export function metadata<T>(key: MetadataKey<T>, value: T): ClassDecorator & PropertyDecorator & MethodDecorator {
  return function (target: Target, propertyKey?: PropertyKey) {
    defineMetadata(key, value, target, propertyKey)
  }
}

/**
 * Retrieves the custom metadata for a given key on a target object or its property.
 * This function specifically looks for metadata that is directly associated with the target
 * or the property, ignoring any inherited metadata.
 *
 * @param key The unique key used to identify the metadata.
 * @param target The object on which the metadata is defined. It can be a class, object, or any other valid TypeScript target.
 * @param propertyKey Optional. If provided, the function will retrieve metadata specifically associated with the property of the target object.
 * @returns The metadata value associated with the provided key, or undefined if no metadata is found.
 */
export function getOwnMetadata<T>(key: MetadataKey<T>, target: Target, propertyKey?: PropertyKey): T | undefined {
  const metadataMap = getOrCreateMetadataMap(target, propertyKey)
  return metadataMap.get(key)
}

/**
 * Retrieves the custom metadata for a given key on a target object or its property.
 * This function specifically looks for metadata that is directly associated with the target
 * or the property, ignoring any inherited metadata.
 *
 * @param key - The unique key used to identify the metadata.
 * @param target - The object on which the metadata is defined.
 * It can be a class, object, or any other valid TypeScript target.
 * @param propertyKey - Optional. If provided, the function will retrieve metadata
 * specifically associated with the property of the target object.
 * @returns The metadata value associated with the provided key, or undefined if no metadata is found.
 */
export function getMetadata<T>(key: MetadataKey<T>, target: Target, propertyKey?: PropertyKey): T | undefined {
  const metadataMap = getOrCreateMetadataMap(target, propertyKey)
  const metadata = metadataMap.get(key)

  if (notUndefined(metadata))
    return metadata
  const parent = getPrototypeOf(target)
  if (notNull(parent))
    return getMetadata(key, parent, propertyKey)
  return undefined
}

/**
 * Checks if the target object has own metadata entry for the provided key.
 *
 * This function retrieves or creates a metadata map for the given target and optional property key,
 * and then checks if the map contains an entry for the specified key.
 *
 * @param key The key of the metadata to check.
 * @param target The target object that potentially contains metadata.
 * @param propertyKey Optional. The property key for which to retrieve the metadata map.
 * If not provided, it checks for class-level metadata instead of property-level metadata.
 * @returns Returns `true` if the target has own metadata entry for the provided key, `false` otherwise.
 */
export function hasOwnMetadata<T>(key: MetadataKey<T>, target: Target, propertyKey?: PropertyKey): boolean {
  const metadataMap = getOrCreateMetadataMap(target, propertyKey)
  return metadataMap.has(key)
}

/**
 * Checks if the specified metadata key has been defined on the target object or any of its prototypes.
 *
 * @param key The metadata key to check for.
 * @param target The target object or function where the metadata may be attached.
 * @param propertyKey Optional. The property key of the target object for which the metadata is queried.
 *                    This parameter is ignored if the target is not an object that owns properties.
 * @returns True if the metadata key exists on the target or any of its prototypes, false otherwise.
 */
export function hasMetadata<T>(key: MetadataKey<T>, target: Target, propertyKey?: PropertyKey): boolean {
  const hasOwn = hasOwnMetadata(key, target, propertyKey)
  if (hasOwn)
    return true
  const parent = getPrototypeOf(target)
  if (notNull(parent))
    return hasMetadata(key, parent, propertyKey)
  return false
}

/**
 * Retrieves the own (non-inherited) metadata keys defined on the target object or its property.
 *
 * @param target The target object on which to retrieve the metadata keys.
 * @param propertyKey Optional. The property key for which to retrieve the metadata keys. If not provided, the metadata keys for the target object itself will be retrieved.
 * @returns An array of strings representing the metadata keys that are defined on the target object or its property.
 * @example
 * class MyClass {
 *   myMethod() {}
 * }
 *
 * // Assuming getOrCreateMetadataMap has been implemented to manage metadata
 * Reflect.defineMetadata('key1', 'value1', MyClass);
 * Reflect.defineMetadata('key2', 'value2', MyClass.prototype, 'myMethod');
 *
 * // Retrieve the metadata keys for the class
 * console.log(getOwnMetadataKeys(MyClass)); // Outputs: ['key1']
 *
 * // Retrieve the metadata keys for the method
 * console.log(getOwnMetadataKeys(MyClass.prototype, 'myMethod')); // Outputs: ['key2']
 */
export function getOwnMetadataKeys(target: Target, propertyKey?: PropertyKey): MetadataKey[] {
  const metadataMap = getOrCreateMetadataMap(target, propertyKey)
  return Array.from(metadataMap.keys())
}

/**
 * Recursively retrieves all metadata keys for a given target and optionally a property key.
 * This function includes metadata keys from the target itself and its prototype chain.
 *
 * @param target The target object or class where metadata keys are being retrieved from.
 * @param propertyKey Optional. The property key of the target for which to retrieve metadata keys.
 * If not provided, retrieves metadata keys associated with the target itself rather than a specific property.
 * @returns An array of strings representing the unique metadata keys found on the target and its prototypes.
 */
export function getMetadataKeys(target: Target, propertyKey?: PropertyKey): MetadataKey[] {
  const keys = getOwnMetadataKeys(target, propertyKey)
  const parent = getPrototypeOf(target)
  if (notNull(parent)) {
    getMetadataKeys(parent, propertyKey).forEach((key) => {
      if (!keys.includes(key))
        keys.push(key)
    })
  }
  return keys
}

/**
 * Lists the own metadata entries associated with a given key, either for a class or a specific property within a class.
 *
 * @param key - The unique key used to identify the metadata entries.
 * @param target - (Optional) The target object whose property metadata should be listed.
 *                 If omitted, the function will list class-level metadata instead.
 *                 The `Target` type should be a class constructor or an instance of a class.
 * @returns An array containing the metadata entries associated with the given key.
 *          If `target` is provided, returns the metadata entries for the specific property.
 *          If `target` is omitted, returns the metadata entries for the class itself.
 */
export function listOwnMeta<T>(key: MetadataKey<T>): IClassMeta<T>[]
export function listOwnMeta<T>(key: MetadataKey<T>, target: Target): IPropMeta<T>[]
export function listOwnMeta<T>(key: MetadataKey<T>, target?: Target): IMeta<T>[]
export function listOwnMeta<T>(key: MetadataKey<T>, target?: Target) {
  if (isUndefined(target))
    return Array.from(getOrCreateClassMetaMap(key).values())
  return Array.from(getOrCreatePropMetaMap(key, target).values())
}

/**
 * Lists all metadata associated with a given key for the target object and its prototype chain.
 *
 * @param key The key to search for metadata.
 * @param target The object whose metadata should be listed. If not provided, it defaults to listing metadata of the object's own properties.
 * @returns An array of metadata objects, where each object contains information about a specific metadata entry associated with the given key.
 *          The returned list includes metadata entries from the target object and its prototype chain, excluding duplicates based on the propertyKey.
 */
export function listMeta<T>(key: MetadataKey<T>): IClassMeta<T>[]
export function listMeta<T>(key: MetadataKey<T>, target: Target): IPropMeta<T>[]
export function listMeta<T>(key: MetadataKey<T>, target?: Target): IMeta<T>[]
export function listMeta<T>(key: MetadataKey<T>, target?: Target) {
  if (isUndefined(target))
    return listOwnMeta(key)

  const list = listOwnMeta(key, target)
  const set = new Set(list.map(meta => meta.propertyKey))
  const parent = getPrototypeOf(target)
  if (notNull(parent)) {
    listMeta(key, parent).forEach((meta) => {
      if (!set.has(meta.propertyKey))
        list.push(meta)
    })
  }
  return list
}

/**
 * Retrieves a list of metadata values associated with a given key.
 * Optionally, a target can be specified to filter the metadata based on it.
 *
 * @param key - The unique key for which to retrieve metadata values.
 * @param target - (Optional) The target for which to filter the metadata.
 * If not provided, all metadata entries for the given key will be returned.
 * @returns An array of the metadata values associated with the given key and (optional) target.
 */
export function listMetadata<T>(key: MetadataKey<T>): T[]
export function listMetadata<T>(key: MetadataKey<T>, target: Target): T[]
export function listMetadata<T>(key: MetadataKey<T>, target?: Target) {
  return listMeta(key, target).map(meta => meta.value)
}

// 9.1 Ordinary Object Internal Methods and Internal Slots
// https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
// 9.1.1.1 OrdinaryGetPrototypeOf(O)
// https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
function getPrototypeOf(O: any): Target | null {
  const functionPrototype = Object.getPrototypeOf(Function)
  const proto = Object.getPrototypeOf(O)
  if (typeof O !== 'function' || O === functionPrototype)
    return proto
  // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
  // Try to determine the superclass constructor. Compatible implementations
  // must either set __proto__ on a subclass constructor to the superclass constructor,
  // or ensure each class has a valid `constructor` property on its prototype that
  // points back to the constructor.
  // If this is not the same as Function.[[Prototype]], then this is definitely inherited.
  // This is the case when in ES6 or when using __proto__ in a compatible browser.
  if (proto !== functionPrototype)
    return proto
  // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
  const prototype = O.prototype
  const prototypeProto = prototype && Object.getPrototypeOf(prototype)
  if (prototypeProto == null || prototypeProto === Object.prototype)
    return proto
  // If the constructor was not a function, then we cannot determine the heritage.
  const constructor = prototypeProto.constructor
  if (typeof constructor !== 'function')
    return proto
  // If we have some kind of self-reference, then we cannot determine the heritage.
  if (constructor === O)
    return proto
  // we have a pretty good guess at the heritage.
  return constructor
}

function getOrCreateMetadataMap(target: Target, propertyKey?: PropertyKey) {
  let targetMap = metadataRegistry.get(target)
  if (!targetMap) {
    targetMap = new Map()
    metadataRegistry.set(target, targetMap)
  }
  let metadataMap = targetMap.get(propertyKey)
  if (!metadataMap) {
    metadataMap = new Map()
    targetMap.set(propertyKey, metadataMap)
  }
  return metadataMap
}

function getOrCreateClassMetaMap(key: MetadataKey): Map<Target, IClassMeta> {
  let map = classRegistry.get(key)
  if (!map) {
    map = new Map()
    classRegistry.set(key, map)
  }
  return map
}

function getOrCreatePropMetaMap(key: MetadataKey, target: Target): Map<PropertyKey, IPropMeta> {
  let map = registry.get(key)
  if (!map) {
    map = new Map()
    registry.set(key, map)
  }
  let targetMap = map.get(target)
  if (!targetMap) {
    targetMap = new Map()
    map.set(target, targetMap)
  }
  return targetMap
}
