enum scrollDirectionStatus {
  forward,
  backward,
}

const handleScrollDirection = (next: number, prev: number): scrollDirectionStatus => {
  if (next > prev && next > 0) {
    return scrollDirectionStatus.forward
  }
  return scrollDirectionStatus.backward
}

export enum scrollStatus {
  pendding,
  departing,
  returning,
}

const handleScroll = (next: number, prev: number, DIFF_THRESHOLD: number = 10): scrollStatus => {
  const diff = Math.abs(prev - next)
  if (diff > DIFF_THRESHOLD) {
    const dir = handleScrollDirection(next, prev)
    return dir === scrollDirectionStatus.forward ? scrollStatus.departing : scrollStatus.returning
  }
  return scrollStatus.pendding
}

export const normalizeTargetLayout = (target: any) => ({
  offset: {
    get x() {
      return target.scrollLeft
    },
    get y() {
      return target.scrollTop
    },
    get rightX() {
      return target.clientWidth + target.scrollLeft
    },
    get bottomY() {
      return target.clientHeight + target.scrollTop
    },
    get widthX() {
      return target.scrollWidth
    },
    get widthY() {
      return target.scrollHeight
    },
    get displayWidthX() {
      return target.clientWidth
    },
    get displayWidthY() {
      return target.clientHeight
    },
  },
  scrollDirectionStatus,
  scrollStatus,
  handleScrollDirection,
  handleScroll,
})
