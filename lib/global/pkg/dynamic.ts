import { ForInStatement, Node } from "seafox/dist/parser/types";

const ser = (node: any, Script = new script(node)) => {
    if (types[node.type]) {
        types[node.type](node, Script);
    } else {
        console.log(node);
    }

    return Script.serialize();
}

const VariableType: Function = (num: number) => num==2?'var':num==16?'let':num==32?'const':'var';

const SerializeArray: Function = (Node: any) => {
    var data = [];
    for (var i = 0; i < Node.elements.length; i++) {
        var node = Node.elements[i];
        if (node.type == 'Literal') {
            data.push(node.value);
        } else if (node.type == 'ArrayExpression') {
            data.push(SerializeArray(node));
        }
    }
    return JSON.stringify(data);
}

const SerializeArguments: Function = (Node: any) => {
    var data = [];
    for (var i = 0; i < Node.length; i++) {
        var node = Node[i];

        data.push(ser(node));
    }

    return data.join(',');
}

const types: Object | any = {
    ForStatement: (node: any, Script: script) => {
        Script.write('for (');

        if (node.init) {
            Script.write(ser(node.init));
        }

        Script.write(';');

        if (node.test) {
            Script.write(ser(node.test));
        }

        Script.write(';');

        if (node.update) {
            Script.write(ser(node.update));
        }

        Script.write(') ');
        Script.write(ser(node.body));
        Script.write(';');
    },
    ForOfStatement: (node: any, Script: script) => {
        Script.write('for (');

        if (node.left.type == 'VariableDeclaration') {
            var op = VariableType(node.left.kind);
            Script.write(op+' ');
            if (node.left.declarations[0].id.type == 'Identifier') {
                if (node.right.type == "ArrayExpression")
                    Script.write(`${node.left.declarations[0].id.name} of ${SerializeArray(node.right)}) `);
                if (node.right.type == "Identifier")
                    Script.write(`${node.left.declarations[0].id.name} of ${node.right.name}) `);
                if (node.right.type == "CallExpression")
                    Script.write(`${node.left.declarations[0].id.name} of ${ser(node.right)}) `);
            }
        } else {
            //Script.write(node.left);
        }

        Script.write(ser(node.body));
        Script.write(';');
    },
    ForInStatement: (node: ForInStatement | any, Script: script) => {
        Script.write('for (');

        if (node.left.type == 'VariableDeclaration') {
            var op = VariableType(node.left.kind);
            Script.write(op+' ');
            if (node.left.declarations[0].id.type == 'Identifier') {
                if (node.right.type == "ArrayExpression")
                    Script.write(`${node.left.declarations[0].id.name} in ${SerializeArray(node.right)}) `);
                if (node.right.type == "Identifier")
                    Script.write(`${node.left.declarations[0].id.name} in ${node.right.name}) `);
                if (node.right.type == "CallExpression")
                    Script.write(`${node.left.declarations[0].id.name} in ${ser(node.right)}) `);
            }
        } else {
            //Script.write(node.left);
        }

        Script.write(ser(node.body));
        Script.write(';');
    },
    BlockStatement: (node: Node, Script: script) => {
        Script.write('{');
        Script.write(gen(node));
        Script.write('}');
        Script.write(';');
    },
    Program: (node: any, Script: script) => {
        return;
    },
    ExpressionStatement: (node: any, Script: script) => {
        console.log(node);
        Script.write(ser(node.expression));
        Script.write(';');
    },
    CallExpression: (node: any, Script: script) => {
        Script.write(ser(node.callee));
        Script.write('(');
        Script.write(SerializeArguments(node.arguments));
        Script.write(')');
    },
    MemberExpression: (node: any, Script: script) => {
        if (node.computed) {
            Script.write(ser(node.object));
            Script.write('[');
            Script.write(ser(node.property));
            Script.write(']');
        } else {
            Script.write(ser(node.object));
            Script.write('.');
            Script.write(ser(node.property));
        }
    },
    Identifier: (node: any, Script: script) => {
        Script.write(node.name);
    },
    Literal: (node: any, Script: script) => {
        if (node.regex) return Script.write(node.regex);
        if (!node.value) return Script.write(node.value);
        if (node.value.constructor.name=='Number') return Script.write(node.value);

        console.log(node.value)

        var quote = `"`;
        
        if (node.value.includes(quote)) quote = "'";
        if (node.value.includes(quote)) quote = "`";


        Script.write(quote);
        Script.write(node.value);
        Script.write(quote);
    },
    LogicalExpression: (node: any, Script: script) => {
        Script.write(ser(node.left));
        Script.write(node.operator);
        Script.write(ser(node.right));
    },
    FunctionExpression: (node: any, Script: script) => {
        console.log(node);
        Script.write('(');
        if (node.async) Script.write('async ');
        Script.write(`function${node.generator?'*':''} ${node.id?ser(node.id):''}(`);
        Script.write(SerializeArguments(node.params));
        Script.write(') ');
        Script.write(ser(node.body));
        Script.write(')');
    },
    FunctionDeclaration: (node: any, Script: script) => {
        Script.write(`function${node.generator?'*':''} ${node.id?node.id:''}(`);
        Script.write(SerializeArguments(node.params));
        Script.write(') ');
        Script.write(ser(node.body));
    },
    VariableDeclaration: (node: any, Script: script) => {
        var op = VariableType(node.kind);
        Script.write(op+' ');
        Script.write(SerializeArguments(node.declarations));
    },
    VariableDeclarator: (node: any, Script: script) => {
        Script.write(ser(node.id));
        Script.write('=');
        Script.write(ser(node.init));
    },
    BinaryExpression: (node: any, Script: script) => {
        Script.write(ser(node.left));
        Script.write(node.operator);
        Script.write(ser(node.right));
    },
    UnaryExpression: (node: any, Script: script) => {
        Script.write(node.operator);
        Script.write(ser(node.argument));
    },
    UpdateExpression: (node: any, Script: script) => {
        Script.write(ser(node.argument));
        Script.write(node.operator);
    }
}

class script {
    script: Array<Object|any> = [];
    ast = {};

    constructor(ast: any) {
        this.ast = ast;
    }

    write(data: any) {
        this.script.push({ type: "write", data });
        return this.script;
    }

    serialize() {
        return this.script.map((e: object|any)=>{
            return e.data;
        }).join(``);
    }
}

export const gen = (ast: any, Script = new script(ast)) => {
    for (var i = 0; i < ast.body.length; i++) {
        var node: Node = ast.body[i];

        console.log(node, types[node.type]);

        if (types[node.type]) {
            types[node.type](node, Script);
        }
    }

    return Script.serialize();
}