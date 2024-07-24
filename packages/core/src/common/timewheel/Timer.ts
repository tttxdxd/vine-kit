
export interface Timer {
  schedule(task: any, delay: number, unit: any): void
  stop(): void
}
