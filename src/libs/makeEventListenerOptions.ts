export const makeEventListenerOptions = (opts: AddEventListenerOptions) => {
  try {
    const passiveOpt = Object.defineProperty({}, 'passive', {
      get() {
        passiveOpt.passive = true
      },
    })
    window.addEventListener('test', () => {}, passiveOpt)
    return opts
  } catch (e) {
    return opts.capture
  }
}
