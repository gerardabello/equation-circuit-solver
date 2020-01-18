const ID = () =>
  Math.random()
    .toString(36)
    .substr(2, 9)

const addBoxToCircuit = (circuit, box) => ({
  ...circuit,
  boxes: [...circuit.boxes, box]
})

const createConnection = (connector1, connector2) => ({
  id: ID(),
  connector1,
  connector2
})

const createSumBox = () => ({
  type: 'sum',
  id: ID(),
  connectors: [ID(), ID(), ID()]
})

const createMultiplication = () => ({
  type: 'multiplication',
  id: ID(),
  connectors: [ID(), ID(), ID()]
})

const createConstantBox = value => ({
  type: 'constant',
  id: ID(),
  value,
  connectors: [ID()]
})

const createVariableBox = name => ({
  type: 'variable',
  id: ID(),
  name,
  connectors: [ID()]
})

const addConnectionToCircuit = (circuit, connection) => ({
  ...circuit,
  connections: [...circuit.connections, connection]
})

const mergeCircuits = (circuit1, circuit2) => ({
  boxes: [...circuit1.boxes, ...circuit2.boxes],
  connections: [...circuit1.connections, ...circuit2.connections]
})

export const astToCircuit = ast => {
  switch (ast.type) {
    case 'equals': {
      const [circuit1, looseConnector1] = astToCircuit(ast.children[0])
      const [circuit2, looseConnector2] = astToCircuit(ast.children[1])
      let circuit = mergeCircuits(circuit1, circuit2)
      circuit = addConnectionToCircuit(
        circuit,
        createConnection(looseConnector1, looseConnector2)
      )

      return [circuit, null]
    }
    case 'sum': {
      const [circuit1, looseConnector1] = astToCircuit(ast.children[0])
      const [circuit2, looseConnector2] = astToCircuit(ast.children[1])
      const box = createSumBox()
      let circuit = mergeCircuits(circuit1, circuit2)
      circuit = addBoxToCircuit(circuit, box)

      circuit = addConnectionToCircuit(
        circuit,
        createConnection(looseConnector1, box.connectors[0])
      )

      circuit = addConnectionToCircuit(
        circuit,
        createConnection(looseConnector2, box.connectors[1])
      )

      return [circuit, box.connectors[2]]
    }
    case 'multiplication': {
      const [circuit1, looseConnector1] = astToCircuit(ast.children[0])
      const [circuit2, looseConnector2] = astToCircuit(ast.children[1])
      const box = createMultiplication()
      let circuit = mergeCircuits(circuit1, circuit2)
      circuit = addBoxToCircuit(circuit, box)

      circuit = addConnectionToCircuit(
        circuit,
        createConnection(looseConnector1, box.connectors[0])
      )

      circuit = addConnectionToCircuit(
        circuit,
        createConnection(looseConnector2, box.connectors[1])
      )

      return [circuit, box.connectors[2]]
    }
    case 'constant': {
      let circuit = { connections: [], boxes: [] }
      const box = createConstantBox(ast.value)
      circuit = addBoxToCircuit(circuit, box)

      return [circuit, box.connectors[0]]
    }
    case 'variable': {
      let circuit = { connections: [], boxes: [] }
      const box = createVariableBox(ast.name)
      circuit = addBoxToCircuit(circuit, box)

      return [circuit, box.connectors[0]]
    }
  }

  throw new Error(`Unknown AST token: ${ast.type}`)
}
