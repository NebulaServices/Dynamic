export default function location(self: any, doc: boolean = true) {
    delete self.__dynamic$location;
  
    const url =
      self.__dynamic$baseURL ||
      self.location.pathname + self.location.search + self.location.hash;

    const property: any = new URL(self.__dynamic.url.decode(url));
    self.__dynamic.meta.load(property);
  
    self.__dynamic.location = self.__dynamic.util.clone(self.location);
  
    const props = [
      "href",
      "host",
      "hash",
      "origin",
      "hostname",
      "port",
      "pathname",
      "protocol",
      "search",
    ];

    const descriptor = { configurable: true };
  
    props.forEach((t) => {
      Object.defineProperty(self.__dynamic.location, t, {
        ...descriptor,
        get: () => property[t],
        set: (e: any) =>
          (self.location[t] = self.__dynamic.url.encode(
            self.__dynamic.meta.href.replace(property[t], e),
            property
          )),
      });
    });
  
    const funcs = ["assign", "replace", "toString", "reload"];
  
    funcs.forEach((t) => {
      Object.defineProperty(self.__dynamic.location, t, {
        ...descriptor,
        get: () =>
          t === "toString"
            ? () => property["href"]
            : new self.__dynamic.Function(
                "arg",
                `return window.location.${t}(arg?${
                  "reload" !== t && "toString" !== t
                    ? "(self.__dynamic).url.encode(arg, new URL('${property.href}'))"
                    : "arg"
                }:null)`
              ),
        set: () => {},
      });
    });
  
    self.__dynamic.define(self, "__dynamic$location", {
      get() {
        return self.__dynamic.location;
      },
      set(value: any) {
        self.__dynamic.location =
          value instanceof self.Location
            ? value
            : (self.__dynamic.location.href = value);
      },
      configurable: true,
    });
  
    if (doc) {
      self.__dynamic.define(self.document, "__dynamic$location", {
        get() {
          return self.__dynamic.location;
        },
        set(value: any) {
          self.__dynamic.location =
            value instanceof self.Location
              ? value
              : (self.__dynamic.location.href = value);
        },
        configurable: true,
      });
    }

    if (!self.__dynamic.hashchange) self.__dynamic.hashchange = (self.addEventListener("hashchange", ( event: HashChangeEvent ) => {
      property["hash"] = "#" + (event.newURL.split("#")[1] || "");
    }), true);

    return self.__dynamic.location;
  }