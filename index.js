import { astToCircuit } from './ast-to-circuit.js'
import { solveCircuit } from './solve-circuit.js'
import { parser } from './parser.js'

const solve = (equationString, initialVariables) => {
  const ast = parser(equationString)
  // console.log(JSON.stringify(ast, null, 4))

  const [circuit] = astToCircuit(ast)
  // console.log(JSON.stringify(circuit, null, 4))
  const variables = solveCircuit(circuit, initialVariables)
  // console.log(variables)
  return variables
}

console.log(solve('2+a*3=5*b', { b: 3 }).a === 4.333333333333333)
console.log(solve('3*c+3*a=d', { c: 3, a: 2 }).d === 15)
console.log(solve('3*c+3*a=d*2', { c: 3, a: 2 }).d === 7.5)
console.log(
  solve('2+2+2*2*a+b=c*2+1', { c: 3, b: 1.6 }).a === (7 - 1.6 - 4) / 4
)

console.log(solve('3+a*8=2+b*3.6', { a: 5 }))
console.log(solve('3.533333=b*3.533333', {}))
