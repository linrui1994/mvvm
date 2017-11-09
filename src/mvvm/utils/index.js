export function joinExp (arr) {
  if (!arr || !Array.isArray(arr)) {
    return ''
  } else {
    let exp = ''
    arr.forEach(strObj => {
      if (!strObj) {
        return
      }
      if (typeof strObj === 'object') {
        if (exp) {
          exp += '+'
        }
        exp += strObj.js
      } else {
        if (exp) {
          exp += '+'
        }
        /(^['"](.*?))|((.*?)['"]$)/.test(strObj) ? exp += strObj : exp += JSON.stringify(strObj)
      }
    })
    return exp
  }
}
