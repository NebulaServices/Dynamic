import { Node } from "meriyah/dist/src/estree";
import { parseConsequentOrAlternative, parseLiteral } from "meriyah/dist/src/parser";
import Identifier from './type/Identifier';
import MemberExpression from "./type/MemberExpression";
import Literal from './type/Literal';

function Emit(node:any, type:any, parent:any = {}, debug: boolean = false) {

    switch(type) {
        case "Identifier":
            Identifier(node, parent);
            break;
        case "MemberExpression":
            MemberExpression(node, parent);
            break;
        case "Literal":
            Literal(node, parent);
        default:
            break;
    }

}

export default Emit;