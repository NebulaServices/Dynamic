export default function process (src:any, debug: boolean = false) {
    var ast = this.ctx.modules.meriyah.parse(src, {module: true, webcompat: true});

    this.iterate(ast, (node:any, parent:any = null) => {
        this.emit(node, node.type, parent, debug);
    });

    src = this.ctx.modules.escodegen.generate(ast);

    return src;
}