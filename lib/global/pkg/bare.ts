// @ts-nocheck

var __defProp = Object.defineProperty;
var __publicField = (obj, key, value) => {
  if (typeof key !== "symbol")
    key += "";
  if (key in obj)
    return __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value});
  return obj[key] = value;
};
const fetch = globalThis.fetch;
const WebSocket = globalThis.WebSocket;
const Request = globalThis.Request;
const Response = globalThis.Response;
const statusEmpty = [101, 204, 205, 304];
const statusRedirect = [301, 302, 303, 307, 308];
class BareError extends Error {
  constructor(status, body) {
    super(body.message || body.code);
    __publicField(this, "status");
    __publicField(this, "body");
    this.status = status;
    this.body = body;
  }
}
class Client {
  constructor(version, server) {
    __publicField(this, "base");
    this.base = new URL(`./v${version}/`, server);
  }
}
const validChars = "!#$%&'*+-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ^_`abcdefghijklmnopqrstuvwxyz|~";
const reserveChar = "%";
function validProtocol(protocol) {
  for (let i = 0; i < protocol.length; i++) {
    const char = protocol[i];
    if (!validChars.includes(char)) {
      return false;
    }
  }
  return true;
}
function encodeProtocol(protocol) {
  let result = "";
  for (let i = 0; i < protocol.length; i++) {
    const char = protocol[i];
    if (validChars.includes(char) && char !== reserveChar) {
      result += char;
    } else {
      const code = char.charCodeAt(0);
      result += reserveChar + code.toString(16).padStart(2, "0");
    }
  }
  return result;
}
class ClientV1 extends Client {
  constructor(server) {
    super(1, server);
    __publicField(this, "ws");
    __publicField(this, "http");
    __publicField(this, "newMeta");
    __publicField(this, "getMeta");
    this.ws = new URL(this.base);
    this.http = new URL(this.base);
    this.newMeta = new URL("ws-new-meta", this.base);
    this.getMeta = new URL("ws-meta", this.base);
    if (this.ws.protocol === "https:") {
      this.ws.protocol = "wss:";
    } else {
      this.ws.protocol = "ws:";
    }
  }
  async connect(requestHeaders, protocol, host, port, path) {
    const assignMeta = await fetch(this.newMeta, {method: "GET"});
    if (!assignMeta.ok) {
      throw new BareError(assignMeta.status, await assignMeta.json());
    }
    const id = await assignMeta.text();
    const socket = new WebSocket(this.ws, [
      "bare",
      encodeProtocol(JSON.stringify({
        remote: {
          protocol,
          host,
          port,
          path
        },
        headers: requestHeaders,
        forward_headers: [
          "accept-encoding",
          "accept-language",
          "sec-websocket-extensions",
          "sec-websocket-key",
          "sec-websocket-version"
        ],
        id
      }))
    ]);
    socket.meta = new Promise((resolve, reject) => {
      socket.addEventListener("open", async () => {
        const outgoing = await fetch(this.getMeta, {
          headers: {
            "x-bare-id": id
          },
          method: "GET"
        });
        if (!outgoing.ok) {
          reject(new BareError(outgoing.status, await outgoing.json()));
        }
        resolve(await outgoing.json());
      });
      socket.addEventListener("error", reject);
    });
    return socket;
  }
  async request(method, requestHeaders, body, protocol, host, port, path, cache, signal) {
    var _a;
    if (protocol.startsWith("blob:")) {
      const response2 = await fetch(`${protocol}${host}${path}`);
      const result2 = new Response(response2.body, response2);
      result2.rawHeaders = Object.fromEntries(response2.headers);
      result2.rawResponse = response2;
      return result2;
    }
    const bareHeaders = {};
    if (requestHeaders instanceof Headers) {
      for (const [header, value] of requestHeaders) {
        bareHeaders[header] = value;
      }
    } else {
      for (const header in requestHeaders) {
        bareHeaders[header] = requestHeaders[header];
      }
    }
    const forwardHeaders = ["accept-encoding", "accept-language"];
    const options = {
      credentials: "omit",
      method,
      signal
    };
    if (body !== void 0) {
      options.body = body;
    }
    const request = new Request(this.http, options);
    this.writeBareRequest(request, protocol, host, path, port, bareHeaders, forwardHeaders);
    const response = await fetch(request);
    const readResponse = await this.readBareResponse(response);
    const result = new Response(statusEmpty.includes(readResponse.status) ? void 0 : response.body, {
      status: readResponse.status,
      statusText: (_a = readResponse.statusText) != null ? _a : void 0,
      headers: readResponse.headers
    });
    result.rawHeaders = readResponse.rawHeaders;
    result.rawResponse = response;
    return result;
  }
  async readBareResponse(response) {
    if (!response.ok) {
      throw new BareError(response.status, await response.json());
    }
    const requiredHeaders = [
      "x-bare-status",
      "x-bare-status-text",
      "x-bare-headers"
    ];
    for (const header of requiredHeaders) {
      if (!response.headers.has(header)) {
        throw new BareError(500, {
          code: "IMPL_MISSING_BARE_HEADER",
          id: `response.headers.${header}`
        });
      }
    }
    const status = parseInt(response.headers.get("x-bare-status"));
    const statusText = response.headers.get("x-bare-status-text");
    const rawHeaders = JSON.parse(response.headers.get("x-bare-headers"));
    const headers = new Headers(rawHeaders);
    return {
      status,
      statusText,
      rawHeaders,
      headers
    };
  }
  writeBareRequest(request, protocol, host, path, port, bareHeaders, forwardHeaders) {
    request.headers.set("x-bare-protocol", protocol);
    request.headers.set("x-bare-host", host);
    request.headers.set("x-bare-path", path);
    request.headers.set("x-bare-port", port.toString());
    request.headers.set("x-bare-headers", JSON.stringify(bareHeaders));
    request.headers.set("x-bare-forward-headers", JSON.stringify(forwardHeaders));
  }
}
function safeAdd(x, y) {
  const lsw = (x & 65535) + (y & 65535);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 65535;
}
function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}
function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}
function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}
function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}
function binlMD5(x, len) {
  x[len >> 5] |= 128 << len % 32;
  x[(len + 64 >>> 9 << 4) + 14] = len;
  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;
  for (let i = 0; i < x.length; i += 16) {
    const olda = a;
    const oldb = b;
    const oldc = c;
    const oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }
  return [a, b, c, d];
}
function binl2rstr(input) {
  let output = "";
  const length32 = input.length * 32;
  for (let i = 0; i < length32; i += 8) {
    output += String.fromCharCode(input[i >> 5] >>> i % 32 & 255);
  }
  return output;
}
function rstr2binl(input) {
  const output = [];
  const outputLen = input.length >> 2;
  for (let i = 0; i < outputLen; i += 1) {
    output[i] = 0;
  }
  const length8 = input.length * 8;
  for (let i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input.charCodeAt(i / 8) & 255) << i % 32;
  }
  return output;
}
function rstrMD5(s) {
  return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
}
function rstrHMACMD5(key, data) {
  let bkey = rstr2binl(key);
  const ipad = [];
  const opad = [];
  if (bkey.length > 16) {
    bkey = binlMD5(bkey, key.length * 8);
  }
  for (let i = 0; i < 16; i += 1) {
    ipad[i] = bkey[i] ^ 909522486;
    opad[i] = bkey[i] ^ 1549556828;
  }
  const hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
  return binl2rstr(binlMD5(opad.concat(hash), 512 + 128));
}
function rstr2hex(input) {
  const hexTab = "0123456789abcdef";
  let output = "";
  for (let i = 0; i < input.length; i += 1) {
    const x = input.charCodeAt(i);
    output += hexTab.charAt(x >>> 4 & 15) + hexTab.charAt(x & 15);
  }
  return output;
}
function str2rstrUTF8(input) {
  return unescape(encodeURIComponent(input));
}
function rawMD5(s) {
  return rstrMD5(str2rstrUTF8(s));
}
function hexMD5(s) {
  return rstr2hex(rawMD5(s));
}
function rawHMACMD5(k, d) {
  return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d));
}
function hexHMACMD5(k, d) {
  return rstr2hex(rawHMACMD5(k, d));
}
function md5(string, key, raw) {
  if (!key) {
    if (!raw) {
      return hexMD5(string);
    }
    return rawMD5(string);
  }
  if (!raw) {
    return hexHMACMD5(key, string);
  }
  return rawHMACMD5(key, string);
}
const MAX_HEADER_VALUE = 3072;
function splitHeaders(headers) {
  const output = new Headers(headers);
  if (headers.has("x-bare-headers")) {
    const value = headers.get("x-bare-headers");
    if (value.length > MAX_HEADER_VALUE) {
      output.delete("x-bare-headers");
      let split = 0;
      for (let i = 0; i < value.length; i += MAX_HEADER_VALUE) {
        const part = value.slice(i, i + MAX_HEADER_VALUE);
        const id = split++;
        output.set(`x-bare-headers-${id}`, `;${part}`);
      }
    }
  }
  return output;
}
function joinHeaders(headers) {
  const output = new Headers(headers);
  const prefix = "x-bare-headers";
  if (headers.has(`${prefix}-0`)) {
    const join = [];
    for (const [header, value] of headers) {
      if (!header.startsWith(prefix)) {
        continue;
      }
      if (!value.startsWith(";")) {
        throw new BareError(400, {
          code: "INVALID_BARE_HEADER",
          id: `request.headers.${header}`,
          message: `Value didn't begin with semi-colon.`
        });
      }
      const id = parseInt(header.slice(prefix.length + 1));
      join[id] = value.slice(1);
      output.delete(header);
    }
    output.set(prefix, join.join(""));
  }
  return output;
}
class ClientV2 extends Client {
  constructor(server) {
    super(2, server);
    __publicField(this, "ws");
    __publicField(this, "http");
    __publicField(this, "newMeta");
    __publicField(this, "getMeta");
    this.ws = new URL(this.base);
    this.http = new URL(this.base);
    this.newMeta = new URL("./ws-new-meta", this.base);
    this.getMeta = new URL(`./ws-meta`, this.base);
    if (this.ws.protocol === "https:") {
      this.ws.protocol = "wss:";
    } else {
      this.ws.protocol = "ws:";
    }
  }
  async connect(requestHeaders, protocol, host, port, path) {
    const request = new Request(this.newMeta, {
      headers: this.createBareHeaders(protocol, host, path, port, requestHeaders)
    });
    const assignMeta = await fetch(request);
    if (!assignMeta.ok) {
      throw new BareError(assignMeta.status, await assignMeta.json());
    }
    const id = await assignMeta.text();
    const socket = new WebSocket(this.ws, [
      id
    ]);
    socket.meta = new Promise((resolve, reject) => {
      socket.addEventListener("open", async () => {
        const outgoing = await fetch(this.getMeta, {
          headers: {
            "x-bare-id": id
          },
          method: "GET"
        });
        resolve(await this.readBareResponse(outgoing));
      });
      socket.addEventListener("error", reject);
    });
    return socket;
  }
  async request(method, requestHeaders, body, protocol, host, port, path, cache, signal) {
    var _a;
    if (protocol.startsWith("blob:")) {
      const response2 = await fetch(`${protocol}${host}${path}`);
      const result2 = new Response(response2.body, response2);
      result2.rawHeaders = Object.fromEntries(response2.headers);
      result2.rawResponse = response2;
      return result2;
    }
    const bareHeaders = {};
    if (requestHeaders instanceof Headers) {
      for (const [header, value] of requestHeaders) {
        bareHeaders[header] = value;
      }
    } else {
      for (const header in requestHeaders) {
        bareHeaders[header] = requestHeaders[header];
      }
    }
    const options = {
      credentials: "omit",
      method,
      signal
    };
    if (cache !== "only-if-cached") {
      options.cache = cache;
    }
    if (body !== void 0) {
      options.body = body;
    }
    options.headers = this.createBareHeaders(protocol, host, path, port, bareHeaders);
    const request = new Request(this.http + "?cache=" + md5(`${protocol}${host}${port}${path}`), options);
    const response = await fetch(request);
    const readResponse = await this.readBareResponse(response);
    const result = new Response(statusEmpty.includes(readResponse.status) ? void 0 : response.body, {
      status: readResponse.status,
      statusText: (_a = readResponse.statusText) != null ? _a : void 0,
      headers: readResponse.headers
    });
    result.rawHeaders = readResponse.rawHeaders;
    result.rawResponse = response;
    return result;
  }
  async readBareResponse(response) {
    if (!response.ok) {
      throw new BareError(response.status, await response.json());
    }
    const responseHeaders = joinHeaders(response.headers);
    const result = {};
    if (responseHeaders.has("x-bare-status")) {
      result.status = parseInt(responseHeaders.get("x-bare-status"));
    }
    if (responseHeaders.has("x-bare-status-text")) {
      result.statusText = responseHeaders.get("x-bare-status-text");
    }
    if (responseHeaders.has("x-bare-headers")) {
      result.rawHeaders = JSON.parse(responseHeaders.get("x-bare-headers"));
      result.headers = new Headers(result.rawHeaders);
    }
    return result;
  }
  createBareHeaders(protocol, host, path, port, bareHeaders, forwardHeaders = [], passHeaders = [], passStatus = []) {
    const headers = new Headers();
    headers.set("x-bare-protocol", protocol);
    headers.set("x-bare-host", host);
    headers.set("x-bare-path", path);
    headers.set("x-bare-port", port.toString());
    headers.set("x-bare-headers", JSON.stringify(bareHeaders));
    for (const header of forwardHeaders) {
      headers.append("x-bare-forward-headers", header);
    }
    for (const header of passHeaders) {
      headers.append("x-bare-pass-headers", header);
    }
    for (const status of passStatus) {
      headers.append("x-bare-pass-status", status.toString());
    }
    return splitHeaders(headers);
  }
}
const clientCtors = [
  ["v2", ClientV2],
  ["v1", ClientV1]
];
const maxRedirects = 20;
async function fetchManifest(server, signal) {
  const outgoing = await fetch(server, {signal});
  if (!outgoing.ok) {
    throw new Error(`Unable to fetch Bare meta: ${outgoing.status} ${await outgoing.text()}`);
  }
  return await outgoing.json();
}
function resolvePort(url) {
  if (url.port)
    return Number(url.port);
  switch (url.protocol) {
    case "ws:":
    case "http:":
      return 80;
    case "wss:":
    case "https:":
      return 443;
    default:
      return 0;
  }
}
class BareClient {
  constructor(server, _, version = 'v2') {
    __publicField(this, "manfiest");
    __publicField(this, "client");
    __publicField(this, "server");
    __publicField(this, "working");
    __publicField(this, "onDemand");
    __publicField(this, "onDemandSignal");
    this.version = version;
    this.server = new URL(server);
    if (!_ || _ instanceof AbortSignal) {
      this.onDemand = true;
      this.onDemandSignal = _;
    } else {
      this.onDemand = false;
      this.manfiest = _;
      this.getClient();
    }
  }
  get data() {
    return this.manfiest;
  }
  demand() {
    if (!this.onDemand)
      return;
    if (!this.working)
      this.working = fetchManifest(this.server, this.onDemandSignal).then((manfiest) => {
        this.manfiest = manfiest;
        this.getClient();
      }).catch((err) => {
        delete this.working;
        throw err;
      });
    return this.working;
  }
  getClient() {
    for (const [version, ctor] of clientCtors) {
      if (this.data.versions.includes(version) && version === this.version) {
        this.client = new ctor(this.server);
        return;
      }
    }
    throw new Error(`Unable to find compatible client version.`);
  }
  async request(method, requestHeaders, body, protocol, host, port, path, cache, signal) {
    await this.demand();
    return await this.client.request(method, requestHeaders, body, protocol, host, port, path, cache, signal);
  }
  async connect(requestHeaders, protocol, host, port, path) {
    await this.demand();
    return this.client.connect(requestHeaders, protocol, host, port, path);
  }
  createWebSocket(url, headers = {}, protocols = []) {
    const requestHeaders = headers instanceof Headers ? Object.fromEntries(headers) : headers;
    url = new URL(url);
    requestHeaders["Host"] = url.host;
    requestHeaders["Pragma"] = "no-cache";
    requestHeaders["Cache-Control"] = "no-cache";
    requestHeaders["Upgrade"] = "websocket";
    requestHeaders["Connection"] = "Upgrade";
    if (typeof protocols === "string") {
      protocols = [protocols];
    }
    for (const proto of protocols) {
      if (!validProtocol(proto)) {
        throw new DOMException(`Failed to construct 'WebSocket': The subprotocol '${proto}' is invalid.`);
      }
    }
    if (protocols.length)
      requestHeaders["Sec-Websocket-Protocol"] = protocols.join(", ");
    return this.connect(requestHeaders, url.protocol, url.hostname, resolvePort(url), url.pathname + url.search);
  }
  async fetch(url, init = {}) {
    if (url instanceof Request) {
      if (init) {
        url = new URL(url.url);
      } else {
        init = url;
        url = new URL(url.url);
      }
    } else {
      url = new URL(url);
    }
    let method;
    if (typeof init.method === "string") {
      method = init.method;
    } else {
      method = "GET";
    }
    let body;
    if (init.body !== void 0 && init.body !== null) {
      body = init.body;
    }
    let headers;
    if (typeof init.headers === "object" && init.headers !== null) {
      if (init.headers instanceof Headers) {
        headers = Object.fromEntries(init.headers);
      } else {
        headers = init.headers;
      }
    } else {
      headers = {};
    }
    let cache;
    if (typeof init.cache === "string") {
      cache = init.cache;
    } else {
      cache = "default";
    }
    let signal;
    if (init.signal instanceof AbortSignal) {
      signal = init.signal;
    }
    for (let i = 0; ; i++) {
      if ("host" in headers)
        headers.host = url.host;
      else
        headers.Host = url.host;
      const response = await this.request(method, headers, body, url.protocol, url.hostname, resolvePort(url), url.pathname + url.search, cache, signal);
      response.finalURL = url.toString();
      if (statusRedirect.includes(response.status)) {
        switch (init.redirect) {
          default:
          case "follow":
            if (maxRedirects > i && response.headers.has("location")) {
              url = new URL(response.headers.get("location"), url);
              continue;
            } else {
              throw new TypeError("Failed to fetch");
            }
          case "error":
            throw new TypeError("Failed to fetch");
          case "manual":
            return response;
        }
      } else {
        return response;
      }
    }
  }
}
async function createBareClient(server, signal) {
  const manfiest = await fetchManifest(server, signal);
  return new BareClient(server, manfiest);
}
export default BareClient;
export {BareError, createBareClient, maxRedirects, statusEmpty, statusRedirect};