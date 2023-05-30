export default function storage(self: Window | any) {
    self.__dynamic.storage = {
        localStorage: self.localStorage,
        sessionStorage: self.sessionStorage,
        keys: {
            localStorage: Object.keys(self.localStorage),
            sessionStorage: Object.keys(self.sessionStorage)
        },
        methods: ['getItem', 'setItem', 'removeItem', 'clear', 'length', 'keys', 'values', 'entries', 'forEach', 'hasOwnProperty', 'toString', 'toLocaleString', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor', 'key'],
    }, self.__dynamic.storage.cloned = {
        localStorage: self.__dynamic.util.clone(self.__dynamic.storage.localStorage),
        sessionStorage: self.__dynamic.util.clone(self.__dynamic.storage.sessionStorage)
    };

    self.Storage.prototype.setItem = self.__dynamic.wrap(self.Storage.prototype.setItem,
        function(this: Storage, target: Function, ...args: Array<string | Symbol>) {
            if (args[0]) args[0] = '__dynamic$' + self.__dynamic$location.host + '$' + args[0].toString();

            return (Reflect.apply(target, this, args) as undefined, true);
        }
    );

    self.Storage.prototype.getItem = self.__dynamic.wrap(self.Storage.prototype.getItem,
        function(this: Storage, target: Function, ...args: Array<string | Symbol>) {
            if (args[0]) args[0] = '__dynamic$' + self.__dynamic$location.host + '$' + args[0].toString();

            return (Reflect.apply(target, this, args) as string || null);
        }
    );

    self.Storage.prototype.removeItem = self.__dynamic.wrap(self.Storage.prototype.removeItem,
        function(this: Storage, target: Function, ...args: Array<string | Symbol>) {
            if (args[0]) args[0] = '__dynamic$' + self.__dynamic$location.host + '$' + args[0].toString();

            return (Reflect.apply(target, this, args) as undefined, true);
        }
    );

    self.Storage.prototype.clear = self.__dynamic.wrap(self.Storage.prototype.clear,
        function(this: Storage, target: Function, ...args: Array<string | Symbol>) {
            var keys: Array<any> = [];

            for (var i = 0; i < this.length; i++) {
                if (target.call(this, i)?.startsWith('__dynamic$' + self.__dynamic$location.host + '$')) keys.push(target.call(this, i)?.replace('__dynamic$' + self.__dynamic$location.host + '$', ''));
            }

            for (var key in keys) {
                target.call(this, keys[key]);
            }

            return true;
        }
    );

    self.Storage.prototype.key = self.__dynamic.wrap(self.Storage.prototype.key,
        function(this: Storage, target: Function, ...args: Array<string | Symbol | number | any>) {
            var keys: Array<any> = [];

            for (var i = 0; i < this.length; i++) {
                if (target.call(this, i)?.startsWith('__dynamic$' + self.__dynamic$location.host + '$')) keys.push(target.call(this, i)?.replace('__dynamic$' + self.__dynamic$location.host + '$', ''));
            }

            if (keys[args[0]]) return keys[args[0]];

            return null;
        }
    );

    ["localStorage", "sessionStorage"].forEach((storage: any) => {
        /*self.__dynamic.storage.cloned[storage].getItem = new Proxy(self[storage].getItem, {
            apply(t: any, g: any, a: any) {
                if (a[0]) a[0] = '__dynamic$' + self.__dynamic$location.host + '$' + a[0].toString();

                return Reflect.apply(t, self.__dynamic.storage[storage], a);
            }
        });

        self.__dynamic.storage.cloned[storage].setItem = new Proxy(self[storage].setItem, {
            apply(t: any, g: any, a: any) {
                if (a[0]) a[0] = '__dynamic$' + self.__dynamic$location.host + '$' + a[0].toString();

                return Reflect.apply(t, self.__dynamic.storage[storage], a);
            }
        });

        self.__dynamic.storage.cloned[storage].removeItem = new Proxy(self[storage].removeItem, {
            apply(t: any, g: any, a: any) {
                if (a[0]) a[0] = '__dynamic$' + self.__dynamic$location.host + '$' + a[0].toString();

                return Reflect.apply(t, self.__dynamic.storage[storage], a);
            }
        });

        self.__dynamic.storage.cloned[storage].clear = new Proxy(self[storage].clear, {
            apply(t: any, g: any, a: any) {
                self.__dynamic.storage.keys[storage].forEach((key: any) => {
                    if (key.startsWith('__dynamic$' + self.__dynamic$location.host + '$')) self.__dynamic.storage[storage].removeItem(key);
                });

                return;
            }
        });

        self.__dynamic.storage.cloned[storage].key = new Proxy(self[storage].key, {
            apply(t: any, g: any, a: any) {
                var keys = [];

                for (var i = 0; i < self.__dynamic.storage[storage].length; i++) {
                    if (self.__dynamic.storage[storage].key(i).startsWith('__dynamic$' + self.__dynamic$location.host + '$')) keys.push(self.__dynamic.storage[storage].key(i).replace('__dynamic$' + self.__dynamic$location.host + '$', ''));
                }

                return keys[a[0]]?.replace('__dynamic$' + self.__dynamic$location.host + '$', '') || null;
            }
        });*/

        self['__dynamic$'+storage] = new Proxy(self[storage], {
            get(target, prop: any): any {
                if (prop == 'length') {
                    var keys = [];

                    for (var i = 0; i < Object.keys(self.__dynamic.storage[storage]).length; i++) {
                        if (Object.keys(self.__dynamic.storage[storage])[i].startsWith('__dynamic$' + self.__dynamic$location.host + '$')) keys.push(Object.keys(self.__dynamic.storage[storage])[i].replace('__dynamic$' + self.__dynamic$location.host + '$', ''));
                    }
    
                    return keys.length;
                }

                if (self.__dynamic.storage.methods.includes(prop)) return self.__dynamic.storage.cloned[storage][prop].bind(self.__dynamic.storage[storage])

                return self.__dynamic.storage[storage].getItem('__dynamic$' + self.__dynamic$location.host + '$' + prop.toString());
            },
            set(target, prop: any, value: any): any {
                self.__dynamic.storage[storage].setItem('__dynamic$' + self.__dynamic$location.host + '$' + prop.toString(), value);

                return value || true;
            },
            deleteProperty(target, prop: any): any {
                return self.__dynamic.storage[storage].removeItem('__dynamic$' + self.__dynamic$location.host + '$' + prop.toString());
            }
        });

        delete self[storage];

        self[storage] = self['__dynamic$'+storage];
    });
}