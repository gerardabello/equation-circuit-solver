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
  font-size: 14px;
  margin: 0;
`

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const Circuit = styled.div`
  width: 100%;

  & svg {
    width: 100%;
  }
`

const Spacer = styled.div`
  height: ${props => props.size * 8}px;
`

const Arrow = styled.div`
  font-size: 40px;
  color: #353535;
`

const Separator = () => (
  <React.Fragment>
    <Spacer size={4} />
    <Arrow>↓</Arrow>
    <Spacer size={4} />
  </React.Fragment>
)

const Explanation = ({ equationString }) => {
  const statesRef = useRef([])

  const [statePlayer, setStatePlayer] = useState(true)
  const [stateIndex, setStateIndex] = useState(0)
  const [tokens, setTokens] = useState(null)
  const [ast, setAst] = useState(null)
  const [circuit, setCircuit] = useState(null)
  const [variables, setVariables] = useState(null)

  const initialVariables = {}

  useEffect(() => {
    if (statePlayer) {
      const interval = setInterval(() => {
        setStateIndex(index => {
          if (index === statesRef.current.length - 1) {
            return 0
          }

          return index + 1
        })
      }, 1000)
      return () => {
        clearInterval(interval)
      }
    }
  }, [statesRef.current, statePlayer])

  useEffect(() => {
    statesRef.current = []
    setTokens(null)
    setAst(null)
    setCircuit(null)
    setStateIndex(0)
    setVariables(null)

    try {
      const t = lexer(equationString)
      setTokens(t)
      const a = parser(t)
      setAst(a)
      const [c] = astToCircuit(a, true)
      setCircuit(c)
      const v = solveCircuit(
        c,
        initialVariables,
        state => (statesRef.current = [...statesRef.current, state])
      )
      setVariables(v)
    } catch (e) {}
  }, [equationString])

  return (
    <Root>
      <Separator />
      {tokens && tokens.length > 0 ? (
        <Tokens tokens={tokens} />
      ) : (
        <div>Could not perform lexical analysis</div>
      )}

      <Separator />
      {ast ? (
        <div>
          <Pre>{printTree(ast, true)}</Pre>
        </div>
      ) : (
        <div>Could not parse tokens into AST</div>
      )}
      <Separator />

      {circuit && circuit.connections.length > 0 ? (
        <Circuit
          dangerouslySetInnerHTML={{
            __html: printCircuit(circuit, statesRef.current[stateIndex])
          }}
        />
      ) : (
        <div>Could not generate circuit from AST</div>
      )}

      <Separator />
      {variables && variables.x ? (
        <p>x = {variables.x}</p>
      ) : (
        <div>Could not find solution for x</div>
      )}
      <Spacer size={4} />
    </Root>
  )
}

export default Explanation
