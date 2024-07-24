import type { INodeComponent, NodeCtor } from '../node'
import { NodeComponent } from '../node'
import type { NodeConfig } from '.'

export class SequenceNode extends NodeComponent {
  constructor(private readonly nodes: NodeComponent[]) {
    super()
  }

  public async process(): Promise<void> {
    const nodes = this.nodes

    for (const node of nodes)
      await node.run()
  }
}

export interface SequenceNodeConfig {
  type: 'Sequence'
  nodes: NodeConfig[]
}

export function Sequence(...nodes: NodeCtor[]): SequenceNodeConfig {
  return {
    type: 'Sequence',
    nodes,
  }
}
