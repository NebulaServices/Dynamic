import Eval from '../object/Eval';
import PostMessage from '../object/PostMessage';

export default function Identifier(node: any, parent: any = {}) {
    if (typeof node.name !== 'string') return false;

    if (node.__dynamic === true) return;

    if (!['parent', 'top', 'postMessage', 'opener', 'window', 'self', 'globalThis', 'parent', 'location'].includes(node.name)) return false;

    if (parent.type=='AssignmentExpression'&&parent.left==node&&node.name=='location') return; //node.name = '__dynamic$location'

    if (parent.type=='CallExpression'&&(parent.callee==node)) return;
    if (parent.type=='MemberExpression'&&(parent.object!==node&&(parent.object.name!=='document'||parent.object.name!=='window'||parent.object.name!=='self'||parent.object.name!=='globalThis'))) return;
    if (parent.type=='FunctionDeclaration') return;
    if (parent.type=='VariableDeclaration') return;
    if (parent.type=='VariableDeclarator'&&parent.id==node) return;
    if (parent.type=='LabeledStatement') return;
    if (parent.type=='Property'&&parent.key==node) return;
    if (parent.type=='ArrowFunctionExpression'&&parent.params.includes(node)) return;
    if (parent.type=='FunctionExpression'&&parent.params.includes(node)) return;
    if (parent.type=='FunctionExpression'&&parent.id==node) return;
    if (parent.type=='CatchClause'&&parent.param==node) return;
    if (parent.type=='ContinueStatement') return;
    if (parent.type=='BreakStatement') return;
    if (parent.type=='AssignmentExpression'&&parent.left==node) return;
    if (parent.type=='UpdateExpression') return;
    if (parent.type=='UpdateExpression') return;
    if (parent.type=='ForInStatement'&&parent.left==node) return;
    if (parent.type=='MethodDefinition'&&parent.key==node) return;
    if (parent.type=='AssignmentPattern'&&parent.left==node) return;
    if (parent.type=='NewExpression') return;
    if (parent?.parent?.type=='NewExpression') return;
    if (parent.type=='UnaryExpression'&&parent.argument==node) return;
    if (parent.type=='Property' && parent.shorthand == true && parent.value == node) return;

    //if (node.name=='location') return node.name = '__dynamic$location'
    if (node.name == '__dynamic') return node.name = 'undefined';

    if (node.name=='eval' && parent.right !== node) return node.name = '__dynamic$eval';

    node.name = `dg$(${node.name})`;
}