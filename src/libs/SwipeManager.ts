/* eslint-disable no-nested-ternary, no-mixed-operators, no-unused-expressions, */
import { Point, Point3D } from './Point'

// eslint-disable-next-line max-len
const getPage = (page: string, event: any): number =>
  event.changedTouches ? event.changedTouches[0][page] : event[page]

type Axis2d = 'x' | 'y'
export type Handler = (e: Event, delta: EventData) => void
export type HandlerWithIsOver = (
  e: Event,
  delta: EventData,
  isOver: boolean
) => void

export interface SwipeManagerOption {
  DISTANCE_THRESHOLD?: number
  ANGLE_THREHOLD?: number
  LIMIT_THRESHOLD?: number
  RELEASE_THRESHOLD?: number
  onGrab?: Handler
  onGrabing?: HandlerWithIsOver
  onGrabEnd?: Handler
  onSwipeUp?: Handler
  onSwipeDown?: Handler
  onSwipeRight?: Handler
  onSwipeLeft?: Handler
  onSwipeUpAuto?: Handler
  onSwipeDownAuto?: Handler
  onSwipeRightAuto?: Handler
  onSwipeLeftAuto?: Handler
}

export interface EventData {
  point: Point
  velocity: number
}

export interface SwipeManager {
  DISTANCE_THRESHOLD: number
  ANGLE_THREHOLD: number
  LIMIT_THRESHOLD: number
  RELEASE_THRESHOLD: number
  useSwipeX: boolean
  useSwipeY: boolean
  useGrab: boolean
}

export class SwipeManager implements SwipeManager {
  private el: any

  private startPagePoint!: Point

  private pagePoint!: Point

  private isGrab!: boolean

  private isLock!: boolean

  private isOver!: boolean

  private isSwiped!: boolean

  private startTime!: number

  private swipingTime!: number

  private delta!: Point3D

  private moveAmountPoint!: Point

  private grabbedPoint!: Point

  private grabingPoint!: Point

  private axis!: '' | Axis2d

  private withinRange!: boolean

  private max!: number

  private onGrab?: Handler

  private onGrabing?: HandlerWithIsOver

  private onGrabEnd?: Handler

  private onSwipeUp?: Handler

  private onSwipeDown?: Handler

  private onSwipeRight?: Handler

  private onSwipeLeft?: Handler

  private onSwipeUpAuto?: Handler

  private onSwipeDownAuto?: Handler

  private onSwipeRightAuto?: Handler

  private onSwipeLeftAuto?: Handler

  constructor(el: any, opt: SwipeManagerOption = {}) {
    this.el = el

    this.DISTANCE_THRESHOLD = opt.DISTANCE_THRESHOLD || 5
    this.ANGLE_THREHOLD = opt.ANGLE_THREHOLD || 60
    this.LIMIT_THRESHOLD = opt.LIMIT_THRESHOLD || 18
    this.RELEASE_THRESHOLD = opt.RELEASE_THRESHOLD || 3

    this.initHandler(opt)

    this.touchStart = this.touchStart.bind(this)
    this.touchMove = this.touchMove.bind(this)
    this.touchEnd = this.touchEnd.bind(this)

    this.addEvent()
    this.reset()
  }

  private addEvent() {
    this.el.addEventListener('touchstart', this.touchStart)
    this.el.addEventListener('touchmove', this.touchMove)
    this.el.addEventListener('touchend', this.touchEnd)
  }

  removeEvent() {
    this.el.removeEventListener('touchstart', this.touchStart)
    this.el.removeEventListener('touchmove', this.touchMove)
    this.el.removeEventListener('touchend', this.touchEnd)
  }

  initHandler(opt: SwipeManagerOption) {
    this.useSwipeX =
      !!opt.onSwipeRight ||
      !!opt.onSwipeLeft ||
      !!opt.onSwipeRightAuto ||
      !!opt.onSwipeLeftAuto

    this.useSwipeY =
      !!opt.onSwipeUp ||
      !!opt.onSwipeDown ||
      !!opt.onSwipeUpAuto ||
      !!opt.onSwipeDownAuto

    this.useGrab =
      this.useSwipeY ||
      this.useSwipeX ||
      !!opt.onGrab ||
      !!opt.onGrabing ||
      !!opt.onGrabEnd

    this.onGrab = opt.onGrab
    this.onGrabing = opt.onGrabing
    this.onGrabEnd = opt.onGrabEnd
    if (this.useSwipeX) {
      this.onSwipeRight = opt.onSwipeRight
      this.onSwipeLeft = opt.onSwipeLeft
      this.onSwipeRightAuto = opt.onSwipeRightAuto
      this.onSwipeLeftAuto = opt.onSwipeLeftAuto
    }
    if (this.useSwipeY) {
      this.onSwipeUp = opt.onSwipeUp
      this.onSwipeDown = opt.onSwipeDown
      this.onSwipeUpAuto = opt.onSwipeUpAuto
      this.onSwipeDownAuto = opt.onSwipeDownAuto
    }
  }

  private reset() {
    this.isGrab = false
    this.isLock = false
    this.axis = ''
    this.isOver = false
    this.isSwiped = false
    this.delta = new Point3D()
    this.grabbedPoint = new Point()
    this.grabingPoint = new Point()
    this.pagePoint = new Point()
    this.startTime = 0
    this.swipingTime = 0
  }

  get eventData(): EventData {
    return { point: this.grabingPoint, velocity: this.velocity }
  }

  get velocity(): number {
    return this.delta.z / (this.swipingTime || 1)
  }

  get isGrabing(): boolean {
    return this.isGrab && this.useGrab
  }

  getPoint(e: Event): Point {
    return new Point(getPage('pageX', e), getPage('pageY', e))
  }

  private resolveGrab(e: Event, angle: number): void {
    if (!this.isLock) {
      this.isLock = true
      const isSwipeX = angle > this.ANGLE_THREHOLD
      const isSwipeY = angle < 90 - this.ANGLE_THREHOLD
      this.isGrab = isSwipeX || isSwipeY
      if (this.isGrabing) {
        this.axis = isSwipeX ? 'x' : 'y'
        this.grabbedPoint = this.getPoint(e).sub(this.startPagePoint)
        this.onGrab?.(e, this.eventData)
      }
    }
  }

  private touchStart(e: Event): void {
    this.reset()
    this.startTime = e.timeStamp
    this.startPagePoint = this.getPoint(e)
  }

  private touchMove(e: Event): void {
    this.pagePoint = this.getPoint(e)
    this.moveAmountPoint = this.pagePoint.sub(this.startPagePoint)
    this.delta = this.moveAmountPoint.withDelta
    this.swipingTime = e.timeStamp - this.startTime
    const { angle } = this.delta
    const isOverDistance: boolean = this.delta.z > this.DISTANCE_THRESHOLD
    if (isOverDistance) {
      this.resolveGrab(e, angle)
    }
    if (this.isGrabing) {
      this.swipingHandler()
      this.onGrabing?.(e, this.eventData, this.isOver)
      if (this.isOver && !this.isSwiped) {
        this.swipeAutoDispatch(e)
      }
    }
  }

  private touchEnd(e: Event): void {
    if (this.isOver && this.withinRange) this.swipedDispatcher(e)
    this.onGrabEnd?.(e, this.eventData)
    this.reset()
  }

  private whetherItIncrease(point: number): boolean {
    return point > 0
  }

  private whetherItOver(next: number): boolean {
    return this.LIMIT_THRESHOLD < next
  }

  private whetherWithinRange(next: number): boolean {
    return this.max < next + this.RELEASE_THRESHOLD
  }

  private swipingHandler(): void {
    const nextPoint: Point = this.moveAmountPoint.sub(this.grabbedPoint)
    const absNextPoint: Point = nextPoint.abs
    const absCurrentPoint: Point = this.grabingPoint.abs
    const diff: Point = absNextPoint.sub(absCurrentPoint)
    const absNext: number = absNextPoint[this.axis as Axis2d]
    const isIncrease: boolean = this.whetherItIncrease(
      diff[this.axis as Axis2d]
    )
    if (isIncrease) this.max = absNext
    this.isOver = this.whetherItOver(absNext)
    this.withinRange = this.whetherWithinRange(absNext)

    this.grabingPoint = nextPoint
  }

  private swipeAutoDispatch(e: Event): void {
    this.isSwiped = true
    switch (this.axis) {
      case 'x':
        if (this.grabingPoint.x > 0) {
          if (this.onSwipeRightAuto) this.onSwipeRightAuto(e, this.eventData)
        } else if (this.onSwipeLeftAuto) this.onSwipeLeftAuto(e, this.eventData)
        break
      case 'y':
        if (this.grabingPoint.y > 0) {
          if (this.onSwipeDownAuto) this.onSwipeDownAuto(e, this.eventData)
        } else if (this.onSwipeUpAuto) this.onSwipeUpAuto(e, this.eventData)
        break
      default:
        break
    }
  }

  private swipedDispatcher(e: Event): void {
    switch (this.axis) {
      case 'x':
        if (this.grabingPoint.x > 0) {
          if (this.onSwipeRight) this.onSwipeRight(e, this.eventData)
        } else if (this.onSwipeLeft) this.onSwipeLeft(e, this.eventData)
        break
      case 'y':
        if (this.grabingPoint.y > 0) {
          if (this.onSwipeDown) this.onSwipeDown(e, this.eventData)
        } else if (this.onSwipeUp) this.onSwipeUp(e, this.eventData)
        break
      default:
        break
    }
  }
}
