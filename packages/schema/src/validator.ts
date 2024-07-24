import { err, ok } from './result'
import { Number, type VineCtor, type VineType } from './vine'

const validatorWeakMap: WeakMap<VineCtor, any> = new WeakMap()
export const Validator = {
  register<T extends VineType>(ctor: VineCtor<T>, impl: any) {
    validatorWeakMap.set(ctor, impl)
  },

  validate() {

  },
}

Validator.register(Number, {
  validate(input: any) {
    if (typeof input === 'number')
      return ok(input)

    return err(input)
  },
})
