/* niche methods that can be used to escape sandbox */

// document.origin, document.referrer, document.domain, window.performance.getEntries(), etc...

export default function Niche(self: any) {
    self.__dynamic.define(self.document, 'origin', {
        value: self.__dynamic$location.origin,
        configurable: false,
        enumerable: false,
    });

    self.__dynamic.define(self.document, 'referrer', {
        value: self.__dynamic$location.href,
        configurable: false,
        enumerable: false,
    });

    self.__dynamic.define(self.document, 'domain', {
        value: self.__dynamic$location.hostname,
        configurable: false,
        enumerable: false,
    });

    self.__dynamic.define(self.document, 'URL', {
        value: self.__dynamic$location.toString(),
        configurable: false,
        enumerable: false,
    });

    self.__dynamic.define(self.document, 'documentURI', {
        value: self.__dynamic$location.toString(),
        configurable: false,
        enumerable: false,
    });

    self.__dynamic.define(self.document, 'baseURI', {
        value: self.__dynamic$location.toString(),
        configurable: false,
        enumerable: false,
    });

    self.__dynamic.define(self.HTMLElement.prototype, 'baseURI', {
        value: self.__dynamic$location.toString(),
        configurable: false,
        enumerable: false,
    });

    ['getEntries', 'getEntriesByName', 'getEntriesByType'].forEach(prop => {
        self.performance[prop] = new Proxy(self.performance[prop], {
            apply(t, g, a) {
                return (Reflect.apply(t, g, a) as any).filter((e:any)=>!e.name?.includes(self.location.origin+'/dynamic/dynamic.')).filter((e:any)=>!e.name.includes(self.location.origin+self.__dynamic.config.prefix+'caches/')).map((e:any)=>{
                    if (e.name) {
                        var cloned = self.__dynamic.util.clone(e);
                        
                        cloned.__defineGetter__('name', function() {
                            return this._name;
                        });

                        cloned.__defineSetter__('name', function(value: any) {
                            this._name = value;
                        });

                        cloned.name = self.__dynamic.url.decode(e.name);

                        self.__dynamic.define(cloned, 'name', {
                            get: undefined,
                            set: undefined,
                        });

                        self.__dynamic.define(cloned, 'name', {
                            value: cloned._name,
                            writable: false,
                        })

                        delete cloned._name;

                        for (var i in e) {
                            if (i=='name') continue;

                            Object.defineProperty(cloned, i, {
                                value: e[i],
                                writable: false,
                            });
                        }

                        e = cloned;
                    }

                    return e;
                });
            }
        });
    });

    /*self.Function = new Proxy(self.Function, {
        apply(t, g, a: any) {
            var args: any = [...a];
            var body: any = args.pop();

            body = `(function anonymous(${args.toString()}) {${body}})`;

            body = self.__dynamic.rewrite.js.rewrite(body, {type: 'script'}, false, self.__dynamic);

            return self.eval(body);
        },
        construct(t, a: any) {
            var args: any = [...a];
            var body: any = args.pop();

            body = `(function anonymous(${args.toString()}) {${body}})`;

            body = self.__dynamic.rewrite.js.rewrite(body, {type: 'script'}, false, self.__dynamic);

            return self.eval(body);
        }
    });

    self.__dynamic.eval = function() {
        console.log(arguments);
        var script = arguments[0];

        script = self.__dynamic.rewrite.js.rewrite(script, {type: 'script'}, false, self.__dynamic);

        return self.eval(script);
    }

    self.__dynamic.define(self.Object.prototype, '__dynamic$eval', {
            get() {
                return this === window ? self.__dynamic.eval : this.eval;
            },
            set(val: any) {
                this.eval = val;
            },
        }
    );*/
}