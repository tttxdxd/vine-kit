import type { Validator } from '../validator'
import type { MetaType } from './meta'

declare const StringSymbol: unique symbol
declare const NumberSymbol: unique symbol
declare const BooleanSymbol: unique symbol

export type IValidatorString = Validator & { [StringSymbol]: true }
export type IValidatorNumber = Validator & { [NumberSymbol]: true }
export type IValidatorBoolean = Validator & { [BooleanSymbol]: true }

export type IValidatorType = IValidatorString & IValidatorNumber & IValidatorBoolean

export type IValidator<T extends MetaType> = T extends StringConstructor
  ? IValidatorString
  : T extends NumberConstructor
    ? IValidatorNumber
    : T extends BooleanConstructor
      ? IValidatorBoolean
      : never
