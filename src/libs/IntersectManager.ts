import Observer from './Observer'

type callback = <T>(v: T) => void

interface opt {
  rootMargin?: string
  threshold?: number[]
}

export default class IntersectManager {
  private $el: HTMLElement
  private rootMargin: string
  private threshold: number[]
  private listener: Observer
  private listenerAtOnce: Observer
  private intersectionObserver: IntersectionObserver | undefined

  constructor($el: HTMLElement, opt: opt = {}) {
    this.$el = $el
    this.rootMargin = opt.rootMargin || '0px 0px'
    this.threshold = opt.threshold || [0, 0.25, 0.5, 0.75, 1]
    this.onIntersect = this.onIntersect.bind(this)
    this.listener = new Observer()
    this.listenerAtOnce = new Observer()
  }

  public observer() {
    if (!this.intersectionObserver) {
      this.intersectionObserver = new IntersectionObserver(this.onIntersect, {
        rootMargin: this.rootMargin,
        threshold: this.threshold,
      })
    }
    return this.intersectionObserver
  }

  public regist(cb: callback) {
    this.listener.register(cb)
  }

  public atOnce(cb: callback) {
    this.listenerAtOnce.register(cb)
  }

  public onIntersect(entries: IntersectionObserverEntry[]) {
    if (entries.length === 0) return
    if (entries[0].intersectionRatio <= 0) return
    if (this.listener.handlers.length) {
      this.listener.dispatch(entries)
    }
    if (this.listenerAtOnce.handlers.length) {
      this.listenerAtOnce.dispatch(entries)
      this.listenerAtOnce.handlers = []
    }
  }

  public observe() {
    ;(window as any).requestAnimationFrame(() => this.observer().observe(this.$el))
  }

  public unobserve() {
    this.observer().unobserve(this.$el)
    this.observer().disconnect()
  }
}
