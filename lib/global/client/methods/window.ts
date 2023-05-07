export default function Window(self: any) {
    self.__dynamic.util.CreateDocumentProxy = function CreateDocumentProxy(document: any) {
        return new Proxy(document, {
            get(obj, prop): any {
                const val = obj[prop];
                if (prop=='location' && document.defaultView) return document.defaultView.__dynamic$location;
                if (prop=='URL' && document.defaultView) return document.defaultView.__dynamic$location.toString();
                if (prop=='documentURI' && document.defaultView) return document.defaultView.__dynamic.location.toString();
                if (prop=='baseURI' && document.defaultView) return document.defaultView.__dynamic.location.toString();

                if (!val) return val;

                if (typeof val == 'function') return new Proxy(val, {apply(t, g, a) {return Reflect.apply(t, document, a)}});

                return val;
            },
            set(obj, prop, value): any {
    
                obj[prop] = value;
    
                return true;
            }
        });
    }

    self.__dynamic.util.CreateWindowProxy = function CreateWindowProxy(window: any) {
        return new Proxy(window, {
            get(obj, prop): any {
                const val = obj[prop];
                //if (window.document) if (prop=='document') return window.__dynamic.util.CreateDocumentProxy(val);
                if (prop=='location') return window.__dynamic$location;
                if (prop=='parent') return window.top.__dynamic$window;
                if (prop=='top') return window.top.__dynamic$window;

                if (prop=='postMessage') return window.__dynamic$message(window);

                if (!val) return val;

                if (typeof val == 'function') return new Proxy(val, {apply(t, g, a) {return Reflect.apply(t, window, a)}});

                return val;
            },
            set(obj, prop, value): any {
                window.__dynamic.Reflect.set(obj, prop, value);

                return value||true;
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