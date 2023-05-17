import Client from '../../../../client/client';
import Srcset from '../../../rewrite/html/srcset';

export default function attributes(self: any) {
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
            a[1] = self.__dynamic.url.encode(a[1], self.__dynamic.meta);

            return Reflect.apply(t, g, a);
        }
    });

    self.HTMLElement.prototype.getAttribute = new Proxy(self.HTMLElement.prototype.getAttribute, {
        apply(t: any, g: any, a: any) {
            if (g.dataset[`dynamic_${a[0]}`]) return g.dataset[`dynamic_${a[0]}`];

            return Reflect.apply(t, g, a);
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
                                Client(_window, self.__dynamic$config, this.src);
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
                        console.log(this, val);
                        if (val && typeof val == 'string') val = val.toString();
                        if (config.action=='html') {
                            const blob = new Blob([val], {type: 'text/html'});

                            this.removeAttribute(tag);

                            (async () => {
                                const sw = (await self.__dynamic.sw.ready).active;
                                
                                self.__dynamic.sw.addEventListener('message', ({ data: {url} }: MessageEvent) => {
                                    if (url) {
                                        self.__dynamic.elements.iframeSrc.set.call(this, url);
                                    }
                                }, {once: true});

                                sw.postMessage({type: "createBlobHandler", blob, url: self.__dynamic.modules.base64.encode(val.toString().split('').slice(0, 10)), location: self.__dynamic.location.href});

                                return;
                            })();

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

                        if (config.action=='url') val = self.__dynamic.url.encode(val, self.__dynamic.meta);

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
            this.__innerHTML = val;

            if ((this instanceof self.HTMLScriptElement) || (this instanceof self.HTMLStyleElement) || (this instanceof self.HTMLTextAreaElement)) return self.__dynamic.elements.innerHTML.set.call(this, val);

            return self.__dynamic.elements.innerHTML.set.call(this, self.__dynamic.rewrite.html.rewrite(val, self.__dynamic.meta));
        }
    });

    self.__dynamic.define(self.HTMLElement.prototype, 'outerHTML', {
        get() {

            return (this.__outerHTML||self.__dynamic.elements.outerHTML.get.call(this)).toString();
        },
        set(val: any) {
            this.__outerHTML = val;

            if ((this instanceof self.HTMLScriptElement) || (this instanceof self.HTMLStyleElement) || (this instanceof self.HTMLTextAreaElement)) return self.__dynamic.elements.outerHTML.set.call(this, val);

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

        toString: {value: () => {return (new URL(self.__dynamic$location.href) as any).toString();}}
    });

    self.HTMLElement.prototype.insertAdjacentHTML = new Proxy(self.HTMLElement.prototype.insertAdjacentHTML, {
        apply(t, g, a) {
            return Reflect.apply(t, g, [a[0], self.__dynamic.rewrite.html.rewrite(a[1], self.__dynamic.meta)]);
        }
    });

    var int = setInterval(() => {
        if (self.document.head.querySelector('base')) {
            self.__dynamic.meta.load(new URL(self.__dynamic.url.decode(self.document.head.querySelector('base').href)));
            self.__dynamic.baseURL = new URL(self.__dynamic.url.decode(self.document.head.querySelector('base').href));
        }
    }, 0);

    self.document.addEventListener('DOMContentLoaded', () => {
        clearInterval(int);
    });
}