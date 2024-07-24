import type { ITask } from '../interfaces/ITask'
import type { ITaskEventListener } from '../interfaces/ITaskEventListener'
import type { ITaskQueue } from '../interfaces/ITaskQueue'

export class TaskQueue implements ITaskQueue {
  tasks: ITask[] = []
  activeTasks: ITask[] = []
  maxConcurrency: number = 3

  async addTask(task: ITask): Promise<string> {
    this.tasks.push(task)
    return ''
  }

  async getTaskStatus(taskId: string): Promise<{ status: string, progress: number } | null> {
    return null
  }

  async pause(): Promise<void> {

  }

  async resume(): Promise<void> {

  }

  async saveState(): Promise<string> {
    return ''
  }

  async loadState(state: string): Promise<void> {

  }
}
