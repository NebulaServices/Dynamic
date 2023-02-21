import mime from './pkg/mime';
import * as path from 'path-browserify';
import * as idb from 'idb';
import * as querystring from 'querystring';
import { parse as P5parse, serialize as P5serialize } from 'parse5';
import { parse as jsParse } from 'meriyah';
import { generate as ESgenerate } from 'escodegen';
import bare from '@tomphttp/bare-client';
import * as url from 'url';
import walkParse5 from './pkg/walk-parse5';
import * as cssTree from 'css-tree';

class DynamicModules {
  mime = mime;
  idb = idb;
  path = path;
  cssTree = cssTree;
  walkParse5 = walkParse5;
  querystring = querystring;
  url = url;
  meriyah = { parse: jsParse };
  escodegen = { generate: ESgenerate };
  parse5 = { parse: P5parse, serialize: P5serialize };
  bare = bare;

  ctx;

  constructor(ctx:any) {
    this.ctx = ctx;
  }
}

export default DynamicModules;