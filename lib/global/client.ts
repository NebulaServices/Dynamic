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
  headers = HeaderData;

  parent:Window | any;
  top:Window | any;

  define:any;
  config;
  
  constructor(config:any) {if (config&&!this.config) this.config = config;};
}

export { DynamicBundle, DynamicModules, DynamicRewrites, DynamicUtil, DynamicMeta, DynamicUrlRewriter };