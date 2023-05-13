import mime from './pkg/mime';
import * as path from 'path-browserify';
import * as idb from 'idb';
import * as base64 from './pkg/base64';
import * as acorn from 'acorn';
import bare from '@tomphttp/bare-client';
import * as cookie from './pkg/cookie';
import * as setCookieParser from 'set-cookie-parser'
import * as estree from './pkg/astring';
import * as htmlparser2 from 'htmlparser2';
import * as domhandler from 'domhandler';
import * as domserializer from 'dom-serializer';

class DynamicModules {
  mime = mime;
  idb = idb;
  path = path;
  acorn = acorn;
  bare = bare;
  base64 = base64;
  estree = estree;
  cookie = {...cookie, serialize: (...args: any) => { try {return cookie.serialize.apply({}, args)} catch(e) {console.log(e);}}};
  setCookieParser = setCookieParser;
  htmlparser2 = htmlparser2;
  domhandler = domhandler;
  domserializer = domserializer;

  ctx;

  constructor(ctx:any) {
    this.ctx = ctx;
  }
}

export default DynamicModules;