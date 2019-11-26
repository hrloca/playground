type callback = (...args: any[]) => void

export default class Observer {
  public handlers: callback[]
  constructor() {
    this.handlers = []
  }
  public register(cb: callback) {
    if (cb && typeof cb === 'function') this.handlers.push(cb)
    return cb
  }
  public releaseAll() {
    this.handlers = []
  }
  public release(cb: callback) {
    if (cb && typeof cb === 'function') {
      const index = this.handlers.findIndex(val => val === cb)
      if (index !== -1) this.handlers.splice(index, 1)
    }
  }
  public dispatch<T extends any[]>(...args: T) {
    for (let i = 0; i < this.handlers.length; ++i) {
      this.handlers[i](...args)
    }
  }
}
