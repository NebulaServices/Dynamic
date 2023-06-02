import Eval from '../object/Eval';
import PostMessage from '../object/PostMessage';

export default function AssignmentExpression(node: any, parent: any = {}) {
    if (node.left.type == 'Identifier') {
        if (node.left.__dynamic === true) return;

        if (node.left.name == 'location') {
            var ol = structuredClone(node.left), or = structuredClone(node.right);
            node.right.type = 'CallExpression';
            node.right.callee = {type: 'Identifier', name: 'ds$'};
            node.right.arguments = [ol, or];
        }
    }
}