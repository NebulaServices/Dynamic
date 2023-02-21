import Encode from './url/encode';
import Decode from './url/decode';

class DynamicUrlRewriter {
  encode = Encode;
  decode = Decode;

  ctx;
  
  constructor(ctx: any) {
    this.ctx = ctx;
  }
}

export default DynamicUrlRewriter;