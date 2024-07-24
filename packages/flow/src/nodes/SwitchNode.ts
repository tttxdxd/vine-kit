import { isUndefined } from '@vine-kit/core'
import type { INodeComponent, NodeCtor } from '../node'
import { NodeComponent } from '../node'
import type { NodeConfig } from '.'

export abstract class SwitchNodeComponent extends NodeComponent {
  public abstract switch(): Promise<string>

  public async process(): Promise<void> {
    const result = await this.switch()

    this.ctx.setSwitchResult(result)
  }

  constructor(public condition: INodeComponent, public nodes: INodeComponent[]) {
    super()
  }
}

export class SwitchNode extends NodeComponent {
  constructor(public condition: SwitchNodeComponent, public nodes: NodeComponent[]) {
    super()
  }

  public async process(): Promise<void> {
    await this.condition.run()

    const result = this.ctx.getSwitchResult()
    const node = this.nodes.find(node => node.id === result)

    if (isUndefined(node))
      throw new Error(`Switch result ${result} is not defined`)

    await node.run()
  }
}

export interface SwitchNodeConfig {
  type: 'Switch'
  condition: NodeCtor<SwitchNodeComponent>
  nodes: NodeConfig[]
}

export function Switch(condition: NodeCtor<SwitchNodeComponent>, ...nodes: NodeCtor[]): SwitchNodeConfig {
  return {
    type: 'Switch',
    condition,
    nodes,
  }
}
