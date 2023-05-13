import Client from '../../../client/client';
import Srcset from '../../rewrite/html/srcset';

export default function attribute(self: any) {

    const ContentWindow: PropertyDescriptor | any = Object.getOwnPropertyDescriptor(self.HTMLIFrameElement.prototype, 'contentWindow');
    
    const IFrameSrc: PropertyDescriptor | any = Object.getOwnPropertyDescriptor(self.HTMLIFrameElement.prototype, 'src');

    const AttributeList: Array<string> = ['src', 'href', 'srcset', 'action', 'data', 'integrity', 'nonce'];

    self.HTMLElement.prototype.setAttribute = new Proxy(self.HTMLElement.prototype.setAttribute, {
        apply(t: any, g: any, a: any) {
            if (AttributeList.indexOf(a[0].toLowerCase())==-1) return Reflect.apply(t, g, a);

            if (a[0].toLowerCase()=='srcset') {
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

    const config: any = [
        {
            "elements": [self.HTMLScriptElement, self.HTMLIFrameElement, self.HTMLEmbedElement, self.HTMLInputElement, self.HTMLTrackElement, self.HTMLMediaElement,self.HTMLSourceElement, self.Image, self.HTMLImageElement],
            "tags": ['src'],
            "action": "url"
        },
        {
            "elements": [self.HTMLSourceElement, self.HTMLImageElement],
            "tags": ['srcset'],
            "action": "srcset"
        },
        {
            "elements": [self.HTMLAnchorElement, self.HTMLLinkElement, self.HTMLAreaElement],
            "tags": ['href'],
            "action": "url"
        },
        {
            "elements": [self.HTMLIFrameElement],
            "tags": ['contentWindow'],
            "action": "window"
        },
        {
            "elements": [self.HTMLIFrameElement],
            "tags": ['contentDocument'],
            "action": "window"
        },
        {
            "elements": [self.HTMLFormElement],
            "tags": ['action'],
            "action": "url"
        }, 
        {
            "elements": [self.HTMLObjectElement],
            "tags": ['data'],
            "action": "url",
        },
        {
            "elements": [self.HTMLScriptElement, self.HTMLLinkElement],
            "tags": ['integrity'],
            "action": "rewrite",
            "new": "nointegrity",
        },
        {
            "elements": [self.HTMLScriptElement, self.HTMLLinkElement],
            "tags": ['nonce'],
            "action": "rewrite",
            "new": "nononce",
        },
        {
            "elements": [self.HTMLIFrameElement],
            "tags": ['contentWindow', 'contentDocument'],
            "action": "window", 
        },
        {
            "elements": [self.HTMLIFrameElement],
            "tags": ['srcdoc'],
            "action": "html",
        },
        {
            "elements": [self.HTMLElement],
            "tags": ['style'],
            "action": "css"
        }
    ];

    config.forEach((config: any) => {
        config.elements.forEach((element: any) => {
            config.tags.forEach((tag: string) => {
                var descriptor: PropertyDescriptor | any = Object.getOwnPropertyDescriptor(element.prototype, tag);

                if (!descriptor) descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, tag);

                self.__dynamic.define(element.prototype, tag, {
                    get() {
                        if (config.action=='window') {
                            const _window: any = ContentWindow.get.call(this);

                            let origin = true;

                            try {
                                _window.location.href
                            } catch {origin = false;};

                            if (origin) if (!_window.__dynamic) {
                                //Client(_window, self.__dynamic$config, this.src);
                            }

                            if (!origin && tag == 'contentDocument') return _window.document;
                            if (!origin && tag == 'contentWindow') return _window;

                            if (tag=='contentDocument') {
                                return _window.document;
                            }
                            if (tag=='contentWindow') {
                                console.log(_window.__dynamic$window);
                                return _window.__dynamic$window;
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
                            const blob = new Blob([val], {type: 'text/html'});

                            this.removeAttribute(tag);

                            (async () => {
                                const sw = (await self.__dynamic.sw.ready).active;
                                
                                let resolved: Boolean = false;
                                
                                self.__dynamic.sw.addEventListener('message', ({ data: {url} }: MessageEvent) => {
                                    if (resolved) return;

                                    if (url) {
                                        resolved = true;
                                        IFrameSrc.set.call(this, url);
                                    }
                                });

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

    var OuterHTML: PropertyDescriptor | any = Object.getOwnPropertyDescriptor(self.Element.prototype, 'outerHTML');
    var InnerHTML: PropertyDescriptor | any = Object.getOwnPropertyDescriptor(self.Element.prototype, 'innerHTML');

    self.__dynamic.define(self.HTMLElement.prototype, 'innerHTML', {
        get() {
            return (this.__innerHTML||InnerHTML.get.call(this)).toString(); 
        },
        set(val: any) {
            this.__innerHTML = val;

            if ((this instanceof self.HTMLScriptElement) || (this instanceof self.HTMLStyleElement) || (this instanceof self.HTMLTextAreaElement)) return InnerHTML.set.call(this, val);

            return InnerHTML.set.call(this, self.__dynamic.rewrite.html.rewrite(val, self.__dynamic.meta));
        }
    });

    self.__dynamic.define(self.HTMLElement.prototype, 'outerHTML', {
        get() {

            return (this.__outerHTML||OuterHTML.get.call(this)).toString();
        },
        set(val: any) {
            this.__outerHTML = val;

            if ((this instanceof self.HTMLScriptElement) || (this instanceof self.HTMLStyleElement) || (this instanceof self.HTMLTextAreaElement)) return OuterHTML.set.call(this, val);

            return OuterHTML.set.call(this, self.__dynamic.rewrite.html.rewrite(val, self.__dynamic.meta));
        }
    });
    
    self.MutationObserver.prototype.observe = new Proxy(self.MutationObserver.prototype.observe, {
        apply(t, g, a) {
            if (a[0]==self.__dynamic$document) a[0] = self.document;

            return Reflect.apply(t, g, a);
        }
    });

    var createGetter = (prop: any) => {return {get(this: any): any {return (new URL(this.href||self.__dynamic$location.href) as any)[prop];},set(val: any) {return;}}}

    Object.defineProperties(self.HTMLAnchorElement.prototype, {
        pathname: createGetter('pathname'),
        origin: createGetter('origin'),
        host: createGetter('host'),
        hostname: createGetter('hostname'),
        port: createGetter('port'),
        protocol: createGetter('protocol'),
        search: createGetter('search'),
        hash: createGetter('hash'),

        toString: {value: () => {return (new URL(self.__dynamic$location.href) as any).toString();}}
    })
}