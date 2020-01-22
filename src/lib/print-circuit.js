import nomnoml from 'nomnoml'
import { colors } from '../constants'

const round = num => Math.round(num * 100) / 100

const serializeBox = box => {
  if (box.type === 'constant') {
  return `[<${box.type}>${box.id}|${round(box.value)}]`
  }

  if (box.type === 'variable') {
  return `[<${box.type}>${box.id}|${box.name}]`
  }
  return `[<${box.type}>${box.id}|${box.type}]`
}

const serializeConnection = (circuit, connection, state = {}) => {
  const box1 = circuit.boxes.find(b =>
    b.connectors.includes(connection.connector1)
  )
  const box2 = circuit.boxes.find(b =>
    b.connectors.includes(connection.connector2)
  )

  const connectionValue = state[connection.id]

  if (connectionValue) {
  return `${serializeBox(box1)}- ${round(connectionValue)}${serializeBox(box2)}`
  }

  return `${serializeBox(box1)}--${serializeBox(box2)}`
}

export const printCircuit = (circuit, state) => {
  const connections = circuit.connections
    .map(c => serializeConnection(circuit, c, state))
    .join('\n')

  const src = 
    `
#spacing: 28
#font: Share Tech Mono
#edgeMargin: 8
#stroke: white
#fill: #00000000
#lineWidth: 1
#direction: right
#.variable: fill=${colors.variable}
#.constant: fill=${colors.constant}
#.sum: fill=${colors.operation}
#.division: fill=${colors.operation}
#.substraction: fill=${colors.operation}
#.multiplication: fill=${colors.operation}
${connections}
    `

  return nomnoml.renderSvg(
    src
  ).replace(/height="\d*"/,'').replace(/width="\d*"/,'')

}
