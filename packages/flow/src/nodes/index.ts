import type { NodeCtor } from '../node'
import type { IFNodeConfig } from './IFNode'
import type { ParallelNodeConfig } from './Parallel'
import type { SequenceNodeConfig } from './Sequence'
import type { SwitchNodeConfig } from './SwitchNode'

export type NodeConfig = NodeCtor | SequenceNodeConfig | ParallelNodeConfig | IFNodeConfig | SwitchNodeConfig

export * from './SwitchNode'
export * from './Parallel'
export * from './Sequence'
export * from './IFNode'
