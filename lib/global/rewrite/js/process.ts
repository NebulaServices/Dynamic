export default function process (this: any, src: any, config: any = {}, ctx: any, dynamic: any) {
    var ast = this.ctx.modules.meriyah.parse(src, {module: true, globalReturn: true, raw: true, webCompat: true, lexical: true, source: true, specDeviation: true, next: true});

    this.iterate(ast, (node:any, parent:any = null) => {
      this.emit(node, node.type, parent, ctx, dynamic, config);
    });

    src = this.ctx.modules.astring.generate(ast);

    return src;
}