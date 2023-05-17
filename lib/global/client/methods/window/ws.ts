import { encodeProtocol as encode_protocol } from "../core/protocol";

export default function websocket(self: any) {
  const websockets: any[] = [];
  const target = () =>
    `${self.location.protocol.replace("http", "ws")}//${
      self.location.hostname
    }/bare/v1/`;

  const WSUrl: PropertyDescriptor | any = Object.getOwnPropertyDescriptor(
    self.WebSocket.prototype,
    "url"
  );

  self.__dynamic.define(self.WebSocket.prototype, "url", {
    get() {
      const url = WSUrl.get.call(this);

      return self.__dynamic.url.decode(url);
    },
    set(val: any) {
      return false;
    },
  });

  self.WebSocket = self.__dynamic.wrap(
    self.WebSocket,
    (e: any, [o, t]: any) => {
      const url = new URL(o);

      const r = {
        remote: {
          host: url.hostname,
          port: url.port || (url.protocol === "wss:" ? "443" : "80"),
          path: url.pathname + url.search,
          protocol: url.protocol,
        },
        headers: {
          Host: url.hostname,
          Origin: self.__dynamic$location.origin,
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
          Upgrade: "websocket",
          Connection: "Upgrade",
        },
        forward_headers: [
          "accept-encoding",
          "accept-language",
          "sec-websocket-extensions",
          "sec-websocket-key",
          "sec-websocket-version",
        ],
      };

      return self.__dynamic.Reflect.construct(e, [
        target(),
        ["bare", JSON.stringify(r)],
      ]);
    }
  );
}