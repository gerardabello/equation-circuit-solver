import React, { useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import Explanation from './explanation'

const GlobalStyle = createGlobalStyle`
  html, body, #root{
    background: black;
    color: white;
  }
`

const Root = styled.div``

const App = () => {
  const [equationString, setEquationString] = useState('10/x=5')

  return (
    <Root>
      <GlobalStyle />
      <input
        type="text"
        value={equationString}
        onChange={e => setEquationString(e.target.value)}
      />
      <Explanation equationString={equationString} />
    </Root>
  )
}

export default App
