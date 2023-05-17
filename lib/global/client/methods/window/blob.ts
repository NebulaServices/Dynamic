export default function blob(self: any) {
    self.Blob = self.__dynamic.wrap(self.Blob,
        function (this: any, ...args: any) {
            console.log(this, args);
            args[0][0]+=`console.log(window)`;
            const blob: any = new Blob(args[0], { type: args[1].type });

            return blob;
        }
    );

    self.URL.createObjectURL = self.__dynamic.wrap(self.URL.createObjectURL, 
        function (this: any, ...args: any) {
            const url: any = args[0];

            console.log(url);
    
            if (url instanceof Blob) {
                const blob: any = new Blob([url], { type: url.type });
                const blobURL: any = self.URL.createObjectURL(blob);
    
                return blobURL;
            }
    
            return;
        }
    )
}