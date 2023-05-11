export default function message(self: any) {
  //self.setTimeout = ()=>{};

  const isWorker: Function = (s: any) => s.constructor.name=='Worker' || s.constructor.name=='MessagePort' || self.constructor.name=='DedicatedWorkerGlobalScope';

  self.__dynamic$message = function(target: any) {
      if (!target) target = self;

      return function Send(): any {
          var args: any = arguments;

          if (isWorker(target)) {
            if (typeof target.start == 'function') target.start();
            return target.postMessage(...args);
          }

          return target.postMessage(...[[args[0], args[1]=='*'?args[1]:self.__dynamic$location.origin], '*', args[2]||[]]);
      }
  }

  /*self.postMessage = new Proxy(self.postMessage, {
    apply(t, g, a): any {

      console.log(t, g, a, self);

      if (isWorker(g))
        return Reflect.apply(t, g, a);

      var origin: string = self.__dynamic$location.origin;

      if (a[1].match(/:[0-9]+$/g)) origin+=':'+(self.__dynamic$location.protocol=='https:'?'443':'80');

      return Reflect.apply(t, g, [[a[0], a[1]=='*'?a[1]:origin], '*', a[2]||[]]);
    }
  });*/

  if (self.addEventListener) self.addEventListener = new Proxy(self.addEventListener, {
    apply(t, g, a) {
      if (g==self.__dynamic$window) g = self;
      if (!a[1] || !a[0] || typeof a[1] != 'function') return Reflect.apply(t, g, a);

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
            if (Array.isArray(event.data) && event.data.length == 2) Object.defineProperty(cloned, i, {
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
                value: event.source?.__dynamic$window,
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