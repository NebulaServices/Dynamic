import { DynamicBundle } from '../global/client';

(function(self: any) {
  const __dynamic: DynamicBundle = new DynamicBundle(self.__dynamic$config);

  self.__dynamic$baseURL = __dynamic.url.decode(location.pathname);

  self.__dynamic = __dynamic;

  self.__dynamic.meta.load(new URL(self.__dynamic$baseURL));

  self.__dynamic.client.methods.forEach((method: any, index: number) => {
    const name: any = method.name;
    const func: any = Object.entries(self.__dynamic.client).find(e=>e[0]==name);

    if (method.function=='self') return func[1](self);
  })
})(self);