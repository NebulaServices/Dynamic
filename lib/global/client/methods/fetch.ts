export default function Fetch(self: any) {
    self.Request = new Proxy(self.Request, {
        construct(t, a: any): any {
            if (a[0]) a[0] = self.__dynamic.url.encode(a[0], self.__dynamic.meta);

            return Reflect.construct(t, a);
        }
    });

    self.fetch = new Proxy(self.fetch, {
        apply(t, g, a): any {
            if (a[0] instanceof self.Request) return Reflect.apply(t, g, a);

            if (a[0]) a[0] = self.__dynamic.url.encode(a[0], self.__dynamic.meta);
            
            return Reflect.apply(t, g, a);
        }
    });

    self.XMLHttpRequest.prototype.open = new Proxy(self.XMLHttpRequest.prototype.open, {
        apply(t, g, a) {
            if (a[1]) a[1] = self.__dynamic.url.encode(a[1], self.__dynamic.meta);

            return Reflect.apply(t, g, a);
        }
    });

    self.Navigator.prototype.sendBeacon = new Proxy(self.Navigator.prototype.sendBeacon, {
        apply(t, g, a) {
            a[0] = self.__dynamic.url.encode(a[0], self.__dynamic.meta);

            console.log(a);
            return Reflect.apply(t, g, a);
        }
    });
}