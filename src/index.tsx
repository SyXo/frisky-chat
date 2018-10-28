import * as React from 'react'
import * as ReactDOM from 'react-dom'

// @ts-ignore
const { useState, useEffect } = React

import {
  GlobalStyle,
  NotFound,
  PoolContainer,
  ImageContainer,
} from './components'

const Router: React.SFC<{}> = () => {
  const [route, setRoute] = useState('pool')
  const [id, setID] = useState('0')
  const [imagesLength, setImagesLength] = useState(0)

  const routing = { route, setRoute, id, setID, imagesLength, setImagesLength }

  switch (route) {
    case 'pool':
      return <PoolContainer {...routing} />
    case 'image':
      return <ImageContainer {...routing} />
    default:
      return <NotFound />
  }
}

const App: React.SFC<{}> = () => (
  <>
    <Router />
    <GlobalStyle />
  </>
)

ReactDOM.render(<App />, document.getElementById('root'))
