export default function worker(self: any) {
    const XHR = self.XMLHttpRequest;

    self.Worker = new Proxy(self.Worker, {
        construct(t: any, a: any):any {
            if (a[0])  {
                a[0] = a[0].toString();
                if (a[0].trim().startsWith(`blob:${self.__dynamic$location.origin}`)) {
                    const xhr = new XHR;
                    xhr.open('GET', a[0], false);
                    xhr.send();
                    const script = self.__dynamic.rewrite.js.rewrite(xhr.responseText, { type: 'worker' }, true);
                    const blob = new Blob([ script ], { type: 'application/javascript' });
                    a[0] = URL.createObjectURL(blob);
                } else {
                    a[0] = self.__dynamic.url.encode(a[0], self.__dynamic.meta);
                };
            };

            return Reflect.construct(t, a);
        }
    })
}