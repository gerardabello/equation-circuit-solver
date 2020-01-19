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
  padding: 0 16px;
`

const Description = styled.h2`
  text-align: center;
`

const Note = styled.p`
  text-align: center;
`

const A = styled.a`
  color: inherit;
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
      <Spacer size={4} />
      <Description>
        Equation parser and solver using propagation of contraints
      </Description>
      <Note>
        Idea from{' '}
        <A href="https://mitpress.mit.edu/sites/default/files/sicp/full-text/book/book-Z-H-22.html#%_sec_3.3.5">
          SICP 3.3.5
        </A>
      </Note>
      <Note>
        Solves equations with an x variable. <br /> The x variable cannot appear
        more than once for the solver to work.
      </Note>
      <Spacer size={4} />
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
