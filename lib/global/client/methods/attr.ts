export default function Attribute(self: any) {

    const ContentWindow: PropertyDescriptor = Object.getOwnPropertyDescriptor(self.HTMLIFrameElement.prototype, 'contentWindow');

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
          "action": "document"
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
        }
    ];

    config.forEach((config: any) => {
        config.elements.forEach((element: any) => {
            config.tags.forEach((tag: string) => {
                var descriptor = Object.getOwnPropertyDescriptor(element.prototype, tag);

                self.__dynamic.define(element.prototype, tag, {
                    get() {
                        if (config.action=='window') {
                            const _window: any = ContentWindow.get.call(this);
                            if (!_window.__dynamic) {

                            }

                            if (tag=='contentDocument') {
                                return _window.document;
                            }
                            if (tag=='contentWindow') {
                                return _window;
                            }
                        }

                        return descriptor.get.call(this);
                    },
                    set(val: any) {
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

            return this.__innerHTML||InnerHTML.get.call(this); 
        },
        set(val: any) {

            this.__innerHTML = val;

            return InnerHTML.set.call(this, self.__dynamic.rewrite.html.rewrite(val, self.__dynamic.meta));
        }
    });

    self.__dynamic.define(self.HTMLElement.prototype, 'outerHTML', {
        get() {

            return this.__outerHTML||OuterHTML.get.call(this);
        },
        set(val: any) {
            this.__outerHTML = val;

            return OuterHTML.set.call(this, self.__dynamic.rewrite.html.rewrite(val, self.__dynamic.meta));
        }
    });
}