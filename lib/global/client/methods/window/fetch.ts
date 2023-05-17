import Client from '../../../../client/client'

export default function fetch(self: any) {
    self.Request = new Proxy(self.Request, {
        construct(t, a: any): any {
            if (a[0]) a[0] = self.__dynamic.url.encode(a[0], self.__dynamic.meta);

            const req: Request | any = Reflect.construct(t, a);

            return req;
        }
    });

    self.__dynamic.define(self.Request.prototype, 'url', {
        get() {
            return self.__dynamic.url.decode(self.__dynamic.http.RequestURL.get.call(this));
        },
        set(value: any) {
            return value;
        }
    });

    self.fetch = new Proxy(self.fetch, {
        apply(t, g, a): any {
            if (a[0]) if (a[0].constructor.name == 'Request') return Reflect.apply(t, g, a);

            if (a[0]) a[0] = self.__dynamic.url.encode(a[0], self.__dynamic.meta);
            
            return Reflect.apply(t, g, a);
        }
    });

    self.XMLHttpRequest.prototype.open = new Proxy(self.XMLHttpRequest.prototype.open, {
        apply(t, g, a) {
            console.log(a);
            if (a[1]) a[1] = self.__dynamic.url.encode(a[1], self.__dynamic.meta);
            if (a[2]===false) a[2] = true;

            console.log(t, g, a);
            
            return Reflect.apply(t, g, a);
        }
    });

    Object.defineProperty(self.XMLHttpRequest.prototype, 'responseURL', {
        get() {
            return self.__dynamic.url.decode(self.__dynamic.http.XMLResponseURL.get.call(this));
        },
        set(value: any) {
            return value;
        }
    });

    Object.defineProperty(self.Response.prototype, 'url', {
        get() {
            return self.__dynamic.url.decode(self.__dynamic.http.ResponseURL.get.call(this));
        },
        set(value: any) {
            return value;
        }
    });

    self.Navigator.prototype.sendBeacon = new Proxy(self.Navigator.prototype.sendBeacon, {
        apply(t, g, a) {
            if (a[0]) a[0] = self.__dynamic.url.encode(a[0], self.__dynamic.meta);

            return Reflect.apply(t, g, a);
        }
    });

    self.open = new Proxy(open, {
        apply(t, g, a) {
            if (a[0]!='') if (a[0]) a[0] = self.__dynamic.url.encode(a[0], self.__dynamic.meta);

            if (a[0]=='') a[0] = 'about:blank';

            const win = Reflect.apply(t, g, a);

            win.opener = self.__dynamic$window;
            if (new URL(a[0]).protocol == 'about:') win.__dynamic$url = 'about:srcdoc';
            else win.__dynamic$url = self.__dynamic.url.decode(a[0]);

            Client(win, self.__dynamic$config);

            return self.__dynamic.util.CreateWindowProxy(win);
        }
    });

    self.__dynamic$import = function(url: any) {
        return self.__dynamic.url.encode(url, self.__dynamic.meta);
    }

    if ('serviceWorker' in navigator) {
        self.__dynamic.sw = self.navigator.serviceWorker;

        delete self.navigator.serviceWorker;
        delete self.Navigator.prototype.serviceWorker;
    }
}