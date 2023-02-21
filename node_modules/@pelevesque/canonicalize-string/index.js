'use strict'

const unhomoglyph = require('unhomoglyph')
const undiacritic = require('diacritics').remove

module.exports = str => unhomoglyph(undiacritic(str.toLowerCase()))
