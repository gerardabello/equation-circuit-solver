function makePrefix(key, last) {
  let str = last ? '└' : '├'
  if (key) {
    str += '─ '
  } else {
    str += '──┐'
  }
  return str
}

function filterKeys(obj) {
  const keys = []
  for (const branch in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, branch)) {
      continue
    }
    keys.push(branch)
  }
  return keys
}

function growBranch(key, root, last, lastStates, showValues, callback) {
  let line = ''
  let index = 0
  let lastKey
  let circular
  const lastStatesCopy = lastStates.slice(0)

  if (lastStatesCopy.push([root, last]) && lastStates.length > 0) {
    // based on the "was last element" states of whatever we're nested within,
    // we need to append either blankness or a branch to our line
    lastStates.forEach((lastState, idx) => {
      if (idx > 0) {
        line += `${lastState[1] ? ' ' : '│'}  `
      }
      if (!circular && lastState[0] === root) {
        circular = true
      }
    })

    // the prefix varies based on whether the key contains something to show and
    // whether we're dealing with the last element in this collection
    line += makePrefix(key, last) + key

    // append values and the circular reference indicator
    showValues &&
      (typeof root !== 'object' || root instanceof Date) &&
      (line += `: ${root}`)
    circular && (line += ' (circular ref.)')

    callback(line)
  }

  // can we descend into the next item?
  if (!circular && typeof root === 'object') {
    const keys = filterKeys(root)
    keys.forEach(branch => {
      // the last key is always printed with a different prefix, so we'll need to know if we have it
      lastKey = ++index === keys.length

      // hold your breath for recursive action
      growBranch(
        branch,
        root[branch],
        lastKey,
        lastStatesCopy,
        showValues,
        callback
      )
    })
  }
}

export const printTree = (obj, showValues) => {
  let tree = ''
  growBranch('.', obj, false, [], showValues, line => {
    tree += `${line}\n`
  })
  return tree
}
