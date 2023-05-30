// why am i doing this

export default function Property(node: any, parent: any = {}) {
    if (node.parent.type == "ObjectPattern") return;
    if (node.parent?.parent?.type == "AssignmentExpression") return;

    node.shorthand = false;
}