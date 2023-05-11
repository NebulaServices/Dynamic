import mime from './pkg/mime';
import * as path from 'path-browserify';
import * as idb from 'idb';
import * as base64 from 'base-64';
import * as querystring from 'querystring';
import { parse as P5parse, serialize as P5serialize } from 'parse5';
import * as seafox from 'seafox';
import bare from '@tomphttp/bare-client';
import * as url from 'url';
import walkParse5 from './pkg/walk-parse5';
import * as cookie from 'cookie';
import * as setCookieParser from 'set-cookie-parser';
import * as dynamic from './pkg/dynamic';
import * as estree from 'estree-util-to-js'

class DynamicModules {
  mime = mime;
  idb = idb;
  path = path;
  walkParse5 = walkParse5;
  querystring = querystring;
  url = url;
  seafox = seafox;
  parse5 = { parse: P5parse, serialize: P5serialize };
  bare = bare;
  base64 = base64;
  estree = estree;
  cookie = {...cookie, serialize: (...args: any) => { try {return cookie.serialize.apply({}, args)} catch(e) {console.log(e);}}};
  setCookieParser = setCookieParser;
  dynamic = dynamic;

  ctx;

  constructor(ctx:any) {
    this.ctx = ctx;
  }
}

export default DynamicModules;