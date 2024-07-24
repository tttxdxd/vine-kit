
enum TimerLevel {
  Second = 'Second',
  Minute = 'Minute',
  Hour = 'Hour',
  Day = 'Day',
}

interface TimerOptions {
  level?: TimerLevel,
}
type TimerConfig = Required<TimerOptions>

export class Timer {
  static TIME_SPAN: Record<TimerLevel, number> = {
    Second: 1000,
    Minute: 60 * 1000,
    Hour: 60 * 60 * 1000,
    Day: 24 * 60 * 60 * 1000,
  }
  static DEFAULT_CONFIG: TimerConfig = {
    level: TimerLevel.Second,
  }

  private config: TimerConfig;
  private timer?: NodeJS.Timeout;
  private nextTime: number = 0;
  private callback: () => void

  constructor(callback: () => void, options?: TimerOptions) {
    this.callback = callback
    this.config = Object.assign({}, Timer.DEFAULT_CONFIG, options)
  }

  getNextTime(now = Date.now()) {
    const span = Timer.TIME_SPAN[this.config.level]

    this.nextTime = (Math.floor(now / span) + 1) * span
    return this.nextTime
  }

  start() {
    const now = Date.now()
    const ms = Math.max(this.getNextTime(now) - now, 0)
    this.timer = setTimeout(() => {
      this.callback()
      this.start()
    }, ms)
    return this
  }

  stop() {
    clearTimeout(this.timer)
    return this
  }
}
