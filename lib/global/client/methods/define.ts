export default function Define(self: any) {
    self.__dynamic.defined = {};
    return self.__dynamic.define = new self.Proxy(self.Object.defineProperty, {
        apply(t: any, g: any, a: any) {
            /*try {
                if (self.__dynamic.defined[a[0]] && self.__dynamic.defined[a[0]].includes(a[1])) return a[2];

                if (!self.__dynamic.defined[a[0]]) self.__dynamic.defined[a[0]] = [];
                self.__dynamic.defined[a[0]].push(a[1]);
            } catch {}*/

            try {
                return Reflect.apply(t, g, a);
            } catch {
                return a[2];
            }
        }
    });
}