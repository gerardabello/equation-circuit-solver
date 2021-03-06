export const parser = tokens => {
  const [tree] = parseEquality(addImplicitMultiplications(tokens), 0)
  return tree
}

const addImplicitMultiplications = tokens => {
  let newTokens = [...tokens]
  const targetTypes = ['constant', 'variable']
  for (let i = 0; i < newTokens.length - 1; i++) {
    if(targetTypes.includes(newTokens[i].type) &&  targetTypes.includes(newTokens[i+1].type)){
      newTokens.splice(i+1, 0, {type: 'multiplication'})
    }
  }
  return newTokens
}

const checkLeftRight = (left, right, type) => {
  if (!left || !right) {
    throw new Error(`${type} must have left and right children`)
  }
}

const parseEquality = (tokens, index) => {
  let [left, i] = parseTerm(tokens, index)
  while (tokens[i] && tokens[i].type === 'equals') {
    const [right, ni] = parseTerm(tokens, i + 1)
    checkLeftRight(left, right, tokens[i].type)
    left = { type: 'equals', children: [left, right] }
    i = ni
  }

  return [left, i]
}

const parseTerm = (tokens, index) => {
  let [left, i] = parseFactor(tokens, index)
  while (tokens[i] && (tokens[i].type === 'sum' || tokens[i].type === 'substraction')) {
    const [right, ni] = parseFactor(tokens, i + 1)
    checkLeftRight(left, right, tokens[i].type)
    left = { type: tokens[i].type, children: [left, right] }
    i = ni
  }

  return [left, i]
}

const parseFactor = (tokens, index) => {
  let [left, i] = parsePrimary(tokens, index)
  while (tokens[i] && (tokens[i].type === 'multiplication' || tokens[i].type === 'division')) {
    const [right, ni] = parsePrimary(tokens, i + 1)
    checkLeftRight(left, right, tokens[i].type)
    left = { type: tokens[i].type, children: [left, right] }
    i = ni
  }

  return [left, i]
}

const parsePrimary = (tokens, index) => {
  if (tokens[index].type !== 'constant' && tokens[index].type !== 'variable') {
    throw new Error(`Expecting constant or variable, got ${tokens[index].type}`)
  }
  return [tokens[index], index + 1]
}
