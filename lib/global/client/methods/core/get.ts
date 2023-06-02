export default function Get(self: Window | any) {
    self.__dynamic$get = function(object: any) {

        if (object==self.parent) return self.parent.__dynamic$window;
        if (object==self.top) return self.top.__dynamic$window;

        if (object == self.location) {
            return self.__dynamic$location;
        }

        if (object instanceof (self.Location || self.WorkerLocation)) {
            return self.__dynamic$location;
        }

        if (self.Document) if (object instanceof self.Document) {
            return self.__dynamic$document;
        }

        if (object == self) return self.__dynamic$window;

        if (typeof object == 'function') {
            if (object.name == '__d$Send') return self.__dynamic$message(object.target, self);
        }

        return object;
    }

    self.__dynamic$property = function(prop: any, obj: any) {
        return prop;
        if (typeof prop !== "string" || (prop !== "location" && prop !== "postMessage")) {
            return prop;
        }

        if (prop == "location") {
            if (obj == self.document || obj == self.dynamic$document || obj == self || obj == self.__dynamic$window) {
                prop = "__dynamic$location"
            }
        }

        if (prop == "postMessage" && self.constructor.name == "Window") {
            // fallback to fallback postmessage rewriting
            if (obj.__dynamic) obj.__dynamic.postIterate++;

            var name = "_".repeat(obj.__dynamic?.postIterate || 2) + "postMessage";

            obj[name] = function() {
                var e = 

                delete obj.___postMessage;

                return e;
            }

            prop = name;
        }

        return prop;
    }

    self.__dynamic$set = function(object: any, value: any) {
        if (!object) return value;

        return self.__dynamic.url.encode(self.__dynamic.meta.href.replace(self.__dynamic.property['href'], value), self.__dynamic.property);
    }

    self.dg$ = self.__dynamic$get;
    self.ds$ = self.__dynamic$set;
    self.dp$ = self.__dynamic$property;
    self.d$g_ = self.__dynamic$get;
    self.d$s_ = self.__dynamic$set;
}