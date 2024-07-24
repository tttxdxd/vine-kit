import type { ITask } from './ITask'

export interface ITaskEventListener {
  onTaskStatusChange: (task: ITask) => void
  onTaskProgressChange: (task: ITask) => void
  onTaskComplete: (task: ITask) => void
  onTaskFailed: (task: ITask, error: Error) => void
}
