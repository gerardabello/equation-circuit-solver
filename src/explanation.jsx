import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { astToCircuit } from './lib/ast-to-circuit.js'
import { solveCircuit } from './lib/solve-circuit.js'
import { lexer } from './lib/lexer.js'
import { parser } from './lib/parser.js'
import { printTree } from './lib/print-tree.js'
import { printCircuit } from './lib/print-circuit.js'

const Root = styled.div``

const Explanation = ({ equationString }) => {
  const [state, setState] = useState('initial')
  const [tokens, setTokens] = useState(null)
  const [ast, setAst] = useState(null)
  const [circuit, setCircuit] = useState(null)
  const [variables, setVariables] = useState(null)

  const initialVariables = {}

  useEffect(() => {
    try {
      const t = lexer(equationString)
      const a = parser(t)
      const [c] = astToCircuit(a)

      setTokens(t)
      setAst(a)
      setCircuit(c)
      setVariables(solveCircuit(c, initialVariables))
      setState('ok')
    } catch (e) {
      console.error(e)
      setState('error')
    }
  }, [equationString])

  if (state === 'initial') return null
  if (state === 'error') return <div>Could not parse</div>
  if (variables.x == null) return <div>Could not solve</div>

  return (
    <Root>
      <div>{JSON.stringify(tokens)}</div>
      <div>
        <pre>{printTree(ast, true)}</pre>
      </div>

      <div dangerouslySetInnerHTML={{ __html: printCircuit(circuit) }} />
      <p>x = {variables.x}</p>
    </Root>
  )
}

export default Explanation
