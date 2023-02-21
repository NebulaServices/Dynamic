# walk-parse5 [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

> Recursively traverse a [parse5](https://npmjs.com/parse5) DOM tree.


## Installation

[Node.js](http://nodejs.org/) `>= 8` is required. To install, type this at the command line:
```shell
npm install walk-parse5
```


## Usage

```js
const walk = require('walk-parse5');

walk(documentOrNode, node => {
    // Optionally kill traversal
    return false;
});
```


[npm-image]: https://img.shields.io/npm/v/walk-parse5.svg
[npm-url]: https://npmjs.com/package/walk-parse5
[travis-image]: https://img.shields.io/travis/stevenvachon/walk-parse5.svg
[travis-url]: https://travis-ci.org/stevenvachon/walk-parse5
