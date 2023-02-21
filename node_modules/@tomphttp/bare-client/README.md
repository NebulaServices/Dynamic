# Bare Client

This package implements the [TompHTTP Bare Server](https://github.com/tomphttp/specifications/blob/master/BareServer.md) as a client.

## Quickstart

Script tag:

```html
<script src="https://unpkg.com/@tomphttp/bare-client@1.0.2-beta-rollup6/dist/BareClient.umd.min.cjs"></script>
```

1. Install

```sh
npm install @tomphttp/bare-client
```

2. Include in your code

```js
import BareClient from '@tomphttp/bare-client';

const client = new BareClient('https://uv.holyubofficial.net/');

// ...

const response = await client.fetch('https://www.google.com/');

console.log(response.status, await response.text());
```
