import { DynamicBundle } from '../global/client';
importScripts('/dynamic/dynamic.config.js');

(function(self: any) {
  const __dynamic: DynamicBundle = new DynamicBundle(self.__dynamic$config);
  self.__dynamic = __dynamic;

  const __dynamic$baseURL: string = __dynamic.url.decode(location.pathname);

  __dynamic.meta.load(new URL(__dynamic$baseURL));

  __dynamic.client.define(self);
  __dynamic.client.message(self);
  __dynamic.client.location(self, false);
  __dynamic.client.window(self);
  __dynamic.client.get(self);
  __dynamic.client.reflect(self);
  __dynamic.client.imports(self);
})(self);