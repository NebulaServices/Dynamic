export default function html(self: Window | any) {
    self.__dynamic.rewrite.dom = function(src: string, meta: any) {
        if (typeof self.DOMParser == 'undefined') return src;
        if (!src) return src;

        var parser = new self.DOMParser();
        var doc = parser.parseFromString(src.toString(), 'text/html');

        var html = doc.documentElement;

        html.querySelectorAll('script').forEach(function(script: any) {
            if (!script.type || (script.type && script.type !== 'text/javascript' && script.type !== 'application/javascript' && script.type !== 'application/x-javascript')) {
                if (script.src) script.src = self.__dynamic.url.encode(script.getAttribute('src'), meta);
            } else {
                if (script.innerHTML) script.innerHTML = self.__dynamic.js.encode(script.innerHTML, {type: 'script'}, meta, {});
            }
        });

        html.querySelectorAll('link').forEach(function(link: any) {
            if (link.href && link.getAttribute('rel') !== 'stylesheet') link.href = self.__dynamic.url.encode(link.getAttribute('href'), meta);
        });

        html.querySelectorAll('img').forEach(function(img: any) {
            if (img.src) img.src = self.__dynamic.url.encode(img.getAttribute('src'), meta);
            if (img.srcset) img.srcset = self.__dynamic.rewrite.srcset.encode(img.getAttribute('srcset'), self.__dynamic);
        });

        html.querySelectorAll('a').forEach(function(a: any) {
            if (a.href) a.href = self.__dynamic.url.encode(a.getAttribute('href'), meta);
        });

        html.querySelectorAll('style').forEach(function(style: any) {
            if (style.innerHTML) style.innerHTML = self.__dynamic.rewrite.css.rewrite(style.innerHTML, meta);
        });

        return html.outerHTML;
    }
}