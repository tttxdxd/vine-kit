import type { Constructor } from '../types'
import { isUndefined, notNull, notUndefined } from './general'

type Target = Constructor | object
type PropertyKey = string | symbol

// eslint-disable-next-line unused-imports/no-unused-vars, ts/no-wrapper-object-types
export interface MetadataSymbolKey<T = any> extends Symbol { }
// eslint-disable-next-line unused-imports/no-unused-vars, ts/no-wrapper-object-types
export interface MetadataStringKey<T = any> extends String { }
export type MetadataKey<T = any> = MetadataSymbolKey<T> | MetadataStringKey<T>

export function defineMetadateKey<T>(key: MetadataKey<T>): MetadataKey<T> {
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
    getClassMetaMap(key)?.delete(target)
  else
    getPropMetaMap(key, target)?.delete(propertyKey)
  getMetadataMap(target, propertyKey)?.delete(key)
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
  return getMetadataMap(target, propertyKey)?.get(key)
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
  const metadata = getMetadataMap(target, propertyKey)?.get(key)

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
  return getMetadataMap(target, propertyKey)?.has(key) ?? false
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
  const metadataMap = getMetadataMap(target, propertyKey)
  return isUndefined(metadataMap) ? [] : Array.from(metadataMap.keys())
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
 * Retrieves an array of targets that have been annotated with a specific metadata key.
 *
 * @param key - The metadata key for which the targets should be retrieved. This key should be unique and
 *              used to identify the metadata associated with classes, methods, or properties.
 * @returns An array of targets (classes, methods, or properties) that have been annotated with the
 *          specified metadata key. If no targets are found, an empty array is returned.
 */
export function getMetadataTargets(key: MetadataKey): Target[] {
  const targetMap = getClassMetaMap(key)

  return isUndefined(targetMap) ? [] : Array.from(targetMap.keys())
}

/**
 * Retrieves a list of metadata for classes based on the provided metadata key.
 *
 * @param key he metadata key used to retrieve the metadata.
 * @returns An array of metadata for classes.
 */
export function listOwnMeta<T>(key: MetadataKey<T>): IClassMeta<T>[]

/**
 * Retrieves a list of metadata for properties based on the provided metadata key and target.
 *
 * @param key The metadata key used to retrieve the metadata.
 * @param target The target object whose property metadata is to be retrieved.
 * @returns An array of metadata for properties.
 */
export function listOwnMeta<T>(key: MetadataKey<T>, target: Target): IPropMeta<T>[]
export function listOwnMeta<T>(key: MetadataKey<T>, target?: Target): IMeta<T>[]
export function listOwnMeta<T>(key: MetadataKey<T>, target?: Target) {
  const map = isUndefined(target) ? getClassMetaMap(key) : getPropMetaMap(key, target)

  return isUndefined(map) ? [] : Array.from(map.values())
}

/**
 * Retrieves a list of metadata for classes based on the provided metadata key.
 *
 * @template T The type of the metadata.
 *
 * @param key The metadata key used to retrieve the metadata.
 * @returns An array of metadata for classes.
 */
export function listMeta<T>(key: MetadataKey<T>): IClassMeta<T>[]
/**
 * Retrieves a list of metadata for properties based on the provided metadata key and target.
 *
 * @template T - The type of the metadata.
 *
 * @param key The metadata key used to retrieve the metadata.
 * @param target The target object whose property metadata is to be retrieved.
 * @returns An array of metadata for properties.
 */
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
 * Retrieves a list of metadata values for classes based on the provided metadata key.
 *
 * @param key The metadata key used to retrieve the metadata values.
 * @returns An array of metadata values for classes.
 */
export function listMetadata<T>(key: MetadataKey<T>): T[]
/**
 * Retrieves a list of metadata values for properties based on the provided metadata key and target.
 *
 * @param key The metadata key used to retrieve the metadata values.
 * @param target The target object whose property metadata values are to be retrieved.
 * @returns An array of metadata values for properties.
 */
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

function getMetadataMap(target: Target, propertyKey?: PropertyKey) {
  return metadataRegistry.get(target)?.get(propertyKey)
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

function getClassMetaMap(key: MetadataKey) {
  return classRegistry.get(key)
}

function getOrCreateClassMetaMap(key: MetadataKey) {
  let map = classRegistry.get(key)
  if (!map) {
    map = new Map()
    classRegistry.set(key, map)
  }
  return map
}

function getPropMetaMap(key: MetadataKey, target: Target) {
  return registry.get(key)?.get(target)
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
