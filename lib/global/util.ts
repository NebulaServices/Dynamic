import { route, routePath } from './util/route';
import path from './util/path';
import resHeader from './util/resHeader';
import reqHeader from './util/reqHeader';
import clone from './util/clone';
import Class from './util/class';
import file from './util/file';
import edit from './util/edit';
import error from './util/error';
import about from './util/about';

class DynamicUtil {
  route = route;
  routePath = routePath;
  path = path;
  resHeader = resHeader;
  reqHeader = reqHeader;
  clone = clone;
  class = Class;
  file = file;
  edit = edit;
  error = error;
  about = about;

  ctx;
  
  constructor(ctx: any) {
    this.ctx = ctx;
  }
}

export default DynamicUtil;