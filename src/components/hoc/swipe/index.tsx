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
    useEffect(() => {
      if (el.current) {
        new SwipeManager(el.current, {
          DISTANCE_THRESHOLD,
          ANGLE_THREHOLD,
          LIMIT_THRESHOLD,
          RELEASE_THRESHOLD,
          onGrab,
          onGrabing,
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
