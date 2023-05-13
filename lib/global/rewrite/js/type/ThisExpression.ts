import Eval from '../object/Eval';
import PostMessage from '../object/PostMessage';

export default function CallExpression(node: any, parent: any = {}) {
    if (node.go === false) return;

    if (parent.type == 'CallExpression' && parent.arguments.includes(node)) return;

    node.type = 'CallExpression';
    node.callee = {type: 'Identifier', name: '__dynamic$get'}
    node.arguments = [{type: 'ThisExpression', go: false}];
}