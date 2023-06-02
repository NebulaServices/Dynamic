export default function Eval(node: any, parent: any = {}) {
    if (node.__dynamic) return;
    
    if (node.arguments.length) {
        node.arguments = [{
            type: 'CallExpression',
            callee: {
                type: 'Identifier',
                name: '__dynamic$wrapEval',
                __dynamic: true,
            },
            arguments: node.arguments,
            __dynamic: true,
        }];

        node.__dynamic = true;
    }

    return;
}