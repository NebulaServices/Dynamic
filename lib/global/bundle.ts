import DynamicModules from './modules';
import DynamicRewrites from './rewrite';
import DynamicUtil from './util';
import DynamicUrlRewriter from './url';
import DynamicMeta from './meta';
import DynamicHttp from './http';
import DynamicMiddleware from './middleware';
import HeaderData from './headers';
import BareClient from '@tomphttp/bare-client';
import DynamicTypeFunctions from './istype';

class DynamicBundle {
  modules = new DynamicModules(this);
  util = new DynamicUtil(this);
  http = new DynamicHttp(this);
  meta = new DynamicMeta(this);
  rewrite = new DynamicRewrites(this);
  url = new DynamicUrlRewriter(this);
  is = new DynamicTypeFunctions(this);
  headers = HeaderData;
  bare:BareClient;

  middleware = new DynamicMiddleware(this);

  config;
  
  constructor(config:any) {if (config&&!this.config) this.config = config;};
}

export { DynamicBundle, DynamicModules, DynamicRewrites, DynamicUtil, DynamicMiddleware, DynamicHttp, DynamicMeta, DynamicUrlRewriter };