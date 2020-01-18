const getConnectionByConnector = (circuit, connectorId) =>
  circuit.connections.find(
    c => c.connector1 === connectorId || c.connector2 === connectorId
  )

const getConnectorValue = (state, circuit, connectorId) => {
  const connection = getConnectionByConnector(circuit, connectorId)
  return state[connection.id]
}

const updateMultiplicationBox = (state, circuit, box) => {
  const val1 = getConnectorValue(state, circuit, box.connectors[0])
  const val2 = getConnectorValue(state, circuit, box.connectors[1])
  const result = getConnectorValue(state, circuit, box.connectors[2])

  if (val1 != null && val2 != null && result != null) {
    if (result !== val1 * val2) {
      throw new Error('Multiplication not met')
    }
    return state
  } else if ([val1, val2, result].filter(v => v == null).length > 1) {
    // cannot resolve yet, nothing to do
    //
    return state
  }

  // In rules below we can asume only one value is missing

  if (val1 == null) {
    return setConnectorValue(state, circuit, box.connectors[0], result / val2)
  } else if (val2 == null) {
    return setConnectorValue(state, circuit, box.connectors[1], result / val1)
  } else if (result == null) {
    return setConnectorValue(state, circuit, box.connectors[2], val1 * val2)
  }

  throw new Error('Should not get here')
}

const updateSumBox = (state, circuit, box) => {
  const val1 = getConnectorValue(state, circuit, box.connectors[0])
  const val2 = getConnectorValue(state, circuit, box.connectors[1])
  const result = getConnectorValue(state, circuit, box.connectors[2])

  if (val1 != null && val2 != null && result != null) {
    if (result !== val1 + val2) {
      throw new Error('Sum not met')
    }
    return state
  } else if ([val1, val2, result].filter(v => v == null).length > 1) {
    // cannot resolve yet, nothing to do
    //
    return state
  }

  // In rules below we can asume only one value is missing

  if (val1 == null) {
    return setConnectorValue(state, circuit, box.connectors[0], result - val2)
  } else if (val2 == null) {
    return setConnectorValue(state, circuit, box.connectors[1], result - val1)
  } else if (result == null) {
    return setConnectorValue(state, circuit, box.connectors[2], val1 + val2)
  }

  throw new Error('Should not get here')
}

const updateBox = (state, circuit, boxId) => {
  const box = circuit.boxes.find(b => b.id === boxId)

  switch (box.type) {
    case 'constant':
      // throw new Error('Should not update a constant')
      return state
    case 'variable':
      // Nothing to do, will fetch value from connection at the end
      return state
    case 'sum': {
      return updateSumBox(state, circuit, box)
    }
    case 'multiplication':
      return updateMultiplicationBox(state, circuit, box)
  }
  throw new Error('Should not get here')
}

const setConnectionValue = (
  state,
  circuit,
  connectionId,
  sourceConnectorId,
  value
) => {
  if (state[connectionId] != null && state[connectionId] !== value) {
    throw new Error(
      `Contradiction: trying to put ${value} into connection with value ${state[connectionId]}`
    )
  }

  const newState = { ...state, [connectionId]: value }
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

  return updateBox(newState, circuit, affectedBox.id)
}

const setConnectorValue = (state, circuit, connectorId, value) => {
  const connection = getConnectionByConnector(circuit, connectorId)
  return setConnectionValue(state, circuit, connection.id, connectorId, value)
}

export const solveCircuit = (circuit, initialVariables) => {
  // state = {[connectionId]: value}
  let state = {}

  {
    const constantBoxes = circuit.boxes.filter(b => b.type === 'constant')
    for (const box of constantBoxes) {
      const connectorId = box.connectors[0]
      state = setConnectorValue(state, circuit, connectorId, box.value)
    }
  }
  {
    const variableBoxes = circuit.boxes.filter(b => b.type === 'variable')
    for (const box of variableBoxes) {
      const value = initialVariables[box.name]
      if (value) {
        const connectorId = box.connectors[0]
        state = setConnectorValue(state, circuit, connectorId, value)
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
