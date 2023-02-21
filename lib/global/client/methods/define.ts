export default function Define(self: any) {
    return self.__dynamic.define = new self.Proxy(self.Object.defineProperty, {
        apply(t: any, g: any, a: any) {
            return Reflect.apply(t, g, a);
        }
    })
}