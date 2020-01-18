const isNumberCharacter = char => !!char && !isNaN(parseInt(char, 10))

const isLetter = char => !!char && char.match(/[a-z]/i)

export const lexer = equationString => {
  let tokens = []
  let charIndex = 0

  while (charIndex < equationString.length) {
    const char = equationString[charIndex]
    if (isNumberCharacter(char)) {
      let currentNumber = 0
      while (isNumberCharacter(equationString[charIndex])) {
        currentNumber =
          currentNumber * 10 + parseInt(equationString[charIndex], 10)
        charIndex += 1
      }
      charIndex -= 1
      tokens = [...tokens, { type: 'constant', value: currentNumber }]
    } else if (isLetter(char)) {
      let currentName = ''
      while (isLetter(equationString[charIndex])) {
        currentName += equationString[charIndex]
        charIndex += 1
      }
      charIndex -= 1
      tokens = [...tokens, { type: 'variable', name: currentName }]
    } else if (char === '+') {
      tokens = [...tokens, { type: 'sum' }]
    } else if (char === '-') {
      tokens = [...tokens, { type: 'substraction' }]
    } else if (char === '*') {
      tokens = [...tokens, { type: 'multiplication' }]
    } else if (char === '/') {
      tokens = [...tokens, { type: 'division' }]
    } else if (char === '(') {
      tokens = [...tokens, { type: 'start-block' }]
    } else if (char === ')') {
      tokens = [...tokens, { type: 'end-block' }]
    } else if (char === '=') {
      tokens = [...tokens, { type: 'equals' }]
    }

    charIndex += 1
  }

  return tokens
}
