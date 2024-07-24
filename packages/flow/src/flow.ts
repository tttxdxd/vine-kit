import { isConstructor } from '@vine-kit/core'

import { FlowContext } from './context'
import type { NodeComponent } from './node'
import { IFNode, ParallelNode, SequenceNode, SwitchNode } from './nodes'
import type { IFNodeComponent, NodeConfig, SwitchNodeComponent } from './nodes'

export interface FlowOptions {
  nodes: NodeConfig[]
  contexts?: (new () => any)[]
}

export class Flow {
  nodes: NodeConfig[]
  contexts: (new () => any)[]

  constructor(options: FlowOptions) {
    this.nodes = options.nodes
    this.contexts = options.contexts ?? []
  }

  async run(request?: any) {
    const ctx = new FlowContext(request, this.contexts)
    const nodes = this.buildNodes(this.nodes, ctx)
    const root = new SequenceNode(nodes).withCtx(ctx)

    await root.run()

    return {
      isSuccess: true,
      getContext: ctx.get.bind(ctx),
      getRequestData: ctx.getRequestData.bind(ctx),
    }
  }

  private buildNodes(nodes: NodeConfig[], ctx: FlowContext): NodeComponent[] {
    return nodes.map((node) => {
      if (isConstructor(node)) {
        const NodeConstructor = node
        return new NodeConstructor()
      }

      switch (node.type) {
        case 'Sequence':
          return new SequenceNode(this.buildNodes(node.nodes, ctx))
        case 'Parallel':
          return new ParallelNode(this.buildNodes(node.nodes, ctx))
        case 'IF': {
          const [condition, truly, falsely] = this.buildNodes([node.condition, node.truly, node.falsely], ctx)

          return new IFNode(condition as IFNodeComponent, truly, falsely)
        }
        case 'Switch': {
          const [condition, ...nodes] = this.buildNodes([node.condition, ...node.nodes], ctx)
          return new SwitchNode(condition as SwitchNodeComponent, nodes)
        }
        default:
          throw new Error(`Unknown node type: ${node}`)
      }
    }).map(node => node.withCtx(ctx))
  }
}

export function createFlow(options: FlowOptions) {
  return new Flow(options)
}
