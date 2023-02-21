import load from './meta/load';
import MetaURL from './meta/type';

class DynamicMeta extends MetaURL {
  load = load;

  ctx;

  constructor(ctx:any) {
    super();
    this.ctx = ctx;
  }
}

export default DynamicMeta;