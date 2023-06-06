export default function process (this: any, src: any, config: any = {}, ctx: any, dynamic: any) {
    var ast = this.ctx.modules.acorn.parse(src, {sourceType: config.module ? 'module' : 'script', allowImportExportEverywhere: true, allowAwaitOutsideFunction: true, allowReturnOutsideFunction: true, ecmaVersion: "latest", preserveParens: true, loose: true, allowReserved: true});

    this.iterate(ast, (node:any, parent:any = null) => {
      this.emit(node, node.type, parent, ctx, dynamic, config);
    });

    src = this.ctx.modules.estree.generate(ast);

    return src;
}