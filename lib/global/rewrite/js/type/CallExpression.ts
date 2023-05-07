import Eval from '../object/Eval';
import PostMessage from '../object/PostMessage';

export default function CallExpression(node: any, parent: any = {}) {
    if (parent.type=='AssignmentExpression'&&parent.left==node) return;
    
    if (node.callee.type=='Identifier') {
        if (node.callee.name=='postMessage') {
            var original = 'undefined'
            node.callee.type = 'CallExpression';
            node.callee.callee = {type: 'Identifier', name: '__dynamic$message'}
            node.callee.arguments = [{type: 'Identifier', name: original}]
    
            return;
        }

        if (node.callee.name=='eval') {
            //node.callee.name = '__dynamic$eval';
        }
    }

    if (node.callee.type=='MemberExpression') {
        if (node.callee.property.name=='postMessage') {
            var original: string = node.callee.object;
            node.callee.type = 'CallExpression';
            node.callee.callee = {type: 'Identifier', name: '__dynamic$message'}
            node.callee.arguments = [original]
    
            return;
        }

        if (node.callee.property.name=='eval') {
            //node.callee.property.name = '__dynamic$eval';
        }
    }

    try {} catch {}
}