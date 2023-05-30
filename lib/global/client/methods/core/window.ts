const __window: any = globalThis;

export default function window(self: Window | any) {
    const _postMessage = self.postMessage;

    self.__dynamic.util.CreateDocumentProxy = function CreateDocumentProxy(document: any) {
        return new Proxy(document, {
            get(obj, prop): any {
                const val = obj[prop];
                if (prop=='__dynamic$check') return true;
                if (prop=='location') if (document.defaultView) return document.defaultView.__dynamic$location;
                else return self.__dynamic$location;
                if (prop=='URL' && document.defaultView) return document.defaultView.__dynamic$location.toString();
                if (prop=='documentURI' && document.defaultView) return document.defaultView.__dynamic.location.toString();
                if (prop=='baseURI' && document.defaultView) return document.defaultView.__dynamic.location.toString();

                if (!val) return val;

                if (typeof val == 'function' && val.toString == self.Object.toString) return new Proxy(val, {apply(t, g, a) {if (document.defaultView && a[0] == document.defaultView.__dynamic$document) a[0] = document; else if (a[0] == self.__dynamic$document) a[0] = document; return val.apply(document, a)}});

                return val;
            },
            set(obj, prop, value): any {
                try {
                    try {
                        if (document.defaultView.__dynamic) document.defaultView.__dynamic.Reflect.set(obj, prop, value);
                        else obj[prop] = value;
                    } catch(e) {
                        return false;
                    }
        
                    return value || true;
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

                if (prop=='__dynamic$self') return obj;
                
                if (prop == 'postMessage')
                    return window.__dynamic$message(self, obj);

                if (prop == '_postMessage') 
                    return _postMessage.bind(obj);

                if (prop=='location') return window.__dynamic$location;
                if (prop=='parent') return window.parent.__dynamic$window;
                if (prop=='top') return window.top.__dynamic$window;
                if (prop=='self') return window.__dynamic$window;
                if (prop=='globalThis') return window.__dynamic$window;

                if (prop == "NaN") return NaN;

                if (!val) return val;
                
                // Check if the value is a native function to the window, and rewrite it if it is
                if (typeof val == 'function' /*&& val.toString == self.Object.toString && val.toString().includes('[native code]')*/) return new Proxy(val, {apply(t, g, a) {if (a[0] == self.__dynamic$window) a[0] = window; return val.apply(window, a)}, set(obj, prop, value) {return self.__dynamic.Reflect.set(obj, prop, value)}});

                return val;
            },
            set(obj, prop, value): any {
                if (prop == 'onerror') return value;
                try {
                    if (obj.hasOwnProperty('undefined') && obj[prop]+''==prop) return obj[prop];
                    if (prop=='location') return window.__dynamic$location = value;

                    try {
                        if (window.__dynamic) window.__dynamic.Reflect.set(obj, prop, value);
                        else obj[prop] = value;
                    } catch(e) {
                        return false;
                    }

                    return value||true;
                } catch(e) {
                    return false;
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

    if (typeof self.globalThis !== 'undefined') self.__dynamic$globalThis = self.__dynamic$window;
    if (typeof self.self !== 'undefined') self.__dynamic$self = self.__dynamic$window;
    if (typeof self.parent !== 'undefined') self.__dynamic$parent = self.parent.__dynamic$window;
    if (typeof self.top !== 'undefined') self.__dynamic$top = self.top.__dynamic$window;

    self.__dynamic.eval = self.__dynamic.wrap(eval, function() {
        if (!arguments.length) return;
        var script = arguments[0].toString();

        script = self.__dynamic.rewrite.js.rewrite(script, {type: 'script'}, false, self.__dynamic);

        return self.eval(script);
    });

    self.__dynamic.define(self.Object.prototype, '__dynamic$eval', {
            get() {
                return this === window ? self.__dynamic.eval : this.eval;
            },
            set(val: any) {
                return val;
            },
        }
    );

    self.__dynamic.define(self, 'origin', {
        get() {
            return self.__dynamic$location.origin;
        }
    });

    if (self.MouseEvent) self.MouseEvent.prototype.initMouseEvent = new Proxy(self.MouseEvent.prototype.initMouseEvent, {
        apply(t, g, a) {
            if (a.length) a = a.map(e=>e==self.__dynamic$window?self:e);

            return Reflect.apply(t, g, a);
        }
    });

    if (self.KeyboardEvent) self.KeyboardEvent.prototype.initKeyboardEvent = new Proxy(self.KeyboardEvent.prototype.initKeyboardEvent, {
        apply(t, g, a) {
            if (a.length) a = a.map(e=>e==self.__dynamic$window?self:e);

            return Reflect.apply(t, g, a);
        }
    });
}