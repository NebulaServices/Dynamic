export default function Message(self: any) {
    //self.setTimeout = ()=>{};

    const isWorker: Function = (s: any) => s.constructor.name=='Worker' || s.constructor.name=='MessagePort' || self.constructor.name=='DedicatedWorkerGlobalScope';

    self.__dynamic$message = function(target: any) {
        if (!target) target = self;

        return function Send(): any {
            var args: any = arguments;

            if (target.self && target.self.postMessage) target = target.self;
            
            self.tar = target;
            self.arg = args;

            console.log(target, args)

            if (isWorker(target)) {
              if (typeof target.start == 'function') target.start();
              return target.postMessage(...args);
            }

            const finalArgs: Array<any> = [];

            if (args.hasOwnProperty(0)) finalArgs.push([args[0], !Array.isArray(args[1])?args[1]:null]);

            if (args.hasOwnProperty(1)) if (Array.isArray(args[1])) finalArgs.push(args[1]);
            else finalArgs.push('*');

            if (args.hasOwnProperty(2)) if (Array.isArray(args[2])) finalArgs.push(args[2]);

            return target.postMessage(...finalArgs);
        }
    }

    if (self.addEventListener) self.addEventListener = new Proxy(self.addEventListener, {
      apply(t, g, a) {
        if (!a[1] || !a[0]) return Reflect.apply(t, g, a);

        if (a[0]=='message') {
          var o = a[1].bind({});

          a[1] = function(event: MessageEvent | any) {
            return o(cloneEvent(event));
          }
        }

        return Reflect.apply(t, g, a);
      }
    });

    if (self.constructor.name == 'Window') Object.defineProperty(self, 'onmessage', {
      get() {
        return self._onmessage;
      },
      set(val: any) {
        if (self._onmessage) {self.removeEventListener('message', self._onmessage)}

        self._onmessage = self.addEventListener('message', val);;
        return self._onmessage;
      }
    });

    function cloneEvent(event: MessageEvent | any) {
        const cloned = self.__dynamic.util.clone(event);

        for (var i in event) {
          switch(i) {
            case "isTrusted":
              Object.defineProperty(cloned, i, {
                value: true,
                writable: false,
              });
              break;
            case "origin":
              if (Array.isArray(event.data) && event.data.length == 2 && event.data[1] == (self.parent||event.source)?.__dynamic$location?.origin+':443' && self.__dynamic$location.host == 'google.com') Object.defineProperty(cloned, i, {
                // ReCaptcha Support (Too Lazy)
                value: 'https://google.com:443',
                writable: false,
              }); else if (Array.isArray(event.data) && event.data.length == 2) Object.defineProperty(cloned, i, {
                value: event.data[1],
                writable: false,
              }); else Object.defineProperty(cloned, i, {
                value: event.origin,
                writable: false,
              });
              break;
            case "data":
              if (Array.isArray(event.data) && event.data.length == 2) Object.defineProperty(cloned, i, {
                value: event.data[0],
                writable: false,
              }); else Object.defineProperty(cloned, i, {
                value: event.data,
                writable: false,
              });
              break;
            case "source":
              if (!event.source) break;
              if (event.source.__dynamic$window) {
                Object.defineProperty(cloned, i, {
                  value: event.source.__dynamic$window,
                  writable: true,
                });
              } else {
                Object.defineProperty(cloned, i, {
                  value: event.source,
                  writable: true,
                });
              };
              break;
            default:
              Object.defineProperty(cloned, i, {
                value: event[i],
                writable: false,
              });
              break;
          }
        }
        
        return cloned;
    }
}