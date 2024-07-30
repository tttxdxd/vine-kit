import { ReflectUtil } from '@vine-kit/core'

export const PARAMS_DI_METADATA = ReflectUtil.defineMetadateKey<any[]>('self:params-di')
export const PROPERTY_DI_METADATA = ReflectUtil.defineMetadateKey<true>('self:property-di')

export const OPTIONAL_PARAMS_METADATA = ReflectUtil.defineMetadateKey<any[]>('self:optional-params')
export const OPTIONAL_PROPERTY_METADATA = ReflectUtil.defineMetadateKey<true>('self:optional-property')
