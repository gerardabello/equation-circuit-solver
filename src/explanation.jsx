import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { astToCircuit } from './lib/ast-to-circuit.js'
import { solveCircuit } from './lib/solve-circuit.js'
import { lexer } from './lib/lexer.js'
import { parser } from './lib/parser.js'
import { printTree } from './lib/print-tree.js'
import { printCircuit } from './lib/print-circuit.js'

import Tokens from './tokens'

const Pre = styled.pre`
  font-family: inherit;
  margin: 0;
`

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Spacer = styled.div`
  height: ${props => props.size * 8}px;
`

const Arrow = styled.div`
  font-size: 32px;
  color: #353535;
`

const Separator = () => (
  <React.Fragment>
    <Spacer size={4} />
    <Arrow>🡫</Arrow>
    <Spacer size={4} />
  </React.Fragment>
)

const Explanation = ({ equationString }) => {
  const statesRef = useRef([])
  const [stateIndex, setStateIndex] = useState(0)
  const [state, setState] = useState('initial')
  const [tokens, setTokens] = useState(null)
  const [ast, setAst] = useState(null)
  const [circuit, setCircuit] = useState(null)
  const [variables, setVariables] = useState(null)

  const initialVariables = {}

  useEffect(() => {
    try {
      statesRef.current = []
      const t = lexer(equationString)
      const a = parser(t)
      const [c] = astToCircuit(a)
      const v = solveCircuit(
        c,
        initialVariables,
        state => (statesRef.current = [...statesRef.current, state])
      )

      setTokens(t)
      setAst(a)
      setCircuit(c)
      setVariables(v)
      setStateIndex(0)
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
      <Separator />
      <Tokens tokens={tokens} />
      <Separator />
      <div>
        <Pre>{printTree(ast, true)}</Pre>
      </div>
      <Separator />

      <div
        dangerouslySetInnerHTML={{
          __html: printCircuit(circuit, statesRef.current[stateIndex])
        }}
      />
      <input
        type="range"
        min="0"
        value={stateIndex}
        max={statesRef.current.length - 1}
        step="1"
        onChange={e => setStateIndex(e.target.value)}
      />

      <Separator />
      <p>x = {variables.x}</p>
      <Spacer size={4} />
    </Root>
  )
}

export default Explanation
