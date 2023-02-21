export default function Iterate(ast:any, handler:any) {
    if (typeof ast != 'object' || !handler) return;
    walk(ast, null, handler);
    function walk(node:any, parent:any, handler:any) {
        if (typeof node != 'object' || !handler) return;
        node.parent = parent;
        handler(node, parent, handler);
        for (const child in node) {
            if (child === 'parent') continue;
            if (Array.isArray(node[child])) {
                node[child].forEach((entry:any) => { 
                    if (entry) walk(entry, node, handler)
                });
            } else {
                if (node[child]) walk(node[child], node, handler);
            };
        };
        if (typeof node.iterateEnd === 'function') node.iterateEnd();
    };
};