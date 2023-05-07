import { DynamicBundle } from '../global/client';

export default function(self: any, config: any = {}, altURL: string = '') {
  const __dynamic: DynamicBundle = new DynamicBundle(self.__dynamic$config || config);

  __dynamic.parent = self.parent;
  __dynamic.top = self.top;

  self.__dynamic$baseURL = self.__dynamic$url||altURL||__dynamic.url.decode(location.pathname)||'';

  self.__dynamic = __dynamic;

  self.__dynamic.meta.load(new URL(self.__dynamic$baseURL));

  for (var method of self.__dynamic.client.methods) {
    const name: any = method.name;
    const func: any = Object.entries(self.__dynamic.client).find(e=>e[0]==name);

    if (method.function=='self') func[1](self);
  };
};