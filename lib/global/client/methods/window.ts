export default function window(self: any) {
    self.__dynamic.util.CreateDocumentProxy = function CreateDocumentProxy(document: any) {
        return new Proxy(document, {
            get(obj, prop): any {
                const val = obj[prop];
                if (prop=='location') if (document.defaultView) return document.defaultView.__dynamic$location;
                else return self.__dynamic$location;
                if (prop=='URL' && document.defaultView) return document.defaultView.__dynamic$location.toString();
                if (prop=='documentURI' && document.defaultView) return document.defaultView.__dynamic.location.toString();
                if (prop=='baseURI' && document.defaultView) return document.defaultView.__dynamic.location.toString();

                if (!val) return val;

                if (typeof val == 'function') return new Proxy(val, {apply(t, g, a) {if (document.defaultView && a[0] == document.defaultView.__dynamic$document) a[0] = document; else if (a[0] == self.__dynamic$document) a[0] = document; return Reflect.apply(t, document, a)}});

                return val;
            },
            set(obj, prop, value): any {
                try {
                    try {
                        if (document.defaultView.__dynamic) document.defaultView.__dynamic.Reflect.set(obj, prop, value);
                        else obj[prop] = value;
                    } catch(e) {
                        return value||true;
                    }
        
                    return value||true;
                } catch(e) {
                    console.log(e);
                    return false;
                }
            }
        });
    }

    self.__dynamic.util.CreateWindowProxy = function CreateWindowProxy(window: any) {
        return new Proxy(window, {
            get(obj, prop): any {
                const val = self.__dynamic.Reflect.get(obj, prop);

                if (Object.getOwnPropertyDescriptor(obj, prop)) {
                    var desc = Object.getOwnPropertyDescriptor(obj, prop);

                    if (desc?.configurable === false && desc?.writable === false && desc?.hasOwnProperty('enumerable'))
                        return desc?.value || desc?.get?.call(obj);
                }

                if (prop=='__dynamic$self') return window.window;

                //if (window.document) if (prop=='document') return window.__dynamic.util.CreateDocumentProxy(val);
                if (prop=='location') return window.__dynamic$location;
                if (prop=='parent') return window.top.__dynamic$window;
                if (prop=='top') return window.top.__dynamic$window;
                if (prop=='self') return window.__dynamic$window;
                if (prop=='globalThis') return window.__dynamic$window;

                if (!val) return val;

                if (typeof val == 'function') return new Proxy(val, {apply(t, g, a) {return Reflect.apply(t, window, a)}});

                return val;
            },
            set(obj, prop, value): any {
                try {
                    if (obj.hasOwnProperty('undefined') && obj[prop]+''==prop) return obj[prop];
                    if (prop=='location') return window.__dynamic$location = value;

                    try {
                        if (window.__dynamic) window.__dynamic.Reflect.set(obj, prop, value);
                        else obj[prop] = value;
                    } catch(e) {
                        return value||true;
                    }

                    return value||true;
                } catch(e) {
                    return obj[prop];
                }
            },
        })
    }

    self.__dynamic.define(self, '__dynamic$window', {
        value: self.__dynamic.util.CreateWindowProxy(self),
        configurable: false,
        enumerable: false,
        writable: false,
    });

    if (self.document) self.__dynamic.define(self, '__dynamic$document', {
        value: self.__dynamic.util.CreateDocumentProxy(self.document),
        configurable: false,
        enumerable: false,
        writable: false,
    });

    self.__dynamic$globalThis = self.__dynamic$window;
    self.__dynamic$self = self.__dynamic$window;
}