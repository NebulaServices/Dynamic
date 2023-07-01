import MetaURL from "../meta/type";
import DynamicRewrites from "../rewrite";

export default class css {

  ctx;

  constructor(ctx: DynamicRewrites) {
    this.ctx = ctx.ctx;
  }

  rewrite(this: css, src: string | URL, meta: MetaURL, config: Object = {}) {
    const that = this;

    if (!src) return src;

    return src.toString().replace(/((@import ['"`]+|url\(['"`]?)(.*?)(['"`]?\)|['"`]+))/gmi, function() {
      try {
        return arguments[0].replace(arguments[3], that.ctx.url.encode(arguments[3], meta));
      } catch {}
    });
  }
}