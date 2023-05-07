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

class DynamicBundle {
  modules = new DynamicModules(this);
  util = new DynamicUtil(this);
  http = new DynamicHttp(this);
  meta = new DynamicMeta(this);
  rewrite = new DynamicRewrites(this);
  url = new DynamicUrlRewriter(this);
  is = new DynamicTypeFunctions(this);
  cookies = new DynamicCookies(this);
  regex = new DynamicRegex(this);
  headers = HeaderData;
  bare:BareClient;

  middleware = new DynamicMiddleware(this);

  config;
  
  constructor(config:any) {if (config&&!this.config) this.config = config;};
}

export { DynamicBundle, DynamicModules, DynamicRewrites, DynamicUtil, DynamicMiddleware, DynamicHttp, DynamicMeta, DynamicUrlRewriter };