const getConnectionByConnector = (circuit, connectorId) =>
  circuit.connections.find(
    c => c.connector1 === connectorId || c.connector2 === connectorId
  )

const getConnectorValue = (state, circuit, connectorId) => {
  const connection = getConnectionByConnector(circuit, connectorId)
  return state[connection.id]
}

const multiplicationOperation = {
  forwards: (a,b) => a * b,
  backwards1: (a,b) => a / b,
  backwards2: (a,b) => a / b,
}

const sumOperation = {
  forwards: (a,b) => a + b,
  backwards1: (a,b) => a - b,
  backwards2: (a,b) => a - b,
}

const substractionOperation = {
  forwards: (a,b) => a - b,
  backwards1: (a,b) => a + b,
  backwards2: (a,b) => b - a,
}

const divisionOperation = {
  forwards: (a,b) => a / b,
  backwards1: (a,b) => a * b,
  backwards2: (a,b) => b / a,
}

const getOperation = type => {
  if (type === 'sum') {
    return sumOperation
  }

  if (type === 'substraction') {
    return substractionOperation
  }

  if (type === 'multiplication') {
    return multiplicationOperation
  }

  if (type === 'division') {
    return divisionOperation
  }
}

const updateOperationBox= (state, circuit, box, onStateChange) => {
  const operation = getOperation(box.type)


  const val1 = getConnectorValue(state, circuit, box.connectors[0])
  const val2 = getConnectorValue(state, circuit, box.connectors[1])
  const result = getConnectorValue(state, circuit, box.connectors[2])

  if (val1 != null && val2 != null && result != null) {
    if (result !== operation.forwards(val1, val2)) {
      throw new Error(`${box.type} operation not met`)
    }
    return state
  } else if ([val1, val2, result].filter(v => v == null).length > 1) {
    // cannot resolve yet, nothing to do
    //
    return state
  }

  // In rules below we can asume only one value is missing

  if (val1 == null) {
    return setConnectorValue(state, circuit, box.connectors[0], operation.backwards1(result,val2),onStateChange)
  } else if (val2 == null) {
    return setConnectorValue(state, circuit, box.connectors[1], operation.backwards2(result,val1),onStateChange)
  } else if (result == null) {
    return setConnectorValue(state, circuit, box.connectors[2], operation.forwards(val1, val2),onStateChange)
  }

  throw new Error('Should not get here')
}

const updateBox = (state, circuit, boxId, onStateChange) => {
  const box = circuit.boxes.find(b => b.id === boxId)

  switch (box.type) {
    case 'constant':
      // throw new Error('Should not update a constant')
      return state
    case 'variable':
      // Nothing to do, will fetch value from connection at the end
      return state
    case 'sum': 
    case 'multiplication':
    case 'division':
    case 'substraction':
      return updateOperationBox(state, circuit, box, onStateChange)
  }
  throw new Error('Should not get here')
}

const setConnectionValue = (
  state,
  circuit,
  connectionId,
  sourceConnectorId,
  value,
  onStateChange
) => {
  if (state[connectionId] != null && state[connectionId] !== value) {
    throw new Error(
      `Contradiction: trying to put ${value} into connection with value ${state[connectionId]}`
    )
  }

  const newState = { ...state, [connectionId]: value }

  onStateChange(newState)

  const connection = circuit.connections.find(c => c.id === connectionId)
  const affectedConnector =
    connection.connector1 === sourceConnectorId
      ? connection.connector2
      : connection.connector2 === sourceConnectorId
      ? connection.connector1
      : null
  if (!affectedConnector) {
    throw new Error('Could not find source connector in connection')
  }
  const affectedBox = circuit.boxes.find(b =>
    b.connectors.includes(affectedConnector)
  )

  if (!affectedBox) {
    throw new Error('Could not find affected box')
  }

  return updateBox(newState, circuit, affectedBox.id, onStateChange)
}

const setConnectorValue = (state, circuit, connectorId, value, onStateChange) => {
  const connection = getConnectionByConnector(circuit, connectorId)
  return setConnectionValue(state, circuit, connection.id, connectorId, value, onStateChange)
}

export const solveCircuit = (circuit, initialVariables, onStateChange = () => {}) => {
  // state = {[connectionId]: value}
  let state = {}
  onStateChange(state)

  {
    const constantBoxes = circuit.boxes.filter(b => b.type === 'constant')
    for (const box of constantBoxes) {
      const connectorId = box.connectors[0]
      state = setConnectorValue(state, circuit, connectorId, box.value, onStateChange)
    }
  }
  {
    const variableBoxes = circuit.boxes.filter(b => b.type === 'variable')
    for (const box of variableBoxes) {
      const value = initialVariables[box.name]
      if (value) {
        const connectorId = box.connectors[0]
        state = setConnectorValue(state, circuit, connectorId, value,onStateChange)
      }
    }
  }

  // SHOULD BE SOLVED

  const variables = {}
  {
    const variableBoxes = circuit.boxes.filter(b => b.type === 'variable')
    for (const box of variableBoxes) {
      const connectorId = box.connectors[0]
      const connection = getConnectionByConnector(circuit, connectorId)
      variables[box.name] = state[connection.id]
    }
  }

  return variables
}
