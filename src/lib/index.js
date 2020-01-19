import { astToCircuit } from './ast-to-circuit.js'
import { solveCircuit } from './solve-circuit.js'
import { lexer } from './lexer.js'
import { parser } from './parser.js'
import { printTree } from './print-tree.js'
import { printCircuit } from './print-circuit.js'

const solve = (equationString, initialVariables) => {
  const tokens = lexer(equationString)
  const ast = parser(tokens)

  const [circuit] = astToCircuit(ast)

  const variables = solveCircuit(circuit, initialVariables)
  return variables
}

console.log(solve('2+a*3=5*b', { b: 3 }).a === 4.333333333333333)
console.log(solve('3*c+3*a=d', { c: 3, a: 2 }).d === 15)
console.log(solve('3*c+3*a=d*2', { c: 3, a: 2 }).d === 7.5)
console.log(
  solve('2+2+2*2*a+b=c*2+1', { c: 3, b: 1.6 }).a === (7 - 1.6 - 4) / 4
)
console.log(solve('3+a*8=2+b*3.6', { a: 5 }).b === (5 * 8 + 3 - 2) / 3.6)
console.log(solve('3.533333=b*3.533333', {}).b === 1)


console.log(solve('5-4-1=b-2.21', {}).b === 2.21)


console.log(solve('5/c=44.1', {}).c === 5/44.1)


console.log(solve('4+x/4+4=0', {}).x === -8*4)

console.log(solve('5-x=10', {}).x === -5)
console.log(solve('x-5=10', {}).x === 15)

console.log(solve('5-4=x', {}).x === 1)
console.log(solve('4-5=x', {}).x === -1)

console.log(solve('5/x=10', {}).x === 0.5)
console.log(solve('x/5=10', {}).x === 50)
