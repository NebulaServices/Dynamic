import DynamicModules from './modules';
import DynamicRewrites from './rewrite';
import DynamicUtil from './util';
import DynamicUrlRewriter from './url';
import DynamicMeta from './meta';
import DynamicHttp from './http';
import DynamicRegex from './regex';
import DynamicMiddleware from './middleware';
import HeaderData from './headers';
import BareClient from '@tomphttp/bare-client';
import DynamicTypeFunctions from './istype';
import DynamicCookies from './cookie';
import * as DynamicEncoding from './codec';

class DynamicBundle {
  _location: any;
  client: any;
  parent: any;
  top: any;
  define: any;

  modules: DynamicModules = new DynamicModules(this);
  util: DynamicUtil = new DynamicUtil(this);
  http: DynamicHttp = new DynamicHttp(this);
  meta: DynamicMeta = new DynamicMeta(this);
  rewrite: DynamicRewrites = new DynamicRewrites(this);
  url: DynamicUrlRewriter = new DynamicUrlRewriter(this);
  is: DynamicTypeFunctions = new DynamicTypeFunctions(this);
  cookies: DynamicCookies = new DynamicCookies(this);
  regex: any = new DynamicRegex(this as DynamicBundle);
  headers: any = HeaderData;
  encoding: any = DynamicEncoding;
  bare: BareClient | any;

  middleware: DynamicMiddleware = new DynamicMiddleware(this);

  config;

  listeners: Array<any> = [];

  on(event: string, cb: Function) {
    this.listeners.push({event, cb});
  }

  fire(event: string, data: Array<any>) {
    var found = false;

    for (var listener of this.listeners) {
      if (listener.event === event) data = (found = true, listener.cb(...data));
    }

    if (found && data) return data;

    return null;
  }
  
  constructor(config:any) {if (config&&!this.config) this.config = config; if (config) this.util.encode(self)};
}

export { DynamicBundle, DynamicModules, DynamicRewrites, DynamicUtil, DynamicMiddleware, DynamicHttp, DynamicMeta, DynamicUrlRewriter };