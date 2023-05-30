export default function mutation(self: Window | any, __dynamic: any) {
    if (!__dynamic) __dynamic = self.__dynamic;
    
    function rewrite(node: Element | any) {
        if (node.rewritten) return;
        if (node.nodeType !== 1 && node.nodeType !== 3) return;

        node = new Proxy(node, {
            get(obj, prop) {
                if (prop == 'src' || prop == 'href' || prop == 'srcset' || prop == 'imageSrcset' || prop == 'data' || prop == 'action') {
                    return __dynamic.elements.getAttribute.call(obj, prop.toLowerCase());
                }

                if (prop == 'setAttribute' || prop == 'getAttribute' || prop == 'removeAttribute' || prop == 'hasAttribute' || prop == 'cloneNode') {
                    return (...args: any) => {
                        return __dynamic.elements[prop].call(obj, ...args);
                    }
                }

                if (prop == 'node') return obj;

                return obj[prop];
            },
            set(obj, prop, value) {
                if (prop == 'src' || prop == 'href' || prop == 'srcset' || prop == 'imageSrcset' || prop == 'data' || prop == 'action') {
                    __dynamic.elements.setAttribute.call(obj, prop.toLowerCase(), value);
                } else {
                    obj[prop] = value;
                }

                return true;
            }
        });

        if ((node instanceof HTMLScriptElement) as any) {
            if (node.src) {
                node.dataset['dynamic_src'] = node.src;
                node.src = __dynamic.url.encode(node.src, __dynamic.meta);
            }

            if (node.integrity) {
                node.setAttribute('nointegrity', node.integrity);
                node.removeAttribute('integrity');
            }

            if (node.nonce) {
                node.setAttribute('nononce', node.nonce);
                node.removeAttribute('nonce');
            }

            let cloned = node.cloneNode(true) as HTMLScriptElement | any;

            if (cloned.type && cloned.textContent?.length) {
                if (cloned.type == "application/javascript" || cloned.type == 'text/javascript' || cloned.type == 'application/x-javascript' && cloned.textContent?.length) {
                    cloned.textContent = __dynamic.rewrite.js.rewrite(cloned.textContent, {type: 'script'}, false, __dynamic);
                }
            } else if (!cloned.type && cloned.textContent?.length) {
                cloned.textContent = __dynamic.rewrite.js.rewrite(cloned.textContent, {type: 'script'}, false, __dynamic);
            }

            cloned.rewritten = true;
            node.rewritten = true;
            return node.node.parentElement.replaceChild(cloned, node.node);
        }

        if (node instanceof HTMLStyleElement) {
            if (node.textContent?.length) {
                node.textContent = __dynamic.rewrite.css.rewrite(node.textContent, __dynamic.meta);
            }
        }

        if (node instanceof HTMLIFrameElement) {
            if (node.src) {
                node.dataset['dynamic_src'] = node.src;
                node.src = __dynamic.url.encode(node.src, __dynamic.meta);
            }

            if (node.srcdoc) {
                node.dataset['dynamic_srcdoc'] = node.srcdoc;

                const blob = new Blob([__dynamic.rewrite.html.rewrite(node.srcdoc, __dynamic.meta)], {type: 'text/html'});
                node.src = URL.createObjectURL(blob);
            }
        }

        if (node instanceof HTMLImageElement) {
            if (node.src) {
                node.dataset['dynamic_src'] = node.src;
                node.src = __dynamic.url.encode(node.src, __dynamic.meta);
            }

            if (node.srcset) {
                node.dataset['dynamic_srcset'] = node.srcset;
                node.srcset = __dynamic.rewrite.srcset.encode(node.srcset, __dynamic);
            }
        }

        if (node instanceof HTMLLinkElement) {
            if (node.href) {
                node.dataset['dynamic_href'] = node.href;
                node.href = __dynamic.url.encode(node.href, __dynamic.meta);
            }

            if (node.imageSrcset) {
                node.dataset['dynamic_imagesrcset'] = node.imageSrcset;
                node.imageSrcset = __dynamic.rewrite.srcset.encode(node.imageSrcset, __dynamic);
            }

            if (node.integrity) {
                node.setAttribute('nointegrity', node.integrity);
                node.removeAttribute('integrity');
            }

            if (node.nonce) {
                node.setAttribute('nononce', node.nonce);
                node.removeAttribute('nonce');
            }
        }

        if (node instanceof HTMLAnchorElement) {
            if (node.href) {
                node.dataset['dynamic_href'] = node.href;
                node.href = __dynamic.url.encode(node.href, __dynamic.meta);
            }
        }

        if (node instanceof HTMLFormElement) {
            if (node.action) {
                node.dataset['dynamic_action'] = node.action;
                node.action = __dynamic.url.encode(node.action, __dynamic.meta);
            }
        }

        if (node instanceof HTMLObjectElement) {
            if (node.data) {
                node.dataset['dynamic_data'] = node.data;
                node.data = __dynamic.url.encode(node.data, __dynamic.meta);
            }
        }

        if (node instanceof HTMLSourceElement) {
            if (node.src) {
                node.dataset['dynamic_src'] = node.src;
                node.src = __dynamic.url.encode(node.src, __dynamic.meta);
            }

            if (node.srcset) {
                node.dataset['dynamic_srcset'] = node.srcset;
                node.srcset = __dynamic.rewrite.srcset.encode(node.srcset, __dynamic);
            }
        }

        if (node instanceof HTMLAreaElement) {
            if (node.href) {
                node.dataset['dynamic_href'] = node.href;
                node.href = __dynamic.url.encode(node.href, __dynamic.meta);
            }
        }

        if (node instanceof HTMLBaseElement) {
            if (node.href) {
                node.dataset['dynamic_href'] = node.href;
                node.href = __dynamic.url.encode(node.href, __dynamic.meta);
            }
        }

        if (node instanceof HTMLInputElement) {
            if (node.src) {
                node.dataset['dynamic_src'] = node.src;
                node.src = __dynamic.url.encode(node.src, __dynamic.meta);
            }
        }

        if (node instanceof HTMLAudioElement) {
            if (node.src) {
                node.dataset['dynamic_src'] = node.src;
                node.src = __dynamic.url.encode(node.src, __dynamic.meta);
            }
        }

        if (node instanceof HTMLVideoElement) {
            if (node.src) {
                node.dataset['dynamic_src'] = node.src;
                node.src = __dynamic.url.encode(node.src, __dynamic.meta);
            }
        }

        if (node instanceof HTMLTrackElement) {
            if (node.src) {
                node.dataset['dynamic_src'] = node.src;
                node.src = __dynamic.url.encode(node.src, __dynamic.meta);
            }
        }

        if (node instanceof HTMLMediaElement) {
            if (node.src) {
                node.dataset['dynamic_src'] = node.src;
                node.src = __dynamic.url.encode(node.src, __dynamic.meta);
            }
        }

        if ((node instanceof SVGImageElement) as any) {
            if (node.href) {
                node.dataset['dynamic_href'] = node.href;
                node.href = __dynamic.url.encode(node.href, __dynamic.meta);
            }
        }

        if (node instanceof HTMLMetaElement) {
            if (node.httpEquiv) {
                if (node.httpEquiv.toLowerCase() == 'refresh') {
                    var time = node.content.split(';url=')[0], value = node.content.split(';url=')[1];

                    node.content = `${time};url=${__dynamic.url.encode(value, __dynamic.meta)}`;
                }

                if (node.httpEquiv.toLowerCase() == 'content-security-policy') {
                    node.remove();
                }
            }
        }
        
        if ((node instanceof HTMLElement) as any) {
            if (node.getAttribute("style")) {
                node.setAttribute("style", __dynamic.rewrite.css.rewrite(node.getAttribute("style"), __dynamic.meta));
            }
        }

        return (node.rewritten = true);
    }

    const observer = ((t,e,a: any = null)=>((a=new MutationObserver(function e(a){for(var r of a)t[r.type](r),document.dispatchEvent(new CustomEvent({attributes:"attrChanged",characterData:"characterData",childList:"nodeChanged"}[r.type],{detail:r}))})).observe(e,{subtree:!0,attributes:!0,childList:!0}),a))({
        childList(event: MutationRecord) {
            rewrite(event.target);

            for (let node of event.addedNodes as any) {
                rewrite(node);
                if (node.childNodes) for (let child of node.childNodes) rewrite(child);
            }

            if (event.target.childNodes) for (var child of event.target.childNodes) rewrite(child);
        },
        attributes(event: MutationRecord) {
            return;
        },
        characterData(event: MutationRecord) {
            return;
        }
    }, self.document.documentElement);

    self.document.addEventListener("DOMContentLoaded", function() {
        observer.disconnect();
    }, {once: true});
}