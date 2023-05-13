export default function niche(self: any) {
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
                        
                        cloned.__defineGetter__('name', function(this: any) {
                            return this._name;
                        });

                        cloned.__defineSetter__('name', function(this: any, value: any) {
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
                        });

                        delete cloned._name;

                        for (var i in e) {
                            if (i=='name') continue;

                            if (typeof e[i] == 'function') var val = new Proxy(e[i], {apply(t, g, a) {if (t.name=='toJSON') {var b: any = {}; for (var c in cloned) b[c] = cloned[c]; return b;}; return Reflect.apply(t, e, a)}});
                            else var val = e[i];

                            Object.defineProperty(cloned, i, {
                                value: val,
                                writable: true,
                            });
                        }

                        e = cloned;
                    }

                    return e;
                });
            }
        });
    });

    var _toString = self.Function.prototype.toString;

    self.__dynamic.define(self.Function.prototype, 'toString', {
        value: function(this: any) {
            var string: string = Reflect.apply(_toString, this, []);
            if (string.includes('[native code]')) {
                return `function ${this.name}() { [native code] }`;
            }

            return string;
        },
        writable: true,
    });

    self.Function.prototype.bind = new Proxy(self.Function.prototype.bind, {
        apply(t, g, a) {
            if (a[0] == self.__dynamic$window) a[0] = a[0].__dynamic$self;

            return Reflect.apply(t, g, a);
        }
    });

    self.__dynamic.Function = self.Function.bind({});

    self.Function = new Proxy(self.Function, {
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
        if (!arguments.length) return;
        var script = arguments[0].toString();

        script = self.__dynamic.rewrite.js.rewrite(script, {type: 'script'}, false, self.__dynamic);

        return self.eval(script);
    }

    self.__dynamic.define(self.Object.prototype, '__dynamic$eval', {
            get() {
                return this === window ? self.__dynamic.eval : this.eval;
            },
            set(val: any) {
                return val;
            },
        }
    );

    self.Function.prototype.apply = new Proxy(self.Function.prototype.apply, {
        apply(t, g, a) {
            if (a[0] == self.__dynamic$window) a[0] = a[0].__dynamic$self;
            if (a[0] == self.__dynamic$document) a[0] = self.document;

            return Reflect.apply(t, g, a);
        }
    });

    self.Function.prototype.call = new Proxy(self.Function.prototype.call, {
        apply(t, g, a) {
            if (a[0] == self.__dynamic$window) a[0] = a[0].__dynamic$self;
            if (a[0] == self.__dynamic$document) a[0] = self.document;

            return Reflect.apply(t, g, a);
        }
    });

    /*self.onerror = function() {
        console.log(arguments);
        throw "";
        try {throw new Error("ErrorStackTrace")} catch(e) {console.error(e)};
    }*/

    /* favicon request emulation */
    if (!document.querySelector('link[rel="icon"], link[rel="shortcut icon"]') && self.__dynamic$location.pathname == "/") {
        var link = document.createElement('link');
        link.rel = 'icon';
        link.href = '/favicon.ico';

        link.dataset['dynamic_hidden'] = 'true';

        link.onerror = () => link.remove();
        link.onload = () => link.remove();

        document.head.appendChild(link);
    }
}