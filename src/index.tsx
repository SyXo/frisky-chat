import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { GlobalStyle, NotFound, PoolContainer } from './components'

const Router: React.SFC<{}> = () => {
  // @ts-ignore
  const [route, setRoute] = React.useState('pool')

  switch (route) {
    case 'pool':
      return <PoolContainer />
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
