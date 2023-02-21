export default function Get(self: any) {
    self.__dynamic$get = function(object: any) {

        if (object==self.parent) return self.parent.__dip$window;
        if (object==self.top) return self.top.__dip$window;

        if (object instanceof Window) {
            return self;
        }
        if (object instanceof self.Location) {
            return self.__dynamic$location;
        }

        if (object instanceof Document) {
            return self.__dynamic.util.CreateDocumentProxy(object);
        }

        return object;
    }
}