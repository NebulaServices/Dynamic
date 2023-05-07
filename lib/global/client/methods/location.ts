export default function Location(self: any, doc: Boolean = true) {
    delete self.__dynamic$location;

    try {
        var property: any = new URL(self.__dynamic.url.decode(self.__dynamic$url || self.location.pathname+self.location.search+self.location.hash));
    } catch {
        self.__dynamic$url = 'about:blank'
        var property: any = new URL('about:blank');
    }

    self.__dynamic.meta.load(property);

    self.__dynamic.location = self.__dynamic.util.clone(self.location);

    ["href", "host", "hash", "origin", "hostname", "port", "pathname", "protocol", "search"].forEach(t => {
        Object.defineProperty(self.__dynamic.location, t, {
            get: () => property[t],
            set: (e:any) => self.location[t] = self.__dynamic.url.encode(self.__dynamic.meta.href.replace(property[t], e), property)
        })
    }), ["assign", "replace", "toString", "reload"].forEach(t => {
        Object.defineProperty(self.__dynamic.location, t, {
            get: () => t=='toString'?()=>property['href']:new Function("arg", `return window.location.${t}(arg?${"reload"!==t&&"toString"!==t?"(self.__dynamic).url.encode(arg, new URL('"+property.href+"'))":"arg"}:null)`),
            set: t => t
        })
    });

    self.__dynamic.define(self, '__dynamic$location', {
        get() {
            return self.__dynamic.location;
        },
        set(value: any) {
            if (value instanceof self.Location) return self.__dynamic.location = value;

            self.__dynamic.location.href = value;
        },
        configurable: true,
    });

    if (doc) self.__dynamic.define(self.document, '__dynamic$location', {
        get() {
            return self.__dynamic.location;
        },
        set(value: any) {
            if (value instanceof self.Location) return self.__dynamic.location = value;

            self.__dynamic.location.href = value;
        },
        configurable: true,
    });
};