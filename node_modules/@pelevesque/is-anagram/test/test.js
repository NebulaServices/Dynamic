/* global describe, it */
'use strict'

const expect = require('chai').expect
const isAnagram = require('../index')

describe('#isAnagram()', () => {
  describe('should fail with inadequate strings', () => {
    it('should return false when one string is empty', () => {
      const str1 = ''
      const str2 = 'abc'
      const result = isAnagram(str1, str2)
      const expected = false
      expect(result).to.equal(expected)
    })

    it('should return false when both strings are empty', () => {
      const str1 = ''
      const str2 = ''
      const result = isAnagram(str1, str2)
      const expected = false
      expect(result).to.equal(expected)
    })

    it('should return false when both strings are of different lengths', () => {
      const str1 = 'abcde'
      const str2 = 'abcdefghij'
      const result = isAnagram(str1, str2)
      const expected = false
      expect(result).to.equal(expected)
    })
  })

  describe('simple anagrams (no options)', () => {
    it('should return false when it is not an anagram', () => {
      const str1 = 'elvis'
      const str2 = 'milou'
      const result = isAnagram(str1, str2)
      const expected = false
      expect(result).to.equal(expected)
    })

    it('should return true when both strings are the same', () => {
      const str1 = 'elvis'
      const str2 = 'elvis'
      const result = isAnagram(str1, str2)
      const expected = true
      expect(result).to.equal(expected)
    })

    it('should return true for an anagram', () => {
      const str1 = 'elvis'
      const str2 = 'lives'
      const result = isAnagram(str1, str2)
      const expected = true
      expect(result).to.equal(expected)
    })
  })

  describe('anagrams with the numbered groupBy option', () => {
    it('should return false when it is not an anagram', () => {
      const str1 = '123aaa345'
      const str2 = 'a123a345a'
      const opts = { groupBy: 3 }
      const result = isAnagram(str1, str2, opts)
      const expected = false
      expect(result).to.equal(expected)
    })

    it('should return true for an anagram', () => {
      const str1 = '123aaa345'
      const str2 = '345123aaa'
      const opts = { groupBy: 3 }
      const result = isAnagram(str1, str2, opts)
      const expected = true
      expect(result).to.equal(expected)
    })

    it('should return true for an anagram with a tail (extra chars after grouping)', () => {
      const str1 = '123aaa345f'
      const str2 = '345f123aaa'
      const opts = { groupBy: 3 }
      const result = isAnagram(str1, str2, opts)
      const expected = true
      expect(result).to.equal(expected)
    })

    describe('with other options', () => {
      it('should return false when grouping is not respected', () => {
        const str1 = ' AmÉ23 45$$'
        const str2 = '5n4$$ 2a3e$$a '
        const opts = {
          groupBy: 2,
          substringsToIgnore: [' ', '$$'],
          canonicalize: true
        }
        const result = isAnagram(str1, str2, opts)
        const expected = false
        expect(result).to.equal(expected)
      })

      it('should return true when grouping is respected', () => {
        const str1 = ' AÉm23 45$$'
        const str2 = '45$$ 23ae$$rn '
        const opts = {
          groupBy: 2,
          substringsToIgnore: [' ', '$$'],
          canonicalize: true
        }
        const result = isAnagram(str1, str2, opts)
        const expected = true
        expect(result).to.equal(expected)
      })
    })
  })

  describe('anagrams with the explicit groupNy option', () => {
    it('should return false when it is not an anagram', () => {
      const str1 = 'a12bbb3'
      const str2 = 'ba1bb32'
      const opts = { groupBy: ['a', '12', 'bbb', '3'] }
      const result = isAnagram(str1, str2, opts)
      const expected = false
      expect(result).to.equal(expected)
    })

    it('should return false for similar strings unrelated to groupBy substrings', () => {
      const str1 = 'aaa'
      const str2 = 'aaa'
      const opts = { groupBy: ['a', '1', '2', '12', 'bbb', '3'] }
      const result = isAnagram(str1, str2, opts)
      const expected = false
      expect(result).to.equal(expected)
    })

    it('should return false for anagrams unrelated to groupBy substrings', () => {
      const str1 = 'elvis'
      const str2 = 'lives'
      const opts = { groupBy: ['a', '1', '2', '12', 'bbb', '3'] }
      const result = isAnagram(str1, str2, opts)
      const expected = false
      expect(result).to.equal(expected)
    })

    it('should return true for an anagram', () => {
      const str1 = '1a12bbb32'
      const str2 = '12bbb3a12'
      const opts = { groupBy: ['a', '1', '2', '12', 'bbb', '3'] }
      const result = isAnagram(str1, str2, opts)
      const expected = true
      expect(result).to.equal(expected)
    })

    describe('with other options', () => {
      it('should return false when grouping is not respected', () => {
        const str1 = ' AmÉ23 45$$'
        const str2 = '23n$$ e$$ar 45 '
        const opts = {
          groupBy: ['are', 'n', '2345'],
          substringsToIgnore: [' ', '$$'],
          canonicalize: true
        }
        const result = isAnagram(str1, str2, opts)
        const expected = false
        expect(result).to.equal(expected)
      })

      it('should return true when grouping is respected', () => {
        const str1 = ' AmÉ23 45$$'
        const str2 = '2345n$$ e$$ar '
        const opts = {
          groupBy: ['ar', 'n', 'e', '2345'],
          substringsToIgnore: [' ', '$$'],
          canonicalize: true
        }
        const result = isAnagram(str1, str2, opts)
        const expected = true
        expect(result).to.equal(expected)
      })
    })
  })

  describe('substringsToIgnore option', () => {
    it('should be null by default', () => {
      const str1 = 'christmas tree'
      const str2 = 'search, set, trim'
      const result = isAnagram(str1, str2)
      const expected = false
      expect(result).to.equal(expected)
    })

    it('should work with single chars', () => {
      const str1 = 'christmas tree'
      const str2 = 'search, set, trim'
      const opts = { substringsToIgnore: [',', ' '] }
      const result = isAnagram(str1, str2, opts)
      const expected = true
      expect(result).to.equal(expected)
    })

    it('should work with substrings of any length', () => {
      const str1 = 'christmas tree ignoreMe'
      const str2 = 'search, set, trim doNotIncludeMe'
      const opts = { substringsToIgnore: [',', ' ', 'ignoreMe', 'doNotIncludeMe'] }
      const result = isAnagram(str1, str2, opts)
      const expected = true
      expect(result).to.equal(expected)
    })

    it('should work with all single chars that must be escaped in regex', () => {
      const str1 = 'elvis[\\^$.|?*+()'
      const str2 = '[\\^$.|?*+()lives'
      const opts = {
        substringsToIgnore: [
          '[', '\\', '^', '$', '.', '|', '?', '*', '+', '(', ')'
        ]
      }
      const result = isAnagram(str1, str2, opts)
      const expected = true
      expect(result).to.equal(expected)
    })

    it('should work with all substrings of any length that must be escaped in regex', () => {
      const str1 = 'elvis[[[\\\\\\^^^$$$...|||???***+++((()))'
      const str2 = '[[[\\\\\\^^^$$$...|||???***+++((()))lives'
      const opts = {
        substringsToIgnore: [
          '[[[', '\\\\\\', '^^^', '$$$', '...', '|||', '???', '***', '+++', '(((', ')))'
        ]
      }
      const result = isAnagram(str1, str2, opts)
      const expected = true
      expect(result).to.equal(expected)
    })
  })

  describe('canonicalize option', () => {
    it('should be false by default', () => {
      const str1 = 'AmwÉ23'
      const str2 = '2varnve3'
      const result = isAnagram(str1, str2)
      const expected = false
      expect(result).to.equal(expected)
    })

    it('should work with with the canonicalize option', () => {
      const str1 = 'AmÉ23'
      const str2 = '2arne3'
      const opts = { canonicalize: true }
      const result = isAnagram(str1, str2, opts)
      const expected = true
      expect(result).to.equal(expected)
    })
  })
})
