import Observer from '../Observer'
import { Ticker } from '../Ticker'
import { makeEventListenerOptions } from '../makeEventListenerOptions'
import { normalizeTargetLayout } from './normalizeTargetLayout'
import { Tween, TweenPosition } from '../Tween'

export * from './normalizeTargetLayout'

export type ScrollCallback = (e: Event, layout: ReturnType<typeof normalizeTargetLayout>) => void

const detectScrollElem = (): Element => {
  if ('scrollingElement' in document) {
    return document.scrollingElement as Element
  }

  if (navigator.userAgent.indexOf('WebKit') !== -1) {
    return window.document.body as Element
  }

  return window.document.documentElement as Element
}

type Options = Partial<{
  throttle: number
  debounceWait: number
  addEventListenerOptions: AddEventListenerOptions
}>

/**
 * Scroll 動作を管理するクラス
 */
export class ScrollManager {
  private el: Element
  private addEventListenerOptions: AddEventListenerOptions
  private onScrollStartObserver: Observer
  private onScrollObserver: Observer
  private onScrollEndObserver: Observer
  private ticker: Ticker
  private eventAttachTarget: Element | Document
  constructor(
    /**
     * コンポーネントから受け取る DOM
     */
    el?: Element,

    /**
     * ScrollManager で使用するオプション
     */
    public readonly options: Options = {}
  ) {
    this.el = el || detectScrollElem()
    this.eventAttachTarget = el || document
    this.addEventListenerOptions = options.addEventListenerOptions || {}
    this.onScrollStartObserver = new Observer()
    this.onScrollObserver = new Observer()
    this.onScrollEndObserver = new Observer()
    this.ticker = new Ticker({
      onStart: e => this.onScrollStartObserver.dispatch(e, normalizeTargetLayout(this.el)),
      onTicking: e => this.onScrollObserver.dispatch(e, normalizeTargetLayout(this.el)),
      onEnd: e => this.onScrollEndObserver.dispatch(e, normalizeTargetLayout(this.el)),
      throttle: options.throttle,
      debounceWait: options.debounceWait,
    })
    this.eventAttachTarget.addEventListener(
      'scroll',
      e => this.ticker.dispatch(e),
      makeEventListenerOptions(this.addEventListenerOptions)
    )
  }

  onScrollStart(cb: ScrollCallback) {
    this.onScrollStartObserver.register(cb)
  }

  onScroll(cb: ScrollCallback) {
    this.onScrollObserver.register(cb)
  }

  onScrollEnd(cb: ScrollCallback) {
    this.onScrollEndObserver.register(cb)
  }

  toScrollTop(isAnimation: boolean = false) {
    if (isAnimation) {
      this.toScroll(0, 0, true)
    }
    this.toScroll(0, 0)
  }

  toScroll(x: number = 0, y: number = 0, isAnimation: boolean = false) {
    if (isAnimation) {
      const tw = new Tween()
      tw.ease([0.4, 0.0, 0.2, 1])
        .setFromPosition(this.el.scrollLeft, this.el.scrollTop)
        .setToPosition(x, y)
        .duration(300)
        .subscribe((position: TweenPosition) => {
          this.el.scrollLeft = position.x
          this.el.scrollTop = position.y
        })

      let reqId: number
      tw.on('end', () => {
        cancelAnimationFrame(reqId)
      })

      const animation = () => {
        reqId = window.requestAnimationFrame(animation)
        tw.dispatch()
      }

      reqId = window.requestAnimationFrame(animation)
      return
    }

    this.el.scrollLeft = x
    this.el.scrollTop = y
  }
}
