/* eslint-disable no-nested-ternary, no-mixed-operators, no-unused-expressions, */
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useCallback,
} from 'react'
import styled from 'styled-components'
import { View } from '../../foundation'
import { withSwipable } from '../../hoc'
import { SwipeController } from './SwipeController'

export { SwipeController }

export interface CarouselProps<T> {
  ref: any
  keyExtractor: (arg: T, index: number) => string
  data: T[]
  item: (arg: T, index: number) => React.ReactNode
  displayNum?: number
  moveNum?: number
  displayWidth?: string | number
}

const CarouselComponent = <T extends any>(
  {
    keyExtractor,
    data,
    item,
    displayNum = 1,
    moveNum = 1,
    displayWidth = '100%',
  }: CarouselProps<T>,
  ref: React.Ref<SwipeController | undefined>
) => {
  const trackElm = useRef() as React.MutableRefObject<HTMLDivElement>
  const trackElm2 = useRef() as React.MutableRefObject<HTMLDivElement>
  const trackElm3 = useRef() as React.MutableRefObject<HTMLDivElement>
  const swipeable = useRef<SwipeController>()
  const [swipeCtrl, setSwipeCtrl] = useState(swipeable.current)

  const totalNum = data.length

  useEffect(() => {
    swipeable.current = new SwipeController(
      [trackElm.current, trackElm2.current, trackElm3.current],
      totalNum,
      displayNum,
      moveNum
    )
    setSwipeCtrl(swipeable.current)
  }, [moveNum, totalNum, displayNum])

  const onSwipeLeft = useCallback(() => swipeable.current?.handleNext(), [
    swipeable.current,
  ])
  const onSwipeRight = useCallback(() => swipeable.current?.handlePrev(), [
    swipeable.current,
  ])
  const onGrab = useCallback(() => swipeable.current?.handleStart(), [
    swipeable.current,
  ])
  const onGrabEnd = useCallback(() => swipeable.current?.handleEnd(), [
    swipeable.current,
  ])
  const onGrabing = useCallback(
    (e, { point }, isOver, axis) => {
      if (axis === 'x') {
        e.preventDefault()
        swipeable.current?.handle(point.x, isOver)
      }
    },
    [swipeable.current]
  )

  useImperativeHandle(ref, () => swipeCtrl)

  return (
    <>
      <Wrap>
        <Display
          displayWidth={displayWidth}
          onSwipeLeft={onSwipeLeft}
          onSwipeRight={onSwipeRight}
          onGrab={onGrab}
          onGrabEnd={onGrabEnd}
          onGrabing={onGrabing}
        >
          <Track
            style={{ backgroundColor: '#ff0' }}
            ref={trackElm}
            displayNum={displayNum}
          >
            {data.map((_data, i) => (
              <List key={keyExtractor(_data, i)}>{item(_data, i)}</List>
            ))}
          </Track>
          <Track
            style={{ backgroundColor: '#f00' }}
            ref={trackElm2}
            displayNum={displayNum}
          >
            {data.map((_data, i) => (
              <List key={keyExtractor(_data, i)}>{item(_data, i)}</List>
            ))}
          </Track>
          <Track
            style={{ backgroundColor: '#f0f' }}
            ref={trackElm3}
            displayNum={displayNum}
          >
            {data.map((_data, i) => (
              <List key={keyExtractor(_data, i)}>{item(_data, i)}</List>
            ))}
          </Track>
        </Display>
      </Wrap>
    </>
  )
}

export const Carousel = forwardRef(
  CarouselComponent
) as typeof CarouselComponent

const Wrap = styled(View)({
  flexDirection: 'row',
  alignContent: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  width: '100%',
})

const Display = withSwipable(
  styled(View)<{ displayWidth: string | number }>(({ displayWidth }) => ({
    flexDirection: 'row',
    width: displayWidth,
  }))
)

const Track = styled(View)<{ displayNum: number }>(({ displayNum }) => ({
  flexDirection: 'row',
  height: '100%',
  width: `${100 / displayNum}%`,
  '& > *': {
    opacity: 0.3,
  },
}))

const List = styled(View)({
  backgroundColor: '#fff',
  height: '100%',
  width: '100%',
})
