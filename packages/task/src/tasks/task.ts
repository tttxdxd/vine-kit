import type { ITask, ITaskStatus } from '../interfaces/ITask'

export class Task implements ITask {
  id: string
  status: ITaskStatus
  payload: Record<string, any>
  tasks: ITask[]

  constructor() {
    this.id = Math.random().toString(36).slice(2)
    this.status = 'ready'
    this.payload = {}
    this.tasks = []
  }

  async execute() {
    this.status = 'running'

    try {
      await this.run()
      this.status = 'completed'
    }
    catch (error) {
      this.status = 'failed'
      throw error
    }
  }

  async run() {
    // Do something
  }
}
