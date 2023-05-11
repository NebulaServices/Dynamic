export default function process (this: any, src: any, config: any = {}, ctx: any, dynamic: any) {
    var ast = this.ctx.modules.seafox.parse(src, {module: config.module || false, globalReturn: true});

    this.iterate(ast, (node:any, parent:any = null) => {
      if (node.type == "VariableDeclaration" && node.kind.constructor.name == "Number") {
        // seafox bug fix
        node.kind = ((num: number) => num==2?'var':num==16?'let':num==32?'const':'var')(node.kind);
      }

      this.emit(node, node.type, parent, ctx, dynamic, config);
    });

    src = this.ctx.modules.estree.toJs(ast).value;

    return src;
}