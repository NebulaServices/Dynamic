import Client from '../../../../client/client';
import Srcset from '../../../rewrite/html/srcset';

export default function attributes(self: Window | any) {
    self.HTMLElement.prototype.setAttribute = new Proxy(self.HTMLElement.prototype.setAttribute, {
        apply(t: any, g: any, a: any) {
            if (self.__dynamic.elements.attributes.indexOf(a[0].toLowerCase())==-1) return Reflect.apply(t, g, a);

            if (a[0].toLowerCase()=='srcset' || a[0].toLowerCase() == 'imagesrcset') {
                a[1] = Srcset.encode(a[1], self.__dynamic);

                return Reflect.apply(t, g, a);
            }

            if (a[0].toLowerCase()=='integrity'||a[0].toLowerCase()=='nonce') {
                g.removeAttribute(a[0]);

                return Reflect.apply(t, g, ['nointegrity', a[1]]);
            }

            g.dataset['dynamic_'+a[0]] = a[1];
            a[1] = self.__dynamic.url.encode(a[1], self.__dynamic.baseURL || self.__dynamic.meta);

            return Reflect.apply(t, g, a);
        }
    });

    self.HTMLElement.prototype.setAttributeNS = new Proxy(self.HTMLElement.prototype.setAttributeNS, {
        apply(t: any, g: any, a: any) {
            if (self.__dynamic.elements.attributes.indexOf(a[0].toLowerCase())==-1) return Reflect.apply(t, g, a);

            if (a[1].toLowerCase()=='srcset' || a[1].toLowerCase() == 'imagesrcset') {
                a[2] = Srcset.encode(a[2], self.__dynamic);

                return Reflect.apply(t, g, a);
            }

            if (a[0].toLowerCase()=='integrity'||a[0].toLowerCase()=='nonce') {
                g.removeAttribute(a[1]);

                return Reflect.apply(t, g, ['nointegrity', a[2]]);
            }

            g.dataset['dynamic_'+a[1]] = a[2];
            a[2] = self.__dynamic.url.encode(a[2], self.__dynamic.baseURL || self.__dynamic.meta);

            return Reflect.apply(t, g, a);
        }
    });

    self.HTMLElement.prototype.getAttribute = new Proxy(self.HTMLElement.prototype.getAttribute, {
        apply(t: any, g: any, a: any) {
            if (g.dataset[`dynamic_${a[0]}`]) return g.dataset[`dynamic_${a[0]}`];

            return Reflect.apply(t, g, a);
        }
    });

    self.document.createElement = new Proxy(self.document.createElement, {
        apply(t: any, g: any, a: any) {
            const element: any = Reflect.apply(t, g, a);

            if (a[0].toLowerCase()=='script') element.onerror = console.log

            if (a[0].toLowerCase()=='iframe') (element.src = 'about:blank', element.loading = 'lazy');

            return element;
        }
    });

    self.__dynamic.elements.config.forEach((config: any) => {
        config.elements.forEach((element: any) => {
            config.tags.forEach((tag: string) => {
                var descriptor: PropertyDescriptor | any = Object.getOwnPropertyDescriptor(element.prototype, tag);

                if (!descriptor) descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, tag);

                self.__dynamic.define(element.prototype, tag, {
                    get() {
                        if (config.action=='window') {
                            const _window: any = self.__dynamic.elements.contentWindow.get.call(this);

                            let origin = true;

                            try {
                                _window.location.href
                            } catch {origin = false;};

                            if (origin) if (!_window.__dynamic) {
                                Client(_window, self.__dynamic$config, decodeURIComponent(this.src));
                            }

                            if (!origin && tag == 'contentDocument') return _window.document;
                            if (!origin && tag == 'contentWindow') return _window;

                            if (tag=='contentDocument') {
                                return _window.document;
                            }
                            if (tag=='contentWindow') {
                                return _window.__dynamic$window || _window;
                            }
                        }

                        if (config.action=='css') {
                            return descriptor.get.call(this);
                        }

                        try {
                            return self.__dynamic.url.decode(descriptor.get.call(this));
                        } catch {};

                        return descriptor.get.call(this);
                    },
                    set(val: any) {
                        if (val && typeof val == 'string') val = val.toString();
                        if (config.action=='html') {
                            this.removeAttribute(tag);

                            Promise.resolve(self.__dynamic.createBlobHandler(new Blob([val], {type: 'text/html'}), this, val)).then((url: string) => {this.setAttribute(tag, url);});

                            return val;
                        }

                        if (config.action=='srcset') {
                            val = Srcset.encode(val, self.__dynamic);
                        }

                        if (config.action=='rewrite') {
                            this.removeAttribute(tag);

                            return this.setAttribute(config.new, val);
                        }

                        if (config.action=='css') {
                            val = self.__dynamic.rewrite.css.rewrite(val, self.__dynamic.meta);
                        }

                        if (config.action=='url') val = self.__dynamic.url.encode(val, self.__dynamic.baseURL || self.__dynamic.meta);

                        return descriptor.set.call(this, val);
                    }
                })
            })
        })
    });

    self.__dynamic.define(self.HTMLElement.prototype, 'innerHTML', {
        get() {
            return (this.__innerHTML||self.__dynamic.elements.innerHTML.get.call(this)).toString(); 
        },
        set(val: any) {
            this.__innerHTML = new DOMParser().parseFromString(val, 'text/html').body.innerHTML


            if (this instanceof self.HTMLTextAreaElement) return self.__dynamic.elements.innerHTML.set.call(this, val);
            if (this instanceof self.HTMLScriptElement) return self.__dynamic.elements.innerHTML.set.call(this, self.__dynamic.rewrite.js.rewrite(val, {type: 'script'}));
            if (this instanceof self.HTMLStyleElement) return self.__dynamic.elements.innerHTML.set.call(this, self.__dynamic.rewrite.css.rewrite(val, self.__dynamic.meta));

            return self.__dynamic.elements.innerHTML.set.call(this, self.__dynamic.rewrite.html.rewrite(val, self.__dynamic.meta));
        }
    });

    self.__dynamic.define(self.HTMLElement.prototype, 'outerHTML', {
        get() {

            return (this.__outerHTML||self.__dynamic.elements.outerHTML.get.call(this)).toString();
        },
        set(val: any) {
            this.__outerHTML = new DOMParser().parseFromString(val, 'text/html').body.innerHTML

            if (this instanceof self.HTMLTextAreaElement) return self.__dynamic.elements.outerHTML.set.call(this, val);
            if (this instanceof self.HTMLScriptElement) return self.__dynamic.elements.outerHTML.set.call(this, self.__dynamic.rewrite.js.rewrite(val, {type: 'script'}));
            if (this instanceof self.HTMLStyleElement) return self.__dynamic.elements.outerHTML.set.call(this, self.__dynamic.rewrite.css.rewrite(val, self.__dynamic.meta));

            return self.__dynamic.elements.outerHTML.set.call(this, self.__dynamic.rewrite.html.rewrite(val, self.__dynamic.meta));
        }
    });
    
    self.MutationObserver.prototype.observe = new Proxy(self.MutationObserver.prototype.observe, {
        apply(t, g, a) {
            if (a[0]==self.__dynamic$document) a[0] = self.document;

            return Reflect.apply(t, g, a);
        }
    });

    Object.defineProperties(self.HTMLAnchorElement.prototype, {
        pathname: self.__dynamic.elements.createGetter('pathname'),
        origin: self.__dynamic.elements.createGetter('origin'),
        host: self.__dynamic.elements.createGetter('host'),
        hostname: self.__dynamic.elements.createGetter('hostname'),
        port: self.__dynamic.elements.createGetter('port'),
        protocol: self.__dynamic.elements.createGetter('protocol'),
        search: self.__dynamic.elements.createGetter('search'),
        hash: self.__dynamic.elements.createGetter('hash'),

        toString: {get: function() {return this.__toString || (() => this.href?(new URL(this.href) as any).toString():'')}, set: function(v: Function) {this.__toString = v;}},
    });

    self.HTMLElement.prototype.insertAdjacentHTML = new Proxy(self.HTMLElement.prototype.insertAdjacentHTML, {
        apply(t, g, a) {
            if (g instanceof self.HTMLStyleElement) return Reflect.apply(t, g, [a[0], self.__dynamic.rewrite.css.rewrite(a[1], self.__dynamic.meta)])
            return Reflect.apply(t, g, [a[0], self.__dynamic.rewrite.html.rewrite(a[1], self.__dynamic.meta)]);
        }
    });

    [[self.Node, 'textContent'], [self.HTMLElement, 'innerText']].forEach(([el, attr]: any) => {
        var desc: any = Object.getOwnPropertyDescriptor(el.prototype, attr);

        self.__dynamic.define(self.HTMLStyleElement.prototype, attr, {
            get() {
                return this['__'+attr] || desc.get.call(this);
            },
            set(val: any) {
                this['__'+attr] = val;

                return desc.set.call(this, self.__dynamic.rewrite.css.rewrite(val, self.__dynamic.meta));
            }
        });
    });

    var int = setInterval(() => {
        if (!self.document?.head) return;

        if (self.document.head.querySelector('base')) {
            self.__dynamic.baseURL = new URL(self.document.head.querySelector('base').href);
        }
    }, 0);

    self.document.addEventListener('DOMContentLoaded', () => {
        clearInterval(int);
    });
}