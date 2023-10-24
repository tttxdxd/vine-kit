export interface IModelConfig {
  validation: {
    /** 校验全部 默认为 false */
    all: boolean
  }
}

export const config: IModelConfig = {
  validation: {
    all: false,
  },
}

export function defineModelConfig(options?: IModelConfig) {
  Object.assign(config, options)

  return config
}
