import mime from '@dynamic-pkg/mime';
import * as path from 'path-browserify';
import * as idb from 'idb';
import * as base64 from '@dynamic-pkg/base64';
import { parse } from '@dynamic-pkg/acorn';
import { BareClient, createBareClient } from '@tomphttp/bare-client';
import * as cookie from '@dynamic-pkg/cookie';
import * as setCookieParser from 'set-cookie-parser'
import { generate } from '@dynamic-pkg/astring';
import * as Bowser from 'bowser';
//import mutation from '@dynamic-pkg/mutation';

class DynamicModules {
  mime = mime;
  idb = idb;
  path = path;
  acorn = { parse };
  bare = {createBareClient, BareClient};
  base64 = base64;
  estree = { generate };
  cookie = {...cookie, serialize: (...args: any) => { try {return cookie.serialize.apply({}, args)} catch(e) {console.log(e);}}};
  setCookieParser = setCookieParser;
  bowser = Bowser;

  ctx;

  constructor(ctx:any) {
    this.ctx = ctx;
  }
}

export default DynamicModules;