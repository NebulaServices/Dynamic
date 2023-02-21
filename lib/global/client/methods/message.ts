export default function Message(self: any) {
    self.__dynamic$message = function(target: any) {
        return function Send(): any {
            var args: any = arguments;

            if (target instanceof (self.MessagePort||class{}) || target instanceof (self.Worker||class{}) || target instanceof (self.DedicatedWorkerGlobalScope||class{})) return target.postMessage(...args);

            var finalArgs: Array<String|MessagePort|Object|Array<MessagePort>> = [];

            finalArgs.push({data: args[0], __origin: args[1]});

            finalArgs.push('*');
            if (args[2]) finalArgs.push(args[2]);

            if (target.self&&!(target instanceof Window)) target = target.self;

            return target.postMessage(...finalArgs);

            /*var args: any = arguments;

            console.log(args)

            if (target instanceof (target.MessagePort||class{})||target instanceof (self.MessagePort||class{})) return target.self.postMessage(...args);
      
            var origin: any = '*';
            var ports: any = false;
            var portArg: any = undefined;
            var noOrigin: Boolean = false;
            if (Array.isArray(arguments[2])&&(JSON.stringify(arguments[2].map(e=>e instanceof self.MessagePort))==JSON.stringify(arguments[2].map(e=>true)))) ports = true;
            if (target instanceof self.MessagePort) {noOrigin = true; origin = undefined;};
            if (target instanceof self.Worker) {noOrigin = true; origin = undefined;};
            if (target instanceof (self.DedicatedWorkerGlobalScope||class{})) {
              origin = undefined;
              noOrigin = true;
            };
      
            if (noOrigin&&ports) origin = '*';
            if (ports) portArg = arguments[2];
      
            var finalArgs = [];
      
            finalArgs.push({data: arguments[0], __origin: arguments[1]||undefined});
            if (origin) finalArgs.push(origin);
            if (portArg) finalArgs.push(portArg);

            console.log(target, finalArgs);

            return target.self.postMessage(...finalArgs);*/
        }
    }

    var n: any = null;
    var f: any = false;
    
    class ProxyEvent {
        message = {origin: '*', data: n};
        go: any = true;
    
        constructor(event: MessageEvent) {
          var that: any = this;

          console.log(event);

          if (typeof event.data !== 'object'||(event.data.__origin+''=='undefined')) return ((that.message.data = event.data) && (that.go = f));

          for (var en in (event)) {
            var entry: string = en;
            if (entry == 'data'&&!event[entry].__origin) event[entry].__origin = '';
            if (entry == 'data'&&event[entry].__origin) that.origin = event[entry].__origin;
            if (entry == 'data') that.data = event[entry];
            if (entry!=='origin') that[entry] = that[entry];
          }
        }
      
        get origin() {
          return this.message.origin;
        }
        set origin(val) {
          this.message.origin = val;
        }
      
        get data() {
          return this.message.data
        }
        set data(val) {
          if (!val) val = {};
          if (val.__origin!==undefined&&val.data) {
            this.message.origin = val.__origin;
            this.message.data = val.data;
          }
          if (val.__origin!==undefined&&val.data) val = val.data;
          this.message.data = val;
        }
    }

    self.addEventListener = new Proxy(self.addEventListener, {
      apply(t, g, a): any {
          if (a[0]=='message') {
              var original = a[1].bind({});

              a[1] = function(event: any) {
                if (event instanceof ProxyEvent) return original(event);

                var n = new ProxyEvent(event);

                console.log(n.data, event);

                if (n.go)
                  return original(n);
                else return original(event);
              }
          }
          Reflect.apply(t, g, a);
          
          return a[1];
      }
    });

    self.Worker.prototype.addEventListener = new Proxy(self.Worker.prototype.addEventListener, {
      apply(t, g, a): any {
          if (a[0]=='message') {
              var original = a[1].bind({});

              a[1] = function(event: any) {
                if (event instanceof ProxyEvent) return original(event);

                var n = new ProxyEvent(event);

                console.log(n, event);

                if (n.go)
                  return original(n);
                else return original(event);
              }
          }
          Reflect.apply(t, g, a);
          
          return a[1];
      }
    });

    Object.defineProperty(self, 'onmessage', {
        get() {
            return self.__dynamic.onmessage;
        },
        set(val: any) {

            if (self.__dynamic.onmessage) {
                self.removeEventListener('message', self.__dynamic.onmessage)
            }

            self.__dynamic.onmessage = self.addEventListener('message', val);
        }
    })
}