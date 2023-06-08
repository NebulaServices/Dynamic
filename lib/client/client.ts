import { DynamicBundle } from '../global/client';

import init from '../global/client/methods/init';
import wrap from '../global/client/methods/wrap';

export default function(self: any, config: any = {}, altURL: string = '') {
  if (self.hasOwnProperty("__dynamic")) return false;
  if (!self.hasOwnProperty("__dynamic$config")) self.__dynamic$config = config;

  const __dynamic: DynamicBundle = new DynamicBundle(self.__dynamic$config);

  self.__dynamic$baseURL = altURL || self.__dynamic$url || __dynamic.url.decode(location.pathname + location.search + location.hash) || "";

  self.__dynamic = __dynamic;

  self.__dynamic.meta.load(new URL(self.__dynamic$baseURL));

  init(self, null), wrap(self);

  for (var method of self.__dynamic.client.methods) {
    const name: any = method.name;
    const func: any = Object.entries(self.__dynamic.client).find(e=>e[0]==name);

    if (method.function=='self') func[1](self);

    continue;
  }; 
};