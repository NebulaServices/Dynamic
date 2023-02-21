/* global describe, it */
'use strict'

const expect = require('chai').expect
const canonicalizeString = require('../index')

describe('#canonicalizeString()', () => {
  it('should convert a string to lowercase', () => {
    const string = 'ABCDEFGHIJKLabcdefghijkl'
    const result = canonicalizeString(string)
    const expected = 'abcdefghijklabcdefghijkl'
    expect(result).to.equal(expected)
  })

  it('should remove homoglyphs', () => {
    const string = 'mw'
    const result = canonicalizeString(string)
    const expected = 'rnw'
    expect(result).to.equal(expected)
  })

  it('should remove diacritics', () => {
    const string = 'àéïôùçÀÉÏÔÙÇ'
    const result = canonicalizeString(string)
    const expected = 'aeioucaeiouc'
    expect(result).to.equal(expected)
  })

  it('should remove graphemes', () => {
    const string = 'ŒÆ'
    const result = canonicalizeString(string)
    const expected = 'oeae'
    expect(result).to.equal(expected)
  })

  it('should do all at once', () => {
    const string = 'ABCMWÉéÇŒÆœæ'
    const result = canonicalizeString(string)
    const expected = 'abcrnweecoeaeoeae'
    expect(result).to.equal(expected)
  })
})
