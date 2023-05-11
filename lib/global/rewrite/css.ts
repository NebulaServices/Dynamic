import MetaURL from "../meta/type";

export default class css {

  ctx;

  constructor(ctx:any) {
    this.ctx = ctx.ctx;
  }

  rewrite(this: any, src: any, meta: MetaURL, config:any = {}) {
    const that = this;

    return src.replace(/((@import ['"`]+|url\(['"`]?)(.*?)(['"`]?\)|['"`]+))/gmi, function() {
      return arguments[0].replace(arguments[3], that.ctx.url.encode(arguments[3], meta));
    });
  }
}