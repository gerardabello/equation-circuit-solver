import React, { useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import { astToCircuit } from './lib/ast-to-circuit.js'
import { solveCircuit } from './lib/solve-circuit.js'
import { lexer } from './lib/lexer.js'
import { parser } from './lib/parser.js'
import { printTree } from './lib/print-tree.js'
import { printCircuit } from './lib/print-circuit.js'

const GlobalStyle = createGlobalStyle`
  html, body, #root{
    background: black;
    color: white;
  }
`

const Root = styled.div``

const App = () => {
  const [equationString, setEquationString] = useState('x+3*4=10')
  const initialVariables = {}

  const tokens = lexer(equationString)
  const ast = parser(tokens)

  const [circuit] = astToCircuit(ast)

  const variables = solveCircuit(circuit, initialVariables)

  return (
    <Root>
      <GlobalStyle />
      <input
        type="text"
        value={equationString}
        onChange={e => setEquationString(e.target.value)}
      />
      <div>{JSON.stringify(tokens)}</div>
      <div>
        <pre>{printTree(ast, true)}</pre>
      </div>
      <div dangerouslySetInnerHTML={{ __html: printCircuit(circuit) }} />
      <p>x = {variables.x}</p>
    </Root>
  )
}

export default App
