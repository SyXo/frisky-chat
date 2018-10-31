import * as React from 'react'
import * as ReactDOM from 'react-dom'

const { useState } = React

import {
  GlobalStyle,
  NotFound,
  PoolContainer,
  ImageContainer,
} from './components'

document.addEventListener('keydown', function(e) {
  if (e.which === 123) {
    require('remote')
      .getCurrentWindow()
      .toggleDevTools()
  } else if (e.which === 116) {
    location.reload()
  }
})

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
