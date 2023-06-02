import Identifier from './type/Identifier';
import MemberExpression from "./type/MemberExpression";
import Literal from './type/Literal';
import CallExpression from './type/CallExpression';
import AssignmentExpression from './type/AssignmentExpression';
import ThisExpression from './type/ThisExpression';
import Property from './type/Property';
import Imports from './type/Imports';
import VariableDeclarator from './type/VariableDeclaractor';

function Emit(node:any, type:any, parent:any = {}, ctx:any = {}, dynamic: any = {}, config: any = {}) {
    if (node.__dynamic) return;

    switch(type) {
        case "Identifier":
            Identifier(node, parent);
            break;
        case "MemberExpression":
            MemberExpression(node, parent, config);
            break;
        case "Literal":
            Literal(node, parent);
            break;
        case "CallExpression":
            CallExpression(node, parent);
            break;
        case "AssignmentExpression":
            AssignmentExpression(node, parent);
            break;
        case "ThisExpression":
            ThisExpression(node, parent);
            break;
        case "Property":
            Property(node, parent);
            break;
        case "VariableDeclarator":
            VariableDeclarator(node, parent);
            break;
        default:
            Imports(node, parent, ctx, dynamic);
            break;
    }

}

export default Emit;