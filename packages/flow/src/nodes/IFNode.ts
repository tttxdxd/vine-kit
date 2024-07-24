import type { INodeComponent, NodeCtor } from '../node'
import { NodeComponent } from '../node'
import type { NodeConfig } from '.'

export abstract class IFNodeComponent extends NodeComponent {
  public abstract if(): Promise<boolean>

  public async process() {
    const result = await this.if()

    this.ctx.setIfResult(result)
  }
}

export class IFNode extends NodeComponent {
  constructor(public condition: IFNodeComponent, public truly: NodeComponent, public falsely: NodeComponent) {
    super()
  }

  public async process(): Promise<void> {
    await this.condition.run()

    if (this.ctx.getIfResult())
      await this.truly.run()
    else
      await this.falsely.run()
  }
}

export interface IFNodeConfig {
  type: 'IF'
  condition: NodeCtor<IFNodeComponent>
  truly: NodeConfig
  falsely: NodeConfig
}

export function IF(condition: NodeCtor<IFNodeComponent>, truly: NodeCtor, falsely: NodeCtor): IFNodeConfig {
  return {
    type: 'IF',
    condition,
    truly,
    falsely,
  }
}
