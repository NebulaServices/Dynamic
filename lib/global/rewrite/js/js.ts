import { parseLetIdentOrVarDeclarationStatement } from 'meriyah/dist/src/parser';
import MetaURL from '../../meta/type';
import iterate from './iterate';
import process from './process';
import emit from './emit';

export default class js {
  iterate = iterate;
  process = process;
  emit:any;

  ctx;
  
  constructor(ctx:any) {
    this.ctx = ctx.ctx;
  }

  rewrite(src:any, meta:MetaURL, inject: Boolean = true) {
    this.emit = emit;

    try {
      src = this.process(src)
    } catch(e) {
      console.log(e)
    }
    
    if (inject) {
      src = `
      if (typeof self !== undefined && typeof self.importScripts == 'function') importScripts('/dynamic/dynamic.config.js', '/dynamic/dynamic.handler.js?'+Math.floor(Math.random()*(99999-10000)+10000));

      ${src}`
    }

    return src;
  }
}