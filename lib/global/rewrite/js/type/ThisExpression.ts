import Eval from '../object/Eval';
import PostMessage from '../object/PostMessage';

export default function CallExpression(node: any, parent: any = {}) {
    if (node.go === false) return;

    if (parent.type == 'CallExpression' && parent.arguments.includes(node)) return;

    if (parent.type !== "SequenceExpression" && parent.type !== "VariableDeclarator") return;

    node.type = 'CallExpression';
    node.callee = {type: 'Identifier', name: 'dg$', __dynamic: true};
    node.__dynamic = true;
    node.arguments = [{type: 'ThisExpression', go: false, __dynamic: true}];
}