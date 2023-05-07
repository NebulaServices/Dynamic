import Client from '../../../client/client';
import Srcset from '../../rewrite/html/srcset';

export default function Attribute(self: any) {

    const ContentWindow: PropertyDescriptor = Object.getOwnPropertyDescriptor(self.HTMLIFrameElement.prototype, 'contentWindow');
    
    const IFrameSrc: PropertyDescriptor = Object.getOwnPropertyDescriptor(self.HTMLIFrameElement.prototype, 'src');

    const AttributeList: Array<string> = ['src', 'href', 'srcset', 'action', 'data', 'integrity', 'nonce'];

    self.HTMLElement.prototype.setAttribute = new Proxy(self.HTMLElement.prototype.setAttribute, {
        apply(t: any, g: any, a: any) {
            if (AttributeList.indexOf(a[0].toLowerCase())==-1) return Reflect.apply(t, g, a);

            if (a[0].toLowerCase()=='srcset') {
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

    /*self.HTMLElement.prototype.insertBefore = new Proxy(self.HTMLElement.prototype.insertBefore, {
        apply(t: any, g: any, a: any) {
            if (!a[1]) a[1] = null;
            return t.call(g, ...a);
        }
    });*/

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
        }
    ];

    config.forEach((config: any) => {
        config.elements.forEach((element: any) => {
            config.tags.forEach((tag: string) => {
                var descriptor = Object.getOwnPropertyDescriptor(element.prototype, tag);

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
                                Client(_window, self.__dynamic$config, 'about:srcdoc');
                            }

                            if (!origin && tag == 'contentDocument') return _window.document;
                            if (!origin && tag == 'contentWindow') return _window;

                            if (tag=='contentDocument') {
                                return _window.document;
                            }
                            if (tag=='contentWindow') {
                                return _window.__dynamic$window;
                            }
                        }

                        try {
                            return self.__dynamic.url.decode(descriptor.get.call(this));
                        } catch {};

                        return descriptor.get.call(this);
                    },
                    set(val: any) {
                        if (val && typeof val == 'string') val = val.toString();
                        if (config.action=='html') {
                            const blob = new Blob([self.__dynamic.rewrite.html.rewrite(val, self.__dynamic.meta)], {type: 'text/html'});

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

                                sw.postMessage({type: "createBlobHandler", blob, url: self.__dynamic.modules.base64.encode(val.split('').slice(0, 10))});

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
                            val = self.__dynamic.rewrite.css(val, self.__dynamic.meta);
                        }

                        if (config.action=='url') val = self.__dynamic.url.encode(val, self.__dynamic.meta);
                        return descriptor.set.call(this, val);
                    }
                })
            })
        })
    });

    var OuterHTML: PropertyDescriptor = Object.getOwnPropertyDescriptor(self.Element.prototype, 'outerHTML');
    var InnerHTML: PropertyDescriptor = Object.getOwnPropertyDescriptor(self.Element.prototype, 'innerHTML');

    self.__dynamic.define(self.HTMLElement.prototype, 'innerHTML', {
        get() {
            return (this.__innerHTML||InnerHTML.get.call(this)).toString(); 
        },
        set(val: any) {
            this.__innerHTML = val;

            if ((this instanceof self.HTMLScriptElement) || (this instanceof self.HTMLStyleElement)) return InnerHTML.set.call(this, val);

            return InnerHTML.set.call(this, self.__dynamic.rewrite.html.rewrite(val, self.__dynamic.meta));
        }
    });

    self.__dynamic.define(self.HTMLElement.prototype, 'outerHTML', {
        get() {

            return (this.__outerHTML||OuterHTML.get.call(this)).toString();
        },
        set(val: any) {
            this.__outerHTML = val;

            return OuterHTML.set.call(this, self.__dynamic.rewrite.html.rewrite(val, self.__dynamic.meta));
        }
    });
}