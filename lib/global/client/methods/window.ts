export default function Window(self: any) {
    self.__dynamic.util.CreateDocumentProxy = function CreateDocumentProxy(document: any) {
        return new Proxy(document, {
            get(obj, prop): any {
                if (prop=='location') return self.__dynamic$location;
                if (prop=='URL') return self.__dynamic$location.toString();
                if (prop=='documentURI') return self.__dynamic.location.toString();
                if (prop=='baseURI') return self.__dynamic.location.toString();

                if (prop=='referrer') {
                    try {
                        return self.__dynamic.url.decode(obj[prop]);
                    } catch {
                        return self.__dynamic$location.origin;
                    }
                }

                if (obj[prop] instanceof Function) {return obj[prop].bind(document)};

                return Reflect.get.bind(document)(obj, prop);
            },
            set(obj, prop, value): any {
    
                obj[prop] = value;
    
                return true;
            }
        });
    }

    self.__dynamic$window = new Proxy(self, {
        get(obj, prop): any {
            if (prop=='document') return self.__dynamic.util.CreateDocumentProxy(Reflect.get(obj, prop));
            if (prop=='location') return self.__dynamic$location;
            if (prop=='parent') return self.top.__dynamic$window;
            if (prop=='top') return self.top.__dynamic$window;

            //if (obj[prop] instanceof Function&&!(self.__dynamic.util.class(obj[prop]))) {return obj[prop].bind(self)};

            //if ((self.__dynamic.util.class(obj[prop]))) return self.__dynamic.util.clone(obj[prop]);

            return Reflect.get(obj, prop);
        },
        set(obj, prop, value): any {

            //if (value instanceof Function) {value = value.bind(self)};

            obj[prop] = value;

            return true;
        }
    })



    self.__dynamic$globalThis = self.__dynamic$window;
    self.__dynamic$self = self.__dynamic$window;


}