export default function process (this: any, src: any, config: any = {}, ctx: any, dynamic: any) {
    var ast = this.ctx.modules.acorn.parse(src, {sourceType: config.module ? "module" : "script", globalReturn: true, ecmaVersion: "latest"});

    this.iterate(ast, (node:any, parent:any = null) => {
      this.emit(node, node.type, parent, ctx, dynamic, config);
    });

    src = this.ctx.modules.estree.generate(ast).replace('__dynamic$get(t).source && __dynamic$get(t).source === b() && !0 === __dynamic$get(h)[__dynamic$get(t).origin] && (__dynamic$get(__dynamic$get(t).data).n || __dynamic$get(t).data) === e && (__dynamic$get(a).removeEventListener("message", q, !1), d && __dynamic$get(__dynamic$get(t).data).t !== d ? p(Error("Pa`" + e + "`" + d + "`" + __dynamic$get(__dynamic$get(t).data).t)) : (k(ot(__dynamic$get(__dynamic$get(t).ports)[0], f)), g && g(t)));', 'console.log(t, t.source, b(), b, t.source === b(), h[__dynamic$get(t).origin], t.data === e, e, t.data, a, f, g); __dynamic$get(t).source && __dynamic$get(t).source === b() && !0 === __dynamic$get(h)[__dynamic$get(t).origin] && (__dynamic$get(__dynamic$get(t).data).n || __dynamic$get(t).data) === e && (__dynamic$get(a).removeEventListener("message", q, !1), d && __dynamic$get(__dynamic$get(t).data).t !== d ? p(Error("Pa`" + e + "`" + d + "`" + __dynamic$get(__dynamic$get(t).data).t)) : (k(ot(__dynamic$get(__dynamic$get(t).ports)[0], f)), g && g(t)));');

    return src;
}