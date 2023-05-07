export default function Imports(self: any) {
    self.importScripts = new Proxy(self.importScripts, {
        apply(t, g, a) {
            [...a].forEach((url, index) => {
                a[index] = self.__dynamic.url.encode(url, self.__dynamic.meta);
            });

            return Reflect.apply(t, g, a);
        }
    });

    self.__dynamic.define(self.__dynamic, '_location', {
        value: self.location,
        writable: true
    });

    self.__dynamic.define(self.WorkerGlobalScope.prototype, 'location', {
        get() {
            return self.__dynamic.location;
        },
        set(value: any) {
            return value;
        }
    });

    self.location = self.__dynamic.location;
}