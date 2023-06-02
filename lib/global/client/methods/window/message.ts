export default function message(self: Window | any) {
  const isWorker = (s: any) => s.constructor.name=='Worker' || s.constructor.name=='MessagePort' || self.constructor.name=='DedicatedWorkerGlobalScope';
  const isTarget = (s: any) => s.constructor.name=="Window" || s.constructor.name=='global';
  const getWindow = (name: any, location: any) => Object.keys(window || {}).map(e=>parseInt(e)).filter(e=>isFinite(e)).map(e=>window[e]).filter(e=>e||false).find((e: any)=>{try{return e.name == name && e.location.href == location} catch {return false;}});

  self.__dynamic$message = function(target: any, origin: any = top) {
    if (!target) target = self;

    function __d$Send() {
        var args = arguments;

        if (isWorker(target) || !isTarget(target))
          return target.postMessage.call(target, ...args);

        if (target.__dynamic$self) target = target.__dynamic$self;

        return (target._postMessage || target.postMessage).call(target, ...[[args[0], origin.__dynamic$location.origin, origin.location.href, origin.name, origin !== self], '*', args[2]||[]]);
    }

    return __d$Send;
  }

  if (self.addEventListener && self.constructor.name == 'Window') self.addEventListener = new Proxy(self.addEventListener, {
    apply(t, g, a) {
      if (g==self.__dynamic$window) g = self;
      if (!a[1] || !a[0] || typeof a[1] != 'function') return Reflect.apply(t, g, a);

      if (a[0]=='message') {
        var o = a[1].bind({});

        a[1] = function(event: MessageEvent | any) {
          return o(cloneEvent(event));
        }
      }

      if (a[0] == 'error') {
        var o = a[1].bind({});
        a[1] = function(event: ErrorEvent | any) {
          return o(event);
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

      self.addEventListener('message', val);;
      return self._onmessage = val;
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

            if (_window) {
              Object.defineProperty(cloned, i, {
                value: _window?.__dynamic$window || _window,
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