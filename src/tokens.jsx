import React from 'react'
import styled from 'styled-components'

import { colors } from './constants'

const round = num => Math.round(num * 100) / 100

const Root = styled.div`
  display: flex;
`

const Token = styled.div`
  background: ${props => props.color};
  margin: 0 4px;
  padding: 2px 4px;
`

const VariableToken = ({ token }) => (
  <Token color={colors.variable}>{token.name}</Token>
)

const ConstantToken = ({ token }) => (
  <Token color={colors.constant}>{round(token.value)}</Token>
)

const EqualsToken = () => <Token color={colors.equals}>=</Token>

const SumToken = () => <Token color={colors.operation}>+</Token>
const MultiplicationToken = () => <Token color={colors.operation}>*</Token>
const SubstractionToken = () => <Token color={colors.operation}>-</Token>
const DivisionToken = () => <Token color={colors.operation}>/</Token>

const Tokens = ({ tokens }) => {
  return (
    <Root>
      {tokens.map((token, i) => {
        switch (token.type) {
          case 'equals':
            return <EqualsToken key={i} token={token} />
          case 'constant':
            return <ConstantToken key={i} token={token} />
          case 'variable':
            return <VariableToken key={i} token={token} />
          case 'sum':
            return <SumToken key={i} token={token} />
          case 'division':
            return <DivisionToken key={i} token={token} />
          case 'multiplication':
            return <MultiplicationToken key={i} token={token} />
          case 'substraction':
            return <SubstractionToken key={i} token={token} />
        }
      })}
    </Root>
  )
}

export default Tokens
