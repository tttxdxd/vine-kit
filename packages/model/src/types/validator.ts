import type { Validator } from '../validator'
import type { MetaType } from './meta'

declare const StringSymbol: unique symbol
declare const NumberSymbol: unique symbol
declare const BooleanSymbol: unique symbol

export type IValidatorString = Validator & { [StringSymbol]: true }
export interface IValidatorNumber { [NumberSymbol]: true }
export interface IValidatorBoolean { [BooleanSymbol]: true }

export type IValidatorType = IValidatorString | IValidatorNumber | IValidatorBoolean

export type IValidator<T extends MetaType> = T extends StringConstructor
  ? IValidatorString
  : T extends NumberConstructor
    ? IValidatorNumber
    : T extends BooleanConstructor
      ? IValidatorBoolean
      : never
