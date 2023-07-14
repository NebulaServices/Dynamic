export default function websocket(self: Window | any) {
  // ty divide i love you

  const createSocket = (url: string, protocols?: string | string[]): WebSocket => {
    return self.__dynamic.bare.createWebSocket.apply(
      self.__dynamic.bare,
      [url, {}, protocols || []],
    );
  }

  self.WebSocket = new Proxy(self.WebSocket, {
    construct(target: Function, args: Array<string | string[] | any>): any {
      console.log(args);
      return createSocket(args[0], args[1]);
    }
  });
}