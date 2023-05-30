export default function Get(self: Window | any) {
    self.__dynamic$get = function(object: any) {

        if (object==self.parent) object = self.parent.__dynamic$window;
        if (object==self.top) object = self.top.__dynamic$window;

        if (object == self.location) {
            return self.__dynamic$location;
        }

        if (object == self) object = self.__dynamic$window;

        if (typeof object == 'function') {
            if (object.name == '__d$Send') object = self.__dynamic$message(object.target, self);
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

    self.__dynamic$set = function(object: any, value: any, operator: any) {
        
    }

    self.dg$ = self.__dynamic$get;
    self.ds$ = self.__dynamic$set;
    self.dp$ = self.__dynamic$property;
    self.d$g_ = self.__dynamic$get;
    self.d$s_ = self.__dynamic$set;
}