import React, { useState, useEffect, useRef, ImgHTMLAttributes } from 'react'
import IntersectManager from '../../../libs/IntersectManager'

const FALLBACK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  onApplySource?: () => void
  lazy?: boolean
}

export type ImageElementEvent = React.SyntheticEvent<HTMLImageElement, Event>
type Callback = (e: ImageElementEvent) => void

export const Image: React.FC<ImageProps> = React.memo(props => {
  const { onApplySource, src, lazy, onLoad, onError, ...other } = props
  const originalSrc = src || undefined
  const isLazy = props.lazy || false
  const resolveSrc = () => (isLazy ? FALLBACK_IMAGE : originalSrc)
  const [source, setSrc] = useState(resolveSrc())
  const elm = useRef<HTMLImageElement>(null)
  const intersectManager = useRef<IntersectManager>()

  const unobserveIntersectManager = () => {
    if (intersectManager.current !== undefined) {
      intersectManager.current.unobserve()
    }
  }

  const createEventHandler = (callback: Callback) => (e: ImageElementEvent) => {
    if (source === FALLBACK_IMAGE) return
    callback(e)
  }

  const onLoadHandler = createEventHandler((e: ImageElementEvent) => {
    unobserveIntersectManager()
    if (onLoad) onLoad(e)
  })

  const onErrorHandler = createEventHandler((e: ImageElementEvent) => {
    setSrc(FALLBACK_IMAGE)
    if (onError) onError(e)
  })

  useEffect(() => {
    if (onApplySource && source === originalSrc) {
      onApplySource()
    }
  }, [source])

  useEffect(() => {
    setSrc(resolveSrc())
    if (isLazy) {
      unobserveIntersectManager()
      if (elm && elm.current && originalSrc) {
        intersectManager.current = new IntersectManager(elm.current)
        intersectManager.current.regist(() => {
          setSrc(originalSrc)
        })
        intersectManager.current.observe()
      }
    }
  }, [src])

  return <img ref={elm} src={source} onLoad={onLoadHandler} onError={onErrorHandler} {...other} />
})
