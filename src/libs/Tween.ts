import BezierEasing from 'bezier-easing'
import EventEmitter from 'eventemitter3'

export type TweenPosition = { x: number; y: number }

export class Tween {
  private durationTime: number
  private from: TweenPosition
  private to: TweenPosition
  private current: TweenPosition
  private startTime: number
  private bezierEase: BezierEasing.EasingFunction
  private callback: ((pos: TweenPosition) => void) | undefined
  private emitter: EventEmitter

  constructor() {
    const initialPosition = { x: 0, y: 0 }
    this.from = initialPosition
    this.to = initialPosition
    this.current = initialPosition
    this.startTime = 0
    this.durationTime = 300
    this.duration(this.durationTime)
    this.bezierEase = BezierEasing(0.4, 0.0, 0.2, 1)
    this.callback = undefined
    this.emitter = new EventEmitter()
  }

  setFromPosition(x: number, y: number) {
    this.from = { x, y }
    return this
  }

  setToPosition(x: number, y: number) {
    this.init()
    this.to = { x, y }
    return this
  }

  ease(bezierArr: [number, number, number, number]) {
    this.bezierEase = BezierEasing(...bezierArr)
    return this
  }

  duration(durationTime: number) {
    this.durationTime = durationTime
    return this
  }

  init() {
    this.startTime = Date.now()
    return this
  }

  step() {
    const now = Date.now()
    const deltaTime = now - this.startTime
    const isDone = deltaTime >= this.durationTime

    if (isDone) {
      this.from = this.to
      this.emitter.emit('end')
    }

    const from = this.from
    const to = this.to
    const current = this.current
    const portionOfTime = (now - this.startTime) / this.durationTime
    const easingValue = this.bezierEase(portionOfTime)
    const deltaPosition = { x: to.x - from.x, y: to.y - from.y }

    current.x = from.x
    current.y = from.y
    current.x += deltaPosition.x * easingValue
    current.y += deltaPosition.y * easingValue

    if (this.callback !== undefined) this.callback(this.current)
  }

  dispatch() {
    return this.step()
  }

  subscribe(callback: (position: TweenPosition) => void) {
    this.callback = callback
    return this
  }

  on(str: string, fn: (...args: any[]) => void) {
    return this.emitter.on(str, fn)
  }
}
