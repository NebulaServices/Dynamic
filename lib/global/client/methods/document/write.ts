export default function write(self: any) {
    self.document.write = self.__dynamic.wrap(self.document.write,
        function(this: Document, handler: Function, ...args: Array<string>) {
            console.log(args);
            for (var arg in args) {
                args[arg] = self.__dynamic.rewrite.dom(args[arg], self.__dynamic.meta);
            }

            return handler.apply(this, args);
        },
        'document.write'
    );

    self.document.writeln = self.__dynamic.wrap(self.document.writeln,
        function(this: Document, handler: Function, ...args: Array<string>) {
            for (var arg in args) {
                args[arg] = self.__dynamic.rewrite.dom(args[arg], self.__dynamic.meta);
            }

            return handler.apply(this, args);
        },
        'document.writeln'
    );
}