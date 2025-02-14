
export interface ITask {
  id: string
  name: string
  description: string
  status: string
  progress: number
  createdAt: Date
  updatedAt: Date
}

export interface ITaskService {
  registerTask: (task: ITask) => void
  unregisterTask: (task: ITask) => void
  info: (taskId: string) => ITask | null
  page: () => ITask[]
  updateTask: (task: ITask) => void
  deleteTask: (taskId: string) => void 
  pause: () => Promise<void>
  resume: () => Promise<void> 
}

export interface ITaskExecutor {
  // 从队列中获取下一个任务

}
