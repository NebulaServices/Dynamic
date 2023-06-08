import DynamicModules from './modules';
import DynamicRewrites from './rewrite';
import DynamicUtil from './util';
import DynamicUrlRewriter from './url';
import DynamicRegex from './regex';
import DynamicMeta from './meta';
import HeaderData from './headers';
import DynamicTypeFunctions from './istype';
import DynamicClient from './client/index';
import DynamicCookies from './cookie';
import * as DynamicEncoding from './codec';

class DynamicBundle {
  modules = new DynamicModules(this);
  util = new DynamicUtil(this);
  meta = new DynamicMeta(this);
  regex = new DynamicRegex(this);
  rewrite = new DynamicRewrites(this);
  url = new DynamicUrlRewriter(this);
  is = new DynamicTypeFunctions(this);
  cookies = new DynamicCookies(this);
  client = new DynamicClient(this);
  encoding = DynamicEncoding;
  headers = HeaderData;

  parent:Window | any;
  top:Window | any;

  define:any;
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

export { DynamicBundle, DynamicModules, DynamicRewrites, DynamicUtil, DynamicMeta, DynamicUrlRewriter };