import { encodeProtocol as encode_protocol } from './protocol';

export default function WebSocket(self: any) {

    var websockets: any = [];
    var target = (id: any) => self.location.protocol.replace('http', 'ws') + '//' + self.location.hostname + "/bare/v1/?id=" + id;

    var wsUrl = Object.getOwnPropertyDescriptor(self.WebSocket.prototype, 'url');
  
    self.__dynamic.define(self.WebSocket.prototype, 'url', {
      get() {
        var url = wsUrl.get.call(this);
        try {
          var param = new URLSearchParams(new URL(url).search).get('id');
          if (param) {
            return String(websockets.find((e:any)=>e[0]==parseInt(param))[1])
          }
          return url;
        } catch(e) {
          return url;
        }
      },
      set(val: any) {
        return false;
      }
    });

    self.WebSocket = new Proxy(self.WebSocket, {
        construct(e, [o, t]) {
          
            const url = new URL(o);
  
            var WsId = Math.floor(Math.random() * (999999 - 100000) + 100000);
  
            websockets.push([WsId, url]);

            console.log(url);
          
            const r = {
                remote: {
                    host: url.hostname,
                    port: url.port || (url.protocol === 'wss:' ? '443' : '80'),
                    path: url.pathname + url.search,
                    protocol: url.protocol
                },
                headers: {
                    Host: url.hostname,
                    Origin: self.__dynamic$location.origin,
                    Pragma: "no-cache",
                    "Cache-Control": "no-cache",
                    Upgrade: "websocket",
                    Connection: "Upgrade"
                },
                forward_headers: ["accept-encoding", "accept-language", "sec-websocket-extensions", "sec-websocket-key", "sec-websocket-version"]
            };        
          
            var socket = self.__dynamic.Reflect.construct(e, [ target(WsId), [  'bare', encode_protocol(JSON.stringify(r)) ] ]);
  
            var listener = function(e:Event) {
              websockets.splice(websockets.findIndex((e:any)=>e[0]==WsId), 1);
            }
  
            socket.addEventListener('close', listener);
            socket.addEventListener('error', listener);
  
            return socket;
        }
    });
}