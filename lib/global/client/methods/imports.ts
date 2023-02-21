export default function Imports(self: any) {
    self.importScripts = new Proxy(self.importScripts, {
        apply(t, g, a) {
            [...a].forEach((url, index) => {
                a[index] = self.__dynamic.url.encode(url, self.__dynamic.meta);
            });

            console.log(a);

            return Reflect.apply(t, g, a);
        }
    })
}