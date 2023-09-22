import type { Validator } from '../validator'
import type { MetaType } from './meta'

export declare const StringSymbol: unique symbol
export declare const NumberSymbol: unique symbol
export declare const BooleanSymbol: unique symbol
export declare const AsyncSymbol: unique symbol

export interface IValidatorString extends Validator { [StringSymbol]: true }
export interface IValidatorNumber extends Validator { [NumberSymbol]: true }
export interface IValidatorBoolean extends Validator { [BooleanSymbol]: true }
export interface IValidatorAsync extends Validator { [AsyncSymbol]: true }

export type IValidatorType = IValidatorString & IValidatorNumber & IValidatorBoolean
export type IValidatorTypeAsync = IValidatorString & IValidatorNumber & IValidatorBoolean & IValidateAsync

export type IValidator<T extends MetaType> = T extends StringConstructor
  ? IValidatorString
  : T extends NumberConstructor
    ? IValidatorNumber
    : T extends BooleanConstructor
      ? IValidatorBoolean
      : never

export type IValidateSync = (val: any) => boolean
export type IValidateAsync = (val: any) => Promise<boolean>
export type IValidate = IValidateSync | IValidateAsync

export type IsAsync<T extends any[]> = T[number] extends (IValidatorTypeAsync) ? true : false
