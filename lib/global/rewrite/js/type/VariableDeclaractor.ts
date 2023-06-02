export default function VariableDeclarator(node: any, parent: any = {}) {
    if (node.id.type !== 'Identifier') return false;
    if (node.id.__dynamic === true) return;

    if (node.id.name == 'location') return;// node.id.name = '__dynamic$location';
}