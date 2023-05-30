import Client from '../../../../client/client'

export default function fetch(self: Window | any) {
    self.Request = self.__dynamic.wrap(self.Request,
        function(target: Function, ...args: Array<Request>) {
          if (args[0] instanceof target) {
            const request: Request | any = Reflect.construct(target, args);
    
            if (args[0].mode === 'navigate') {
              request.mode = 'same-origin';
            }
    
            return request as Request;
          }
    
          if (args[0]) {
            args[0] = self.__dynamic.url.encode(args[0], self.__dynamic.meta);
          }
    
          return args as Array<any>;
        }
    );

    self.__dynamic.define(self.Request.prototype, 'url', {
        get() {
            return self.__dynamic.url.decode(self.__dynamic.http.RequestURL.get.call(this));
        },
        set(value: string) {
            return value;
        }
    });
    
    self.fetch = self.__dynamic.wrap(self.fetch,
        function(this: Window, target: Function, ...args: Array<string | Request>) {
            if (args[0].constructor.name === 'Request' || args[0] instanceof self.Request) {
                return Reflect.apply(target, self, args) as Promise<Response>;
            }

            if (args[0]) {
                args[0] = self.__dynamic.url.encode(args[0], self.__dynamic.meta);
            }

            return Reflect.apply(target, self, args) as Promise<Response>;
        }
    );

    self.XMLHttpRequest.prototype.open = self.__dynamic.wrap(self.XMLHttpRequest.prototype.open,
        function(this: XMLHttpRequest, target: Function, ...args: Array<string | boolean>) {
            if (args[1]) {
                args[1] = self.__dynamic.url.encode(args[1], self.__dynamic.meta);
            }

            if (args[2] === false) {
                args[2] = true;
            }

            return Reflect.apply(target, this, args) as undefined;
        }
    );

    Object.defineProperty(self.XMLHttpRequest.prototype, 'responseURL', {
        get() {
            return self.__dynamic.url.decode(self.__dynamic.http.XMLResponseURL.get.call(this));
        },
        set(value: any) {
            return value;
        }
    });

    Object.defineProperty(self.Response.prototype, 'url', {
        get() {
            return self.__dynamic.url.decode(self.__dynamic.http.ResponseURL.get.call(this));
        },
        set(value: any) {
            return value;
        }
    });

    self.open = self.__dynamic.wrap(self.open,
        function(this: Window, target: Function, ...args: Array<string | URL>) {
          if (args[0] !== '') {
            if (args[0]) {
              args[0] = self.__dynamic.url.encode(args[0], self.__dynamic.meta);
            }
          }
    
          if (args[0] === '') {
            args[0] = 'about:blank';
          }
    
          const win: Window | any = Reflect.apply(target, this, args);
    
          win.opener = self.__dynamic$window;
          if (new URL(args[0]).protocol === 'about:') {
            win.__dynamic$url = 'about:srcdoc';
          } else {
            win.__dynamic$url = self.__dynamic.url.decode(args[0]);
          }
    
          Client(win, self.__dynamic$config);
    
          return win.__dynamic$window as Window;
        }
    );

    self.__dynamic.define(self, '__dynamic$import', {
        get() {
            return function(url: any, path: any) {
                
                try {
                    return self.__dynamic.url.encode(url, new URL(path));
                } catch {
                    return self.__dynamic.url.encode(url, self.__dynamic.meta);
                }
            }
        },
        set: () => {},
    });
}