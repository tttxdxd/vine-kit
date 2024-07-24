import 'reflect-metadata'

// eslint-disable-next-line ts/no-wrapper-object-types
export declare interface InjectionKey<_T> extends String { }

export class DecoratorManager {
  static injectClassKey = 'INJECT_CLASS_KEY_METADATA'
  static injectMethodKey = 'INJECT_METHOD_KEY_METADATA'
  static container = new Map<InjectionKey<any>, Set<any>>()

  /**
   *
   * @param decoratorNameKey
   * @param data
   * @param target
   * @param propertyName
   */
  static saveMetadata<
    K extends InjectionKey<any>,
    Data = K extends InjectionKey<infer R> ? R : any,
  >(decoratorNameKey: K,
    data: Data,
    target: object,
    propertyName?: string,
  ) {
    if (propertyName) {
      const dataKey = getDecoratorMethodKey(decoratorNameKey, propertyName)
      saveMetadata(DecoratorManager.injectMethodKey, target, dataKey, data)
    }
    else {
      const dataKey = getDecoratorClassKey(decoratorNameKey)
      saveMetadata(DecoratorManager.injectClassKey, target, dataKey, data)
    }
  }

  /**
   *
   * @param decoratorNameKey
   * @param data
   * @param target
   * @param propertyName
   */
  static attachMetadata<
    K extends InjectionKey<any>,
    Data = K extends InjectionKey<infer R> ? R : any,
  >(decoratorNameKey: K,
    data: Data,
    target: object,
    propertyName?: string,
  ) {
    if (propertyName) {
      const dataKey = getDecoratorMethodKey(decoratorNameKey, propertyName)
      attachMetadata(DecoratorManager.injectMethodKey, target, dataKey, data)
    }
    else {
      const dataKey = getDecoratorClassKey(decoratorNameKey)
      attachMetadata(DecoratorManager.injectClassKey, target, dataKey, data)
    }
  }

  /**
   *
   * @param decoratorNameKey
   * @param target
   * @param propertyKey
   */
  static getMetadata<
    K extends InjectionKey<any>,
    Data = K extends InjectionKey<infer R> ? R : any,
  >(decoratorNameKey: K,
    target: object,
    propertyKey?: string,
  ): Data | undefined {
    if (propertyKey) {
      const dataKey = getDecoratorMethodKey(decoratorNameKey, propertyKey)
      return getMetadata(DecoratorManager.injectMethodKey, target, dataKey)
    }
    else {
      const dataKey = `${getDecoratorClassKey(decoratorNameKey)}`
      return getMetadata(DecoratorManager.injectClassKey, target, dataKey)
    }
  }

  static saveModule<K extends InjectionKey<any>>(key: K, target: object) {
    if (this.container.has(key)) {
      this.container.get(key)!.add(target)
    }
    else {
      this.container.set(key, new Set([target]))
    }
  }

  static listModule<K extends InjectionKey<any>>(key: K) {
    this.container.get(key)
  }
}

function getDecoratorMethodKey(decoratorNameKey: InjectionKey<any>, propertyKey: string) {
  return `${decoratorNameKey.toString()}_${propertyKey}`
}

function getDecoratorClassKey(decoratorNameKey: InjectionKey<any>) {
  return `${decoratorNameKey.toString()}_CLS`
}

/**
 * 获取 metadata
 * @param metaKey
 * @param target
 * @param dataKey
 */
function getMetadata(metaKey: string, target: object, dataKey?: string) {
  target = filterTarget(target)
  let m

  if (!Reflect.hasMetadata(metaKey, target)) {
    m = new Map()
    Reflect.defineMetadata(metaKey, m, target)
  }
  else {
    m = Reflect.getMetadata(metaKey, target)
  }

  if (dataKey)
    return m.get(dataKey)

  return m
}

/**
 * 设置 metadata
 * @param metaKey
 * @param target
 * @param dataKey
 * @param data
 */
function saveMetadata(metaKey: string, target: object, dataKey: string, data: any) {
  target = filterTarget(target)
  let m

  if (Reflect.hasMetadata(metaKey, target)) {
    m = Reflect.getMetadata(metaKey, target)
  }
  else {
    m = new Map()
  }

  m.set(dataKey, data)
  Reflect.defineMetadata(metaKey, m, target)
}

/**
 * 附加 metadata
 * @param metaKey
 * @param target
 * @param dataKey
 * @param data
 */
function attachMetadata(metaKey: string, target: object, dataKey: string, data: any) {
  target = filterTarget(target)
  let m

  if (Reflect.hasMetadata(metaKey, target)) {
    m = Reflect.getMetadata(metaKey, target)
  }
  else {
    m = new Map()
  }

  if (m.has(dataKey)) {
    m.get(dataKey).push(data)
  }
  else {
    m.set(dataKey, [data])
  }

  Reflect.defineMetadata(metaKey, m, target)
}

function filterTarget(target: object) {
  if (typeof target === 'object' && target.constructor) {
    return target.constructor
  }
  return target
}
