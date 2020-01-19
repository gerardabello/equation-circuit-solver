import React, { useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import Explanation from './explanation'

const GlobalStyle = createGlobalStyle`
  html, body, #root{
    background: black;
    color: white;
  }
`

const Spacer = styled.div`
  height: ${props => props.size * 8}px;
`

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Input = styled.input`
  background: #212121;
  border: 1px solid #5a5a5a;

  color: white;
  padding: 4px 8px;
  font-size: 28px;
  font-family: inherit;
  outline: none;
  text-align: center;
`

const App = () => {
  const [equationString, setEquationString] = useState('10/x=5')

  return (
    <Root>
      <GlobalStyle />
      <Spacer size={10} />
      <Input
        type="text"
        value={equationString}
        onChange={e => setEquationString(e.target.value)}
      />
      <Explanation equationString={equationString} />
    </Root>
  )
}

export default App
