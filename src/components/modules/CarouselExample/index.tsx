/* eslint-disable no-nested-ternary, no-mixed-operators, no-unused-expressions, */
import React, { useCallback, useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { View, Image } from '../../foundation'
import { withAspectRatio } from '../../hoc'
import { Carousel, SwipeController } from '../Carousel'

const DEFAIULT_PICT_RATIO = 1.3333
const FixedRatio = withAspectRatio(DEFAIULT_PICT_RATIO)(View)

const ImageBG = styled(View)({
  backgroundColor: '#eee',
})

const data = Array.from(Array(4)).map(() => {
  return {
    src:
      'http://switch-box.net/wp-content/uploads/2012/12/free-wallpaper-social-wallpapering-02.jpg',
  }
})

export const CarouselExample = () => {
  const [displayNum, setdisplayNum] = useState(1)
  const [moveNum, setmoveNum] = useState(1)
  const [displayWidth, setdisplayWidth] = useState('80%')

  const swipeable = useRef<SwipeController>()

  const resolveState = () => {
    if (window.innerWidth > 786) {
      setdisplayNum(2)
      setmoveNum(2)
      setdisplayWidth('80%')
    } else {
      setdisplayNum(1)
      setmoveNum(1)
      setdisplayWidth('100%')
    }
  }

  useEffect(() => {
    resolveState()
    window.addEventListener('resize', () => {
      resolveState()
    })
  }, [])

  return (
    <>
      <button onClick={() => swipeable.current?.prev()}>prev</button>
      <button onClick={() => swipeable.current?.next()}>next</button>
      <Carousel
        ref={swipeable}
        displayNum={displayNum}
        moveNum={moveNum}
        displayWidth={displayWidth}
        keyExtractor={(_, i) => `${i}`}
        data={data}
        item={({ src }, i) => {
          return (
            <ImageBG key={i}>
              <FixedRatio>
                <Image style={{ objectFit: 'cover' }} src={src} />
              </FixedRatio>
            </ImageBG>
          )
        }}
      />
    </>
  )
}
