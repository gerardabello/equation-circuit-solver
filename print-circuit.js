import nomnoml from 'nomnoml'

const serializeBox = box => `[${box.id}|${box.type}]`
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
  const src = circuit.connections
    .map(c => serializeConnection(circuit, c))
    .join('\n')

  return nomnoml.renderSvg(src)
}
