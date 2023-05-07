import { parseLetIdentOrVarDeclarationStatement } from 'meriyah/dist/src/parser';
import MetaURL from '../../meta/type';
import iterate from './iterate';
import process from './process';
import emit from './emit';

export default class js {
  iterate = iterate;
  process = process;
  emit = emit;

  ctx;
  
  constructor(ctx:any) {
    this.ctx = ctx.ctx;
  }

  rewrite(src:any, config: any = {}, inject: Boolean = true, dynamic: any = {}) {

    if (src.includes('/* dynamic.js */')) return src;

    try {
      src = `/* dynamic.js */\n\n${src}`;
      src = this.process(src, config, this.ctx, dynamic);
    } catch(e) {
      console.log(e)
    }
    
    if (inject) {
      src = `
      if (typeof self !== undefined && typeof self.importScripts == 'function' && typeof self.__dynamic == 'undefined') importScripts('/dynamic/dynamic.config.js', '/dynamic/dynamic.handler.js?'+Math.floor(Math.random()*(99999-10000)+10000));

      ${src}`;
    }

    return src;
  }
}