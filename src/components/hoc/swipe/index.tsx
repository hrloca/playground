/* eslint-disable no-unused-expressions */
import React, { useRef, useEffect, FC } from 'react'
import { SwipeManager, SwipeManagerOption } from '../../../libs/SwipeManager'

interface SwipableComponentProps extends SwipeManagerOption {}

export const withSwipable = <P extends {}>(
  Component: React.ComponentType<P>
): FC<P & SwipableComponentProps> => {
  return ({
    children,
    DISTANCE_THRESHOLD,
    ANGLE_THREHOLD,
    LIMIT_THRESHOLD,
    RELEASE_THRESHOLD,
    onGrab,
    onGrabing,
    onGrabEnd,
    onSwipeUp,
    onSwipeDown,
    onSwipeRight,
    onSwipeLeft,
    onSwipeUpAuto,
    onSwipeDownAuto,
    onSwipeRightAuto,
    onSwipeLeftAuto,
    ...otherProps
  }) => {
    const el = useRef(null)
    const swipe = useRef<SwipeManager>()
    useEffect(() => {
      if (el.current) {
        swipe.current?.removeEvent()
        swipe.current = new SwipeManager(el.current, {
          DISTANCE_THRESHOLD,
          ANGLE_THREHOLD,
          LIMIT_THRESHOLD,
          RELEASE_THRESHOLD,
          onGrab,
          onGrabing,
          onGrabEnd,
          onSwipeUp,
          onSwipeDown,
          onSwipeRight,
          onSwipeLeft,
          onSwipeUpAuto,
          onSwipeDownAuto,
          onSwipeRightAuto,
          onSwipeLeftAuto,
        })
      }
    }, [el.current])
    return (
      <Component ref={el} {...(otherProps as P)}>
        {children}
      </Component>
    )
  }
}
