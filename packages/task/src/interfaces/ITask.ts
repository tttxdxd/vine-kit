export type ITaskStatus = 'ready' | 'running' | 'completed' | 'failed' | 'paused'

/**
 * Task interface
 */
export interface ITask {
  id: string
  status: ITaskStatus
  tasks: ITask[]

  priority?: number
  progress?: number
  retries?: number
  maxRetries?: number
  timeout?: number

  createdAt?: number
  updatedAt?: number
  startedAt?: number
  completedAt?: number
  failedAt?: number
  pausedAt?: number

  execute: () => Promise<void>
}
