import Eval from '../object/Eval';
import PostMessage from '../object/PostMessage';

export default function MemberExpression(node: any, parent: any = {}) {
    if (node.object.type!=='Identifier') return;;

    node.object.name+='';

    if (node.property.value == 'postMessage' && (parent.type=='CallExpression'&&parent.callee==node)) return PostMessage(node, parent);
    if (node.object.value == 'postMessage' && (parent.type=='CallExpression'&&parent.callee==node)) return PostMessage(node, parent);

    if (node.property.name=='postMessage'||node.object.name=='postMessage') {
      var original:string = node.object?.name
      node.type = 'CallExpression';
      node.callee = {type: 'Identifier', name: '__dynamic$message'}
      node.arguments = [{type: 'Identifier', name: original}]
      if (parent=='CallExpression') {
        parent.arguments = parent.arguments
      }
    }

    if (!['window', 'self', 'globalThis'].includes(node.object.name)) return false;

    if (parent.type=='CallExpression'&&parent.callee==node) return;

    if (node.object.name=='document') return node.object.name = `__dynamic$get(${node.object.name})`;

    return node.object.name = '__dynamic$'+node.object.name;
}