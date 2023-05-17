export default function Get(self: any) {
    self.__dynamic$get = function(object: any) {

        if (object==self.parent) object = self.parent.__dynamic$window;
        if (object==self.top) object = self.top.__dynamic$window;

        if (object == self.location) {
            return self.__dynamic$location;
        }

        if (object == self) object = self.__dynamic$window;

        //if (typeof object == 'function') return new Proxy(object, {apply(t, g, a) {return Reflect.apply(t, g, a)}});

        /*if (object && object.postMessage && object.addEventListener) {
            const _postMessage = object.postMessage;

            return new Proxy(object, {
                get(obj, prop) {
                    if (prop == 'postMessage') {
                        return self.__dynamic$message(obj, self);
                    }

                    if (prop == '_postMessage') return _postMessage.bind(obj);

                    if (obj[prop] instanceof Function) return new Proxy(obj[prop], {
                        apply(t, g, a) {
                            if (object == self.__dynamic$window || obj == self) return self.__dynamic$window[prop](...a);

                            return Reflect.apply(t, g, a);
                        }
                    });

                    return obj[prop];
                },
                set(obj, prop, value) {
                    return Reflect.set(obj, prop, value);
                }
            });
        }*/

        return object;
    }

    self.__dynamic$set = function(object: any, value: any, operator: any) {
        
    }

    self.dg$ = self.__dynamic$get;
    self.ds$ = self.__dynamic$set;
    
    self.d$g_ = self.__dynamic$get;
    self.d$s_ = self.__dynamic$set;
}