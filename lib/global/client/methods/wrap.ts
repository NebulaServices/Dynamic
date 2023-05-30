export default function wrap(self: Window | any) {
    self.__dynamic.native = {};

    self.__dynamic.define = new self.Proxy(self.Object.defineProperty, {
        apply(t: any, g: any, a: any) {
            try {
                return Reflect.apply(t, g, a);
            } catch {
                return a[2];
            }
        }
    });

    self.__dynamic.wrap = function(target: any, handler: any, result: any) {
        if (target.toString().includes('{ [native code] }') && !target.prototype) {
            var g = handler;
            var t = target;
            var f: any = function(this: any, ...a: any[]) {
                var v = g.call(this, t, ...a);
                return v;
            }

            var func: any = function(this: any, ...a: any[]) {return f.call(this, ...a)};

            func.__dynamic$target = target;

            func.toString = () => {return `function ${target.name}() { [native code] }`}

            return func;
        } else {
            try {
                const p = class extends target {
                    constructor(...args: any[]) {
                        var og = [...args];

                        var handled = handler.call(target, target, ...args);

                        if (handled) args = handled;

                        super(...args);

                        if (result) result(this, og)
                    }
                }

                Object.defineProperty(p, 'name', {
                    value: target.name,
                    writable: false,
                });

                return p;
            } catch(e) {
                console.log(target, handler, e);

                return target;
            }
        }
    }
}