/*export default function process (src:any, config: any = {}) {
    var ast = this.ctx.modules.meriyah.parse(src, {module: true, webcompat: true});

    this.iterate(ast, (node:any, parent:any = null) => {
        const type = node.type;
          if (type=='Literal'&&(parent.type=='ImportDeclaration'||parent.type=='ExportNamedDeclaration'||parent.type=='ExportAllDeclaration')) {
            node.value = this.proxy.url.encode(node.value, this.proxy.meta);
          }
          if (type=='Literal') if (node.value=='`__dynamic`') node.value = 'undefined';
          if (type=='Literal') if (node.value=='location') node.value = '__dynamic.location';
          if (type=='Identifier') {
            if (node.name=='location'&&parent.type=='BinaryExpression') node.name = '__dynamic.location'
    
            if (node.name == '__dynamic') node.name = 'undefined';
            if (node?.name=='postMessage'&&parent.type=='CallExpression') {
              var original = 'undefined'
              node.type = 'CallExpression';
              //console.log(parent.arguments)
              node.callee = {type: 'Identifier', name: '__dynamic$message'}
              node.arguments = [{type: 'Identifier', name: original}]
              if (parent=='CallExpression') {
                parent.arguments = parent.arguments
              }
            }
          }
          if (type=='MemberExpression'&&node.object.type=='Identifier') {
            if (node.property?.type=='Literal') {
              if (node.property?.value == 'postMessage') {
                if (parent.type=='CallExpression'&&parent.callee==node) {
                  Object.entries({
                    type: 'CallExpression',
                    callee: {
                      type: 'MemberExpression',
                      object: {type: 'Identifier', name: 'self'},
                      property: {type: 'Identifier', name: '__dynamic$message'},
                    },
                    arguments: [
                      {type: 'Identifier', name: node.object?.name},
                    ]
                  }).forEach(([e,v])=>node[e]=v)
    
                  return;
                }
              }
            }
            if (node.property?.name=='postMessage') {
              var original:string = node.object?.name
              node.type = 'CallExpression';
              //console.log(parent.arguments)
              node.callee = {type: 'Identifier', name: '__dynamic$message'}
              node.arguments = [{type: 'Identifier', name: original}]
              if (parent=='CallExpression') {
                parent.arguments = parent.arguments
              }
            }
    
            if (config.destination!=='worker') {
              if (node.property.name=='window'&&node.object.name!='top'&&(node.object.name=='self'||node.object.name=='globalThis')) if (parent.type!=='NewExpression'&&(parent.type!=='CallExpression'||((parent.type=='CallExpression')&&node!==parent.callee))) node.property.name = '__dynamic$window';
              if (node.object.name=='top') if (parent.type!=='NewExpression'&&(parent.type!=='CallExpression'||((parent.type=='CallExpression')&&node!==parent.callee))) node.object.name = 'top.__dynamic$window';
              if (node.property.name=='top'&&(node.object.name=='self'||node.object.name=='globalThis')) if (parent.type!=='NewExpression'&&(parent.type!=='CallExpression'||((parent.type=='CallExpression')&&node!==parent.callee))) node.property.name = 'top.__dynamic$window';
              if (node.object.name=='window') {
                if (parent.type!=='NewExpression'&&(parent.type!=='CallExpression'||((parent.type=='CallExpression')&&node!==parent.callee))) node.object.name = 'self.__dynamic$window';
              };
              if (node.object.name=='parent') {
                if (parent.type!=='NewExpression'&&(parent.type!=='CallExpression'||((parent.type=='CallExpression')&&node!==parent.callee))) node.object.name = 'self.parent.__dynamic$window';
              };
              if (node.property.name == '__dynamic') node.property.name = 'undefined';
              if (node.object.name=='self') {
                if (parent.type!=='NewExpression'&&(parent.type!=='CallExpression'||((parent.type=='CallExpression')&&node!==parent.callee))) node.object.name = 'self.__dynamic$window';
              };
              if (node.object.name=='globalThis') {
                if (parent.type!=='NewExpression'&&(parent.type!=='CallExpression'||((parent.type=='CallExpression')&&node!==parent.callee))) node.object.name = 'self.__dynamic$window';
              };
              if (node.object?.name=='location') node.object.name = '__dynamic.location';
            }
          };
        //this.emit(node, node.type, parent, debug);
    });

    src = this.ctx.modules.escodegen.generate(ast);

    return src;
}*/

export default function process (src:any, config: any = {}, ctx:any, dynamic: any) {
    var ast = this.ctx.modules.meriyah.parse(src, {module: true, globalReturn: true, raw: true, webCompat: true, lexical: true, source: true, specDeviation: true, next: true});

    this.iterate(ast, (node:any, parent:any = null) => {
        this.emit(node, node.type, parent, ctx, dynamic, config);
    });

    src = this.ctx.modules.astring.generate(ast);

    return src;
}