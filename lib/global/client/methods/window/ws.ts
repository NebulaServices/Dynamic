export default function websocket(self: Window | any) {
  // ty divide i love you

  self.WebSocket = function(): WebSocket {
    return self.__dynamic.bare.createWebSocket.apply(
      self.__dynamic.bare,
      [arguments[0], arguments[1] || [], {}]
    )
  }
}