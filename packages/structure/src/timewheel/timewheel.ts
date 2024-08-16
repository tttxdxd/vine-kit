import { PriorityQueue } from '..'

type TaskCallback<TArgs extends any[] = any[]> = (...args: TArgs) => void
enum TaskStatus {
  DELETE = 1,
}

let autoId = 1

class Task {
  callback: TaskCallback
  args: any[]
  repeat: boolean
  interval: number

  id: number
  start: number
  next: number
  times: number

  constructor(callback: TaskCallback, interval: number, repeat: boolean = false, args: any[]) {
    this.id = autoId++
    this.start = Date.now()
    this.next = this.start + interval
    this.times = 1
    this.callback = callback
    this.args = args
    this.interval = interval
    this.repeat = repeat || false
  }

  calcNext() {
    this.next = this.start + (this.times++) * this.interval
  }
}

export class TimeWheel {
  wheelQueue: PriorityQueue<Task> = new PriorityQueue((a, b) => a.next - b.next)
  statusMap: Map<number, TaskStatus> = new Map()

  current?: Task
  timer?: NodeJS.Timeout

  addTask(callback: TaskCallback, ms: number, repeat: boolean, ...args: any[]) {
    const task = new Task(callback, ms, repeat, args)
    this.wheelQueue.push(task)
    this.run()
    return task.id
  }

  setTimeout<TArgs extends any[]>(callback: TaskCallback<TArgs>, ms?: number, ...args: any[]) {
    return this.addTask(callback, ms || 0, false, ...args)
  }

  setInterval<TArgs extends any[]>(callback: TaskCallback<TArgs>, ms?: number, ...args: any[]) {
    return this.addTask(callback, ms || 0, true, ...args)
  }

  clearTimeout(id: number) {
    this.statusMap.set(id, TaskStatus.DELETE)
  }

  private run() {
    const task = this.wheelQueue.pop()
    if (!task)
      return
    if (this.current && this.current.next <= task.next) {
      return
    }
    else {
      clearTimeout(this.timer)
    }

    const delay = Math.max(task.next - Date.now(), 0)

    this.current = task
    this.timer = setTimeout(() => {
      this.act(task)
      this.current = undefined
      this.run()
    }, delay)
  }

  private act(task: Task) {
    if (this.statusMap.get(task.id) === TaskStatus.DELETE) {
      this.statusMap.delete(task.id)
      return
    }

    try {
      task.callback(...task.args)
    }
    catch (e) {
      console.error(e)
    }
    finally {
      task.times++
    }

    if (task.repeat) {
      task.calcNext()
      this.wheelQueue.push(task)
    }
  }
}
