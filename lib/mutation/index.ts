declare const self: any;

import { DynamicBundle } from '../global/client';

import init from '../global/client/methods/init';

var __dynamic: DynamicBundle = new DynamicBundle(self.__dynamic$config);

self.__dynamic$baseURL = self.__dynamic$url || __dynamic.url.decode(location.pathname + location.search + location.hash) || "";

__dynamic.meta.load(new URL(self.__dynamic$baseURL));

init(self, __dynamic);

__dynamic.client.mutation(self, __dynamic);