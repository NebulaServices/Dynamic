import MetaURL from "../meta/type";

export default class css {

  csstree

  ctx;

  constructor(ctx:any) {
    this.ctx = ctx.ctx;
    this.csstree = this.ctx.modules.cssTree;
  }

  rewrite(src: any, meta: MetaURL, config:any = {}) {
    const that = this;

    const ast = this.csstree.parse(src, {
      context: config.type||'stylesheet',
      parseCustomProperty: true, 
    });
    this.csstree.walk(ast, (node: any) => {
      if (node.type === "Url") {
        node.value = that.ctx.url.encode(node.value, meta);
      }
    });
    return this.csstree.generate(ast);
  }
}