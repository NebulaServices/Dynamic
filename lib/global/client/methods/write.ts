export default function write(self: any) {
    self.document.write = new Proxy(self.document.write, {
        apply(t, g, a) {
            for (var arg in a) {
                a[arg] = self.__dynamic.rewrite.html.rewrite(a[arg], self.__dynamic.meta);
            }

            return Reflect.apply(t, g, a);
        }
    });

    self.document.writeln = new Proxy(self.document.writeln, {
        apply(t, g, a) {
            for (var arg in a) {
                a[arg] = self.__dynamic.rewrite.html.rewrite(a[arg], self.__dynamic.meta);
            }

            return Reflect.apply(t, g, a);
        }
    });
}