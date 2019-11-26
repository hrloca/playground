import { debounce } from 'debounce'

export type Params<T> = Partial<{
  onStart: (e: T) => void
  onTicking: (e: T) => void
  onEnd: (e: T) => void
  throttle: number
  debounceWait: number
}>

export class Ticker<T = Event> {
  private throttle: number
  private debouncedOnEndHandler: Function
  private ticking: boolean
  private isChanging: boolean
  private lastTick: number
  private debounceWait: number
  onStart: Params<T>['onStart']
  onTicking: Params<T>['onTicking']
  onEnd: Params<T>['onEnd']

  constructor(
    public readonly params: Params<T> = {}
  ) {
    this.throttle = params.throttle || 0
    this.debounceWait = params.debounceWait || 100
    this.onStart = params.onStart
    this.onTicking = params.onTicking
    this.onEnd = params.onEnd
    this.debouncedOnEndHandler = debounce(this.handleEnd, this.debounceWait)
    this.lastTick = 0
    this.ticking = false
    this.isChanging = false
  }

  dispatch(e: T) {
    this.requestTick(e)
  }

  private handleStart(e: T) {
    this.lastTick = Date.now()
    this.isChanging = true
    if (this.onStart) this.onStart(e)
  }

  private handleTick(e: T) {
    this.lastTick = Date.now()
    if (this.onTicking) this.onTicking(e)
  }

  private handleEnd(e: T) {
    this.isChanging = false
    if (this.onTicking) this.onTicking(e)
    if (this.onEnd) this.onEnd(e)
  }

  private shouldEmitT(lastTick: number, eventThrottle: number) {
    if (eventThrottle === 0) return true
    return eventThrottle > 0 && Date.now() - lastTick >= eventThrottle
  }

  private handlebody(e: T): void {
    this.debouncedOnEndHandler(e)
    if (this.isChanging) {
      if (this.shouldEmitT(this.lastTick, this.throttle)) {
        this.handleTick(e)
      }
      return
    }
    this.handleStart(e)
  }

  private handler(e: T) {
    this.handlebody(e)
    this.ticking = false
  }

  private requestTick(e: T) {
    if (!this.ticking) {
      ;(window as any).requestAnimationFrame(() => this.handler(e))
    }
    this.ticking = true
  }
}
