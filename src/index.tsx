import React from 'react'
import { render } from 'react-dom'
import { CarouselExample } from './components/modules/CarouselExample'

const App = () => (
  <>
    <CarouselExample />
  </>
)

render(<App />, document.getElementById('app'))
