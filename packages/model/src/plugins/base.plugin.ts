import type { Model } from '../model'

export interface BasePluginOptions<T = any> {
  name?: string
  keys?: string[]
  fields?: T[]
}

/**
 * Base class for model plugins.
 */
export abstract class BasePlugin<T extends BasePluginOptions = any> {
  private viewMap = new WeakMap<Model, T>()

  abstract readonly name: string
  abstract transformModel(model: Model): T

  toView(model: Model): T {
    const view = this.viewMap.get(model)
    if (view) {
      return view
    }

    const name = `${model.name}${(this.name)}View`
    const keys = model.keys
    const data = this.transformModel(model)

    const newView = Object.assign({ name, keys }, data)
    this.viewMap.set(model, newView)
    return newView
  }
}
