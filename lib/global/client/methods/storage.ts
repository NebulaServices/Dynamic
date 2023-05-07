export default function Storage(self: any) {
    /*self.__dynamic.storage = {
        localStorage: self.localStorage,
        sessionStorage: self.sessionStorage,
        keys: {
            localStorage: Object.keys(self.localStorage),
            sessionStorage: Object.keys(self.sessionStorage)
        }
    }, self.__dynamic.storage.cloned = {
        localStorage: self.__dynamic.util.clone(self.__dynamic.storage.localStorage),
        sessionStorage: self.__dynamic.util.clone(self.__dynamic.storage.sessionStorage)
    };

    ['localStorage', 'sessionStorage'].forEach(method => {
        self.__dynamic.storage[method].getItem = new Proxy(self.__dynamic.storage[method].getItem, {
            apply(t, g, a) {
                if (a[0].startsWith(self.__dynamic$location.host)) return self.__dynamic.storage.cloned.localStorage.getItem.call(self.localStorage, ...a);

                a[0] = self.__dynamic$location.host + a[0];

                return self.__dynamic.storage.cloned.localStorage.getItem.call(self.localStorage, ...a);
            }
        });

        self.__dynamic.storage[method].setItem = new Proxy(self.__dynamic.storage[method].setItem, {
            apply(t, g, a) {
                if (a[0].startsWith(self.__dynamic$location.host)) return self.__dynamic.storage.cloned.localStorage.setItem.call(self.localStorage, ...a);

                a[0] = self.__dynamic$location.host + a[0];

                return self.__dynamic.storage.cloned.localStorage.setItem.call(self.localStorage, ...a);
            }
        });
    });

    const _localStorage = self.localStorage;
    const _sessionStorage = self.sessionStorage;

    delete self.localStorage;
    delete self.sessionStorage;

    const isLocalItem = (property: any) => property != "setItem" && property != "getItem" && property != "removeItem" && property != "key" && property != "clear" && property != "length" && property != "constructor"

    self.localStorage = new Proxy(self.__dynamic.storage.cloned.localStorage, {
        get(obj, prop): any {
            if (isLocalItem(prop)) {
                return self.__dynamic.storage.cloned.localStorage.getItem.call(_localStorage, prop.toString());
            }

            return self.__dynamic.Reflect.get(self.__dynamic.storage.localStorage, prop);
        },
        set(obj, prop, value): any {
            if (isLocalItem(prop)) {
                return self.__dynamic.storage.cloned.localStorage.setItem.call(_localStorage, prop.toString(), value);
            }

            return value;
        },
        deleteProperty(obj, prop): any {
            if (isLocalItem(prop)) {
                return self.__dynamic.storage.cloned.localStorage.removeItem.call(_localStorage, prop.toString());
            }

            return true;
        }
    });

    self.localStorage.setItem */
}