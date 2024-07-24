import type { INodeComponent, NodeCtor } from '../node'
import { NodeComponent } from '../node'
import type { NodeConfig } from '.'

export class ParallelNode extends NodeComponent {
  constructor(public nodes: NodeComponent[]) {
    super()
  }

  public async process(): Promise<void> {
    const nodes = this.nodes

    await Promise.all(nodes.map(node => node.run()))
  }
}

export interface ParallelNodeConfig {
  type: 'Parallel'
  nodes: NodeConfig[]
}

export function Parallel(...nodes: NodeCtor[]): ParallelNodeConfig {
  return {
    type: 'Parallel',
    nodes,
  }
}
