export default function Get(self: any) {
    self.__dynamic$get = function(object: any) {

        if (object==self.parent) return self.parent.__dynamic$window;
        if (object==self.top) return self.top.__dynamic$window;

        if (object instanceof (self.Location||self.WorkerLocation)) {
            return self.__dynamic$location;
        }

        if (self.Document) if (object instanceof self.Document) {
            return self.__dynamic$document;
        }

        if (object == self) return self.__dynamic$window;

        //if (typeof object == 'function') return new Proxy(object, {apply(t, g, a) {return Reflect.apply(t, g, a)}});

        return object;
    }

    self.__dynamic$set = function(object: any, value: any, operator: any) {
        
    }
}