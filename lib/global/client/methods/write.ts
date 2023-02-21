export default function write(self: any) {
    self.document.write = new Proxy(self.document.write, {
        apply(t, g, a) {
            if (a[0]) a[0] = self.__dynamic.rewrite.html.rewrite(a[0], self.__dynamic.meta);

            return Reflect.apply(t, g, a);
        }
    })
}