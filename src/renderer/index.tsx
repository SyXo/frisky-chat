import * as React from 'react'
import * as ReactDOM from 'react-dom'

const { useState } = React

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
  const [poolImages, setPoolImages] = useState([])

  const routing = {
    route,
    setRoute,
    id,
    setID,
    poolImages,
    setPoolImages,
    imagesLength,
    setImagesLength,
  }

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
