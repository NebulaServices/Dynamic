export default function wrap(self: any) {
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

    self.__dynamic.wrap = function(target: any, handler: any) {
        self.__dynamic.native[target.name] = target;

        if (self.__dynamic.native[target.name]) return self.__dynamic.native[target.name];

        if (target.toString().includes('{ [native code] }') && !target.prototype) {
            return function(this: any, ...args: any[]) {
                var handled = handler.apply(this, args);

                if (handled) return handled;

                return target.apply(this, args);
            }
        } else {
            try {
                self.__dynamic.t = class t extends target {
                    constructor(...args: any[]) {
                        handler.apply({}, args);

                        super(...args);
                    }
                }

                console.log(self.__dynamic.t)

                self.__dynamic.native.eval(`self.__dynamic.r = (class ${target.name} extends self.__dynamic.t {constructor(...args) {super(...args)}})`);

                var a = self.__dynamic.r;

                delete self.__dynamic.r;
                delete self.__dynamic.t;

                return a;
            } catch(e) {
                console.log(target, handler, e);

                return target;
            }
        }
    }
}