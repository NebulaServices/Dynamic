import Eval from '../object/Eval';
import PostMessage from '../object/PostMessage';

export default function Literal(node: any, parent: any = {}) {
    if (!(node.value instanceof String)) return false;

    if (node.value==('__dynamic')) node.value = 'undefined';

    if (!['location', 'parent', 'top', 'postMessage'].includes(node.value)) return false;

    if (node.value=='location') node.value = '__dynamic$location';
    if (node.value=='top') node.value = '__dynamic$top';
    if (node.value=='parent') node.value = '__dynamic$parent';
    if (node.value=='postMessage') PostMessage(node, parent);
}