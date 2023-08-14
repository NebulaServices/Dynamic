import mime from '@dynamic-pkg/mime';
import * as path from 'path-browserify';
import * as idb from 'idb';
import { parse } from '@dynamic-pkg/acorn';
import { BareClient, createBareClient } from '@tomphttp/bare-client';
import * as cookie from '@dynamic-pkg/cookie';
import { parse as cookieParser } from 'set-cookie-parser'
import { generate } from '@dynamic-pkg/astring';

class DynamicModules {
  mime = mime;
  idb = idb;
  path = path;
  acorn = { parse };
  bare = {createBareClient, BareClient};
  base64 = { encode: btoa, decode: atob };
  estree = { generate };
  cookie = {...cookie, serialize: (...args: any) => { try {return cookie.serialize.apply({}, args)} catch(e) {console.log(e);}}};
  setCookieParser = cookieParser;

  ctx;

  constructor(ctx:any) {
    this.ctx = ctx;
  }
}

export default DynamicModules;