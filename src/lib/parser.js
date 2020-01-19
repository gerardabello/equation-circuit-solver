export const parser = tokens => {
  const [tree] = parseEquality(tokens, 0)
  return tree
}

const parseEquality = (tokens, index) => {
  let [left, i] = parseTerm(tokens, index)
  while (tokens[i] && tokens[i].type === 'equals') {
    const [right, ni] = parseTerm(tokens, i + 1)
    left = { type: 'equals', children: [left, right] }
    i = ni
  }

  return [left, i]
}

const parseTerm = (tokens, index) => {
  let [left, i] = parseFactor(tokens, index)
  while (tokens[i] && (tokens[i].type === 'sum' || tokens[i].type === 'substraction')) {
    const [right, ni] = parseFactor(tokens, i + 1)
    left = { type: tokens[i].type, children: [left, right] }
    i = ni
  }

  return [left, i]
}

const parseFactor = (tokens, index) => {
  let [left, i] = parsePrimary(tokens, index)
  while (tokens[i] && (tokens[i].type === 'multiplication' || tokens[i].type === 'division')) {
    const [right, ni] = parsePrimary(tokens, i + 1)
    left = { type: tokens[i].type, children: [left, right] }
    i = ni
  }

  return [left, i]
}

const parsePrimary = (tokens, index) => {
  return [tokens[index], index + 1]
}
