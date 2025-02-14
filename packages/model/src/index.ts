import { registerPlugin } from './model'
import { DatabasePlugin, FormPlugin, TablePlugin } from './plugins'

registerPlugin(new FormPlugin())
registerPlugin(new TablePlugin())
registerPlugin(new DatabasePlugin())

export * from './field'
export * from './plugins'
export * from './model'
