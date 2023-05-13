import Eval from '../object/Eval';
import PostMessage from '../object/PostMessage';

export default function Literal(node: any, parent: any = {}) {
    if (!(node.value instanceof String)) return false;

    if (node.value==('__dynamic')) node.value = 'undefined';

    if (!['location', 'parent', 'top', 'postMessage'].includes(node.value)) return false;

    if (node.value=='postMessage' && parent.type != 'AssignmentExpression' && parent.left != node) PostMessage(node, parent);
    if (node.value=='location') node.value = '__dynamic$location';
    if (node.value=='__dynamic') node.value = 'undefined';
    if (node.value=='eval') node.value = '__dynamic$eval';
}