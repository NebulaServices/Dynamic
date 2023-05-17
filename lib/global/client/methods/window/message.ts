export default function message(self: any) {
  const isWorker = (s: any) => s.constructor.name=='Worker' || s.constructor.name=='MessagePort' || self.constructor.name=='DedicatedWorkerGlobalScope';
  const getWindow = (name: any, location: any) => Object.keys(window).filter(e=>parseInt(e)>-1).map(e=>parseInt(e)).map(e=>window[e]).find((e: any)=>e.name == name && e.location.href == location);

  self.__dynamic$message = function(target: any, origin: any = self) {
    if (!target) target = self;

    return function Send() {
        var args = arguments;

        if (isWorker(target)) {
          if (typeof target.start == 'function') target.start();
          return target.postMessage(...args);
        }

        if (target.__dynamic$self) target = target.__dynamic$self;

        return (target._postMessage || target.postMessage)(...[[args[0], self.__dynamic$location.origin, self.location.href, self.name, target !== self], '*', args[2]||[]]);
    }
  }

  /*self.postMessage = new Proxy(self.postMessage, {
    apply(t, g, a): any {

      if (isWorker(g))
        return Reflect.apply(t, g, a);

      return Reflect.apply(t, g, [a[0], '*', a[2]]);
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
      
      let _window: any;

      if (event.source) _window = getWindow(event.data[3], event.data[2]) || event.currentTarget;

      for (var i in event) {
        switch(i) {
          case "isTrusted":
            Object.defineProperty(cloned, i, {
              value: true,
              writable: false,
            });
            break;
          case "origin":
            if (Array.isArray(event.data) && event.data.length == 5) Object.defineProperty(cloned, i, {
              value: event.data[1],
              writable: false,
            }); else Object.defineProperty(cloned, i, {
              value: event.origin,
              writable: false,
            });
            break;
          case "data":
            if (Array.isArray(event.data) && event.data.length == 5) Object.defineProperty(cloned, i, {
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
                value: _window?.__dynamic$window || (Array.isArray(event.data) && event.data.length == 3 && event.data[2] === true) ? event.source?.__dynamic$window: event.currentTarget.__dynamic$window,
                writable: true,
              });
            } else {
              Object.defineProperty(cloned, i, {
                value: _window || (Array.isArray(event.data) && event.data.length == 3 && event.data[2] === true) ? event.source : event.currentTarget,
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