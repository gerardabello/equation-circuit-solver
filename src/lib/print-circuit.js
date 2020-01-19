import nomnoml from 'nomnoml'
import { colors } from '../constants'

const serializeBox = box => {
  if (box.type === 'constant') {
  return `[<${box.type}>${box.id}|${box.value}]`
  }

  if (box.type === 'variable') {
  return `[<${box.type}>${box.id}|${box.name}]`
  }
  return `[<${box.type}>${box.id}|${box.type}]`
}

const serializeConnection = (circuit, connection) => {
  const box1 = circuit.boxes.find(b =>
    b.connectors.includes(connection.connector1)
  )
  const box2 = circuit.boxes.find(b =>
    b.connectors.includes(connection.connector2)
  )

  return `${serializeBox(box1)}--${serializeBox(box2)}`
}

export const printCircuit = circuit => {
  const connections = circuit.connections
    .map(c => serializeConnection(circuit, c))
    .join('\n')

  const src = 
    `
#font: inherit
#stroke: white
#fill: #00000000
#lineWidth: 1
#.variable: fill=${colors.variable}
#.constant: fill=${colors.constant}
#.sum: fill=${colors.operation}
#.division: fill=${colors.operation}
#.substraction: fill=${colors.operation}
#.multiplication: fill=${colors.operation}
${connections}
    `
  console.log(src)

  return nomnoml.renderSvg(
    src
  )
}
