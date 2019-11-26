import React from 'react'
import { render } from 'react-dom'
import styled from 'styled-components'
import { View, Image } from './components/foundation'
import { withAspectRatio } from './components/hoc'

const DEFAIULT_PICT_RATIO = 1.3333
const FixedRatio = withAspectRatio(DEFAIULT_PICT_RATIO)(View)

const ImageBG = styled(View)({
  backgroundColor: '#eee',
})

const App = () => (
  <>
    {Array.from(Array(20)).map((_, i) => {
      return (
        <ImageBG key={i}>
          <FixedRatio>
            <Image
              lazy
              style={{ objectFit: 'cover' }}
              src="http://switch-box.net/wp-content/uploads/2012/12/free-wallpaper-social-wallpapering-02.jpg"
            />
          </FixedRatio>
        </ImageBG>
      )
    })}
  </>
)

render(<App />, document.getElementById('app'))
