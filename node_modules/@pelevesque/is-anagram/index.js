'use strict'

const canonicalizeString = require('@pelevesque/canonicalize-string')

function removeSubstrings (str, substrings) {
  substrings.forEach(substring => {
    str = str.replace(substring, '')
  })
  return str
}

function escapeRegexReservedChars (str) {
  // eslint-disable-next-line
  const match = /([\\\[\^\$\.\|\?\*\+\(\)])/
  const re = new RegExp(match, 'g')
  return str.replace(re, '\\$1')
}

module.exports = (str1, str2,
  { groupBy = 1, canonicalize = false, substringsToIgnore = [] } = {}
) => {
  if (str1 === '' || str2 === '') return false

  substringsToIgnore.forEach(substring => {
    substring = escapeRegexReservedChars(substring)
    const re = new RegExp(substring, 'g')
    str1 = str1.replace(re, '')
    str2 = str2.replace(re, '')
  })

  if (canonicalize) {
    str1 = canonicalizeString(str1)
    str2 = canonicalizeString(str2)
  }

  if (str1.length !== str2.length) return false

  let elements = []

  if (typeof groupBy === 'number') {
    if (groupBy === 1) {
      elements = str1.split('')
    } else {
      const re = new RegExp('.{1,' + groupBy + '}', 'g')
      elements = str1.match(re)
    }
  } else if (Array.isArray(groupBy)) {
    elements = groupBy
    elements.sort(function (a, b) { return b.length - a.length })
    str1 = removeSubstrings(str1, elements)
    if (str1 !== '') return false
  } else {
    return false
  }

  str2 = removeSubstrings(str2, elements)

  return str2 === ''
}
