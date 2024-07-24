import type { FlowContext } from './context'

export interface INodeComponent {
  readonly id: string
  readonly name: string

  process: () => Promise<void>
  before?: () => Promise<void>
  after?: () => Promise<void>
  rollback?: () => Promise<void>
  onSuccess?: () => Promise<void>
  onError?: (err: Error) => Promise<void>
}

export abstract class NodeComponent implements INodeComponent {
  public readonly id: string = ''
  public readonly name: string = ''
  public ctx!: FlowContext<any>

  public abstract process(): Promise<void>
  public async before() { }
  public async after() { }
  public async rollback() { }
  public async onSuccess() { }
  public async onError(_: Error) { }

  public async run() {
    try {
      await this.before()
      await this.process()
      await this.onSuccess()
      await this.after()
    }
    catch (err: unknown) {
      try {
        await this.onError(err as Error)
      }
      catch (err) {
        console.error(err)
      }
      throw err
    }
    finally {
      await this.after()
    }
  }

  public getContext<C extends new (...any: any) => any>(cls: C): InstanceType<C> {
    return this.ctx.get(cls)
  }

  public setContext<C extends new (...any: any) => any>(cls: C, instance: InstanceType<C>) {
    this.ctx.set(cls, instance)
    return this
  }

  public getRequestData() {
    return this.ctx.getRequestData()
  }

  public withCtx(ctx: FlowContext<any>) {
    this.ctx = ctx
    return this
  }
}

export function defineNode(options: {
  run: () => (Promise<void> | void)
} & ThisType<NodeComponent>) {
  return class Node extends NodeComponent {
    public readonly id = 'node'
    public readonly name = 'node'
    public async process() {
      return options.run.call(this)
    }

    static create() {
      return new Node()
    }
  }
}

export type NodeCtor<T extends NodeComponent = NodeComponent> = new (...args: any[]) => T
