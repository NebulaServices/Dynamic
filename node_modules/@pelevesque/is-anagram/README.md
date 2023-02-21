[![Build Status](https://travis-ci.org/pelevesque/is-anagram.svg?branch=master)](https://travis-ci.org/pelevesque/is-anagram)
[![Coverage Status](https://coveralls.io/repos/github/pelevesque/is-anagram/badge.svg?branch=master)](https://coveralls.io/github/pelevesque/is-anagram?branch=master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# is-anagram

Checks if a string is an anagram with extra features not seen in other anagram checkers.

## Node Repository

https://www.npmjs.com/package/@pelevesque/is-anagram

## Installation

`npm install @pelevesque/is-anagram`

## Tests

Command                      | Description
---------------------------- | ------------
`npm test` or `npm run test` | All Tests Below
`npm run cover`              | Standard Style
`npm run standard`           | Coverage
`npm run unit`               | Unit Tests

## Usage

### Parameters

```js
str1    (required)
str2    (required)
options (optional) default = { groupBy: 1, canonicalize: false, substringsToIgnore: [] }
```

### Requiring

```js
const isAnagram = require('@pelevesque/is-anagram')
```

### Basic Usage

```js
const result = isAnagram('elvis', 'lives')
// result === true
```

### Ignoring Certain Substrings

```js
const str1 = '1 elv@@@@is $$$'
const str2 = '$$$ li@@@@ves 1'
const opts = { substringsToIgnore : ['1', '$$$', '@@@@', ' '] }
const result = isAnagram(str1, str2, opts)
// result === true
```

```js
const str1 = 'christmas tree'
const str2 = 'search, set, trim'
const opts = { substringsToIgnore: [',', ' '] }
const result = isAnagram(str1, str2, opts)
// result === true
```

### Canonicalize Strings

Can be used to make strings case insensitive and remove diacritics, homoglyphs, and graphemes.

```js
const str1 = 'ChristmasTree'
const str2 = 'SearchSetTrim'
const opts = { canonicalize: true }
const result = isAnagram(str1, str2, opts)
// result === true
```

```js
const str1 = 'AmwÉ'
const str2 = 'arnwe'
const opts = { canonicalize: true }
const result = isAnagram(str1, str2, opts)
// result === true
```

### Grouping by Length

String elements become grouped by a certain length.

```js
const str1 = 'aabbcc'
const str2 = 'abcabc'
const opts = { groupBy: 2 }
const result = isAnagram(str1, str2, opts)
// result === false
```

```js
const str1 = 'aabbcc'
const str2 = 'bbaacc'
const opts = { groupBy: 2 }
const result = isAnagram(str1, str2, opts)
// result === true
```

Leftover characters like `d` are kept in the anagram.

```js
const str1 = 'aabbccd'
const str2 = 'bbdaacc'
const opts = { groupBy: 2 }
const result = isAnagram(str1, str2, opts)
// result === true
```

### Explicit Grouping

You can specify each element of the anagram by using explicit grouping.

```js
const str1 = '22boy$$a'
const str2 = '2b2yo$a$'
const opts = { groupBy: ['22', 'boy', '$$', 'a'] }
const result = isAnagram(str1, str2, opts)
// result === false
```

```js
const str1 = '22boy$$a'
const str2 = '$$aboy22'
const opts = { groupBy: ['22', 'boy', '$$', 'a'] }
const result = isAnagram(str1, str2, opts)
// result === true
```

```js
const str1 = '1212'
const str2 = '2121'
const opts = { groupBy: ['1', '2', '12'] }
const result = isAnagram(str1, str2, opts)
// result === false
```

```js
const str1 = '1212'
const str2 = '1221'
const opts = { groupBy: ['1', '2', '12'] }
const result = isAnagram(str1, str2, opts)
// result === true
```

### Mixtures

```js
const str1 = ' AmÉ23 45$$'
const str2 = '2345n$$ e$$ar '
const opts = {
  groupBy: ['ar', 'n', 'e', '2345'],
  substringsToIgnore: [' ', '$$'],
  canonicalize: true
}
const result = isAnagram(str1, str2, opts)
// result === true
```
