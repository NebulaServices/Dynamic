export default function Location(self: any) {
    self.__dynamic$history = {
        apply(t: any, g: any, a: any) {
            if (a[2]) a[2] = self.__dynamic.url.encode(a[2], self.__dynamic.meta);

            var moved = Reflect.apply(t, g, a);

            self.__dynamic.client.location(self);

            return moved;
        }
    }
    
    self.History.prototype.pushState = new Proxy(self.History.prototype.pushState, self.__dynamic$history)
    self.History.prototype.replaceState = new Proxy(self.History.prototype.replaceState, self.__dynamic$history)
}