/* eslint-disable no-nested-ternary, no-mixed-operators, no-unused-expressions, */

const trackTransition = 'all .38s cubic-bezier(.4,0,.2,1)'

type Dir = 0 | 1 | -1

export class SwipeController {
  index: number

  elemNum: number

  maxIndex: number

  trackIndexes: number[]

  constructor(
    readonly originElems: HTMLDivElement[],
    readonly total: number,
    readonly displayNum: number,
    readonly moveNum: number
  ) {
    this.releaseTransition()
    this.index = 0
    this.maxIndex = this.total - this.displayNum
    this.elemNum = this.originElems.length
    this.trackIndexes = [0, 0, -1]
    this.resolvePosition(0, 0)
  }

  private resolveDir(x: number) {
    return !x ? 0 : x < 0 ? 1 : -1
  }

  private nextIndex(dir: Dir, isOver: boolean) {
    return this.index + (isOver ? this.moveNum * dir : 0)
  }

  private calcIndexRate(index: number) {
    return index * 100
  }

  private calcOrdreRate(trackIndexes: number[]) {
    const trackwidth = this.total * 100
    const base = (index: number) => index * 100
    const calc = (trackIndex: number, index: number) =>
      base(-index) + trackwidth * index + trackwidth * this.elemNum * trackIndex
    return trackIndexes.map((trackIndex, i) => {
      return calc(trackIndex, i)
    })
  }

  private resolveTrackPotision(
    currenTrackIndexes: number[],
    nextTrackIndexes: number[],
    pos: number,
    index: number
  ) {
    this.calcOrdreRate(nextTrackIndexes).forEach((rate, i) => {
      const elem = this.originElems[i]
      const indexRate = this.calcIndexRate(index)
      const current = currenTrackIndexes[i]
      const next = nextTrackIndexes[i]
      const shoultTransition = current === next
      if (!shoultTransition) {
        elem.style.transition = 'none'
      }
      elem.style.transform = `
      translateX(${pos}px)
      translateX(${rate}%)
      translateX(${-indexRate}%)
      `
    })
  }

  private resolveStyle(pos: number, isOver: boolean) {
    const nextIndex = this.nextIndex(this.resolveDir(pos), isOver)
    this.resolvePosition(nextIndex, pos)
  }

  private mappingTrackIndexes(trackRelateIndex: number) {
    return (v: number, i: number) => {
      const addNum = trackRelateIndex === 0 ? 0 : trackRelateIndex > 0 ? 1 : -1
      const resolved = i < Math.abs(trackRelateIndex) ? addNum : 0
      return v + resolved
    }
  }

  private resolvePosition(nextIndex: number, pos: number) {
    const nextState = Math.floor(nextIndex / this.total)

    const trackState = nextState - Math.floor(3 / 2)
    const trackBaseAbs = Math.floor(Math.abs(trackState) / this.elemNum)
    const trackBaseIndex = trackState > 0 ? trackBaseAbs : -trackBaseAbs
    const trackRelateIndex = trackState % this.elemNum

    const trackIndexes = [trackBaseIndex, trackBaseIndex, trackBaseIndex]
      .map(this.mappingTrackIndexes(trackRelateIndex))
      .sort((a, b) => b - a)

    this.resolveTrackPotision(this.trackIndexes, trackIndexes, pos, this.index)
    this.trackIndexes = trackIndexes
  }

  private resolveMove(dir: Dir) {
    const nextIndex = this.nextIndex(dir, true)
    this.index = nextIndex
  }

  private releaseTransition() {
    this.originElems.forEach(elem => {
      elem.style.transition = 'none'
    })
  }

  private resolveFin() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.originElems.forEach(elem => {
          elem.style.transition = trackTransition
        })
        this.resolvePosition(this.index, 0)
      })
    })
  }

  handleStart() {
    this.releaseTransition()
  }

  handle(x: number, isOver: boolean) {
    this.resolveStyle(x, isOver)
  }

  handleEnd() {
    this.resolveFin()
  }

  handleNext() {
    this.resolveMove(1)
  }

  handlePrev() {
    this.resolveMove(-1)
  }

  move(dir: Dir) {
    this.resolvePosition(this.nextIndex(dir, true), 0)
    this.resolveMove(dir)
    this.resolveFin()
  }

  next() {
    this.move(1)
  }

  prev() {
    this.move(-1)
  }
}
