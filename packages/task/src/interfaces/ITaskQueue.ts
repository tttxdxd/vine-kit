import type { ITask } from './ITask'
import type { ITaskEventListener } from './ITaskEventListener'

export interface ITaskQueue {
  addTask: (task: ITask, priority?: number) => Promise<string>
  getTaskStatus: (taskId: string) => Promise<{ status: string, progress: number } | null>
  pause: () => Promise<void>
  resume: () => Promise<void>
  saveState: () => Promise<string>
  loadState: (state: string) => Promise<void>
  addEventListener: (listener: ITaskEventListener) => void
  removeEventListener: (listener: ITaskEventListener) => void
}
