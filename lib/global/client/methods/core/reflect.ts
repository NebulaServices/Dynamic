export default function reflect(self: Window | any) {
    self.Reflect.set = self.__dynamic.wrap(self.Reflect.set,
        function(this: Object, target: Function, ...a: Array<any>): any {
            if (a[0].constructor.name=='Window') {
                if (a[1]=='location') {
                    a[0].__dynamic$location = a[2];
                    return true;
                }
            }

            if (a[0].constructor.name=='Location') {
                self.__dynamic$location[a[1]] = a[2];
                return true;
            }
            
            return target.apply(this, a);
        },
        'Reflect.set'
    );

    self.Reflect.get = self.__dynamic.wrap(self.Reflect.get,
        function(this: Object, target: Function, ...a: Array<any>) {
            if (typeof a[0] == 'object') {
                if (a[0].constructor.name=='Window') {
                    if (a[1]=='location') return a[0].__dynamic$location;

                    if (a[0][a[1]].constructor.name=='Window') {
                        return a[0][a[1]].__dynamic$window;
                    }
                }

                if (a[0].constructor.name=='Location') {
                    return self.__dynamic$location[a[1]];
                }
            }

            return target.apply(this, a);
        },
        'Reflect.get'
    );

    self.__dynamic.Reflect = {
        get: self.Reflect.get.bind({}),
        set: self.Reflect.set.bind({}),
        apply: self.Reflect.apply.bind({}),
        construct: self.Reflect.construct.bind({}),
        defineProperty: self.Reflect.defineProperty.bind({}),
        deleteProperty: self.Reflect.deleteProperty.bind({}),
        getOwnPropertyDescriptor: self.Reflect.getOwnPropertyDescriptor.bind({}),
        getPrototypeOf: self.Reflect.getPrototypeOf.bind({}),
        has: self.Reflect.has.bind({}),
        isExtensible: self.Reflect.isExtensible.bind({}),
        ownKeys: self.Reflect.ownKeys.bind({}),
        preventExtensions: self.Reflect.preventExtensions.bind({}),
        setPrototypeOf: self.Reflect.setPrototypeOf.bind({})
    }
}