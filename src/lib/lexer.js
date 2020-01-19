const isNumberCharacter = char => !!char && !isNaN(parseInt(char, 10))
const isDot = char => !!char && char === '.'
const isNumberOrDot = char => isNumberCharacter(char) || isDot(char)

const isLetter = char => !!char && char.match(/[a-z]/i)

export const lexer = equationString => {
  equationString = equationString.replace(/\s/g, "")
  let tokens = []
  let charIndex = 0

  while (charIndex < equationString.length) {
    const char = equationString[charIndex]
    if (isNumberCharacter(char)) {
      let currentNumber = 0
      let decimalPosition = 0
      while (isNumberOrDot(equationString[charIndex])) {
        if (isDot(equationString[charIndex])) {
          decimalPosition = 1
        } else {
          if (decimalPosition > 0) {
            currentNumber =
              currentNumber +
              parseInt(equationString[charIndex], 10) /
                Math.pow(10, decimalPosition)
            decimalPosition += 1
          } else {
            currentNumber =
              currentNumber * 10 + parseInt(equationString[charIndex], 10)
          }
        }
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
    } else if (char === '=') {
      tokens = [...tokens, { type: 'equals' }]
    }else{
      throw new Error('Unknown token')
    }

    charIndex += 1
  }

  return tokens
}
