import { DynamicBundle } from '../global/bundle';
import Cookie from '../global/cookie';

(function(self: ServiceWorker | any) {
  self.skipWaiting();

  self.addEventListener('install', async (event: Event, cl: any) => {
    console[self.__dynamic$config.mode == 'development' ? 'group' : 'groupCollapsed']('Dynamic Install Sequence:');

    if (typeof self.ORIGINS == 'object') {
      if (self.ORIGINS.length) {
        if (self.ORIGINS[0] == '*') console.log("Wildcard Origin Accepted");
        else if (!self.ORIGINS.includes(location.origin)) {
          console.error("Illegal Origin: " + location.origin);
          console.log("Status: Aborting Install");
          console.groupEnd();
          return await self.registration.unregister();
        } else console.log("Origin Verified: " + location.origin);
      } else console.warn("Warning: No Origins Specified");
    } else if (typeof self.ORIGINS == 'string') {
      if (self.ORIGINS == '*') console.log("Wildcard Origin Accepted");
    } else console.warn("Warning: No Origins Specified");

    console.log('ServiceWorker Installed:', event);

    console.log('Configuration Loaded:', self.__dynamic$config);

    await self.skipWaiting();

    console.groupCollapsed('Loading Dynamic Modules:');

    for await (var i of [['html', 'dynamic.html.js']] as any) {
      var [name, url]: any = i;

      url = new URL(url, new URL(location.origin + self.__dynamic$config.assets.prefix + 'dynamic.worker.js')).href;

      self[name] = fetch(url).then((res: any) => {
        console.log('Loaded Dynamic Module: ' + name, res);

        return self[name] = res.text();
      }).then((text: any) => {
        return eval(text);
      });

      console.log('Loading: ' + name, url);

      continue;
    }

    console.groupEnd();

    if (self.__dynamic$config.mode == 'development') return console.groupEnd();

    const cache = await caches.open('__dynamic$files');

    console.groupCollapsed('Dynamic File Cache:');

    for await (var i of Object.values(self.__dynamic$config.assets.files) as any) {
      if (!i) continue;
      
      var url: any = i;
      url = new URL(url, new URL(location.origin + self.__dynamic$config.assets.prefix + 'dynamic.worker.js')).href;

      const res = await fetch(url);
      await cache.put(url, res);

      console.log('Cache Installed: ' + url.split('/').pop(), res);

      continue;
    };

    console.groupEnd();

    console.groupEnd();

    return;
  });
  
  self.addEventListener('activate', (event: Event | any) => {
    self.skipWaiting();
    event.waitUntil(self.clients.claim());
  });

  self.addEventListener('message', async (event: MessageEvent) => {
    const { data }: MessageEvent = event;

    if (data.type == 'createBlobHandler') {
      var res = new Response(data.blob, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Length': data.blob.size,
          'x-dynamic-location': data.location
        }
      });

      var cache = await caches.open('__dynamic$blob');
      var url = __dynamic.config.prefix + 'caches/' + data.url;

      await cache.put(url, res);

      self.clients.matchAll().then((clients: Array<object>) => {
        clients.forEach((client: Window | any) => {
          client.postMessage({url});
        });
      });
    }
  });

  importScripts('/dynamic/dynamic.config.js');

  const __dynamic: DynamicBundle = new DynamicBundle(self.__dynamic$config), blockList = self.__dynamic$config.block || [];

  __dynamic.config = self.__dynamic$config;
  __dynamic.config.bare.path = typeof __dynamic.config.bare.path === 'string' ? [ new URL(__dynamic.config.bare.path, self.location) ][0] : __dynamic.config.bare.path.map((str:any) => new URL(str, self.location));
  __dynamic.bare = new __dynamic.modules.bare(__dynamic.config.bare.path);

  __dynamic.encoding = {
    ...__dynamic.encoding,
    ...(__dynamic as any).encoding[__dynamic.config.encoding || 'none']
  };

  self.__dynamic = __dynamic;

  /*self.console.error = (message: any, ...optionalParams: any[]) => {
    return console.log.call({}, ...['%c'+message, 'background: #240d0d;padding:10px;color:#ff7474;font-size:11px;', ...optionalParams]);
  };*/

  self.Object.defineProperty(self.WindowClient.prototype, '__dynamic$location', {get() { return new URL(__dynamic.url.decode(this.url)) }});

  return self.Dynamic = class {
    constructor() {}

    listeners: Array<any> = [];
    middleware = __dynamic.middleware;

    on = self.__dynamic.on;
    fire = self.__dynamic.fire;
  
    async fetch(event: Event | any) {
      const { request } = event;

      const userData = __dynamic.modules.bowser.parse(navigator.userAgent);
      const userBrowser = userData.browser.name;

      try {
        if (request.mode !== 'navigate') request.client = (await self.clients.matchAll()).find((e:any)=>e.id==event.clientId);

        if (!!__dynamic.util.file(request)) return await __dynamic.util.edit(request);
        if (!!__dynamic.util.path(request)) {
          if (!request.client || !request.url.startsWith('http'))
            return await fetch(request);
          else Object.defineProperty(request, 'url', {value: __dynamic.util.rewritePath(request, request.client, new URL(self.__dynamic.url.decode(new URL(request.url))))});
        }
        if (!__dynamic.util.routePath(request)) return await __dynamic.util.route(request);

        await __dynamic.bare.working;
        console.log(__dynamic.bare);

        const Dynamic: DynamicBundle = new DynamicBundle(__dynamic.config);

        Dynamic.encoding = {
          ...Dynamic.encoding,
          ...(Dynamic.encoding as any)[__dynamic.config.encoding || 'none']
        };

        Dynamic.on = (event: string, cb: Function) => self.__dynamic.on(event, cb);
        Dynamic.fire = (event: string, ...data: Array<any>) => self.__dynamic.fire(event, data);

        if (request.url.startsWith(location.origin + __dynamic.config.prefix + 'caches/')) {
          const cache: Response | any = await caches.open('__dynamic');
          const res: Response | any = await cache.match(new URL(request.url).pathname);

          if (!res) return new Response(null, {
            status: 201
          });

          var body;

          const ResponseBlob = await res.blob();
          const ResponseText = await ResponseBlob.text();

          const HeaderInject = Dynamic.rewrite.html.generateHead(location.origin+self.__dynamic$config.assets.prefix+self.__dynamic$config.assets.files.client, location.origin+self.__dynamic$config.assets.prefix+self.__dynamic$config.assets.files.config, location.origin+self.__dynamic$config.assets.prefix+self.__dynamic$config.assets.files.config, '', `window.__dynamic$url = "${res.headers.get('x-dynamic-location')}"`);

          Dynamic.meta.load(new URL(res.headers.get('x-dynamic-location')));

          if (Dynamic.is.html(Dynamic.meta, res.headers.get('content-type'), ResponseText))
            body = new Blob([Dynamic.rewrite.html.rewrite(ResponseText, Dynamic.meta, HeaderInject)]);
          else
            body = ResponseBlob;

          return new Response(body, {
            status: res.status,
            statusText: res.statusText,
            headers: res.headers,
          });
        }

        Dynamic.meta.load(new URL(Dynamic.url.decode(new URL(request.url))));

        if (blockList.indexOf(Dynamic.meta.host) !== -1) return (this.fire('blocked', [Dynamic.meta, request]) || new Response(null, {
          status: 403,
          statusText: 'Forbidden'
        }));

        const Cookies = Dynamic.cookies as Cookie;

        await Cookies.open();
        await Cookies.update(Dynamic.meta.host);

        const RawHeaders: Object = Object.fromEntries(request.headers.entries());

        const ReqHeaders: Headers = __dynamic.util.reqHeader(RawHeaders, Dynamic.meta, request, await Cookies.get(request.client ? request.client.__dynamic$location.host : Dynamic.meta.host));

        const Request: any = new __dynamic.http.Request(Dynamic.meta.href as string, {
          headers: ReqHeaders,
          redirect: 'manual',
          method: request.method,
          credentials: 'omit',
          body: null
        });

        let BareRequest: Response | any;

        if (__dynamic.headers.method.body.indexOf(request.method.toUpperCase())==-1) Request.body = await request.blob();

        if (Dynamic.meta.protocol !== 'about:') {
          BareRequest = await __dynamic.bare.fetch(Dynamic.meta.href, Request.init);
        } else {
          BareRequest = new __dynamic.util.about(new Blob(["<html><head></head><body></body></html>"]));
        }

        const ResHeaders: Headers = await Dynamic.util.resHeader(BareRequest.rawHeaders, Dynamic.meta, Cookies);

        var Clients = await self.clients.matchAll();

        for await (var client of Clients) {
          client.postMessage({type: 'cookies', host: Dynamic.meta.host, cookies: await Cookies.get(Dynamic.meta.host)});

          continue;
        }
    
        let ResponseBody: any = false;

        switch(request.destination) {
          case "document":
            const ResponseBlob = await BareRequest.blob();
            const ResponseText = await ResponseBlob.text();

            const HeaderInject = Dynamic.rewrite.html.generateHead(location.origin+self.__dynamic$config.assets.prefix+self.__dynamic$config.assets.files.client, location.origin+self.__dynamic$config.assets.prefix+self.__dynamic$config.assets.files.config, location.origin+self.__dynamic$config.assets.prefix+self.__dynamic$config.assets.files.client, await Cookies.get(Dynamic.meta.host), '', false, 'self.__dynamic$bare = JSON.parse("'+JSON.stringify(__dynamic.bare.manifest)+'");');

            if (Dynamic.is.html(Dynamic.meta, BareRequest.headers.get('content-type'), ResponseText))
              ResponseBody = new Blob([Dynamic.rewrite.html.rewrite(ResponseText, Dynamic.meta, HeaderInject)], {type: BareRequest.headers.get('content-type')||'text/html; charset=utf-8'});
            else
              ResponseBody = ResponseBlob;
            break;
          case "iframe": {
            let ResponseBlob = await BareRequest.blob() as Blob;
            let ResponseText = await ResponseBlob.text() as string;

            if (Dynamic.is.html(Dynamic.meta, BareRequest.headers.get('content-type'), ResponseText)) {

              try {
                let HeaderInject = Dynamic.rewrite.html.generateHead(location.origin+self.__dynamic$config.assets.prefix+self.__dynamic$config.assets.files.client, location.origin+self.__dynamic$config.assets.prefix+self.__dynamic$config.assets.files.config, location.origin+self.__dynamic$config.assets.prefix+self.__dynamic$config.assets.files.client, await Cookies.get(Dynamic.meta.host), '', true, 'self.__dynamic$bare = '+JSON.stringify(__dynamic.bare.manifest));
                ResponseBody = new Blob([(new (await self.html)({ctx: Dynamic})).rewrite(ResponseText, Dynamic.meta, HeaderInject)], {type: BareRequest.headers.get('content-type')||'text/html; charset=utf-8'});
              } catch {
                ResponseBody = ResponseBlob;
              }


              break;
            }
            
            ResponseBody = ResponseBlob;

            break;
          }
          case "worker":
          case "script":
            if (Dynamic.is.js(Dynamic.meta, BareRequest.headers.get('content-type')))
              ResponseBody = new Blob([Dynamic.rewrite.js.rewrite(await BareRequest.text(), request, true, Dynamic)], {type: BareRequest.headers.get('content-type')||'application/javascript'});
            break;
          case "style":
            if (Dynamic.is.css(Dynamic.meta, BareRequest.headers.get('content-type')))
              ResponseBody = new Blob([Dynamic.rewrite.css.rewrite(await BareRequest.text(), Dynamic.meta)], {type: BareRequest.headers.get('content-type')||'text/css'});
            break;
          case "manifest":
            ResponseBody = new Blob([Dynamic.rewrite.man.rewrite(await BareRequest.text(), Dynamic.meta)], {type: BareRequest.headers.get('content-type')||'application/json'})
            break;
          default: {
            let ResponseBlob = await BareRequest.blob() as Blob;
            let ResponseText = await ResponseBlob.text() as string;

            if (Dynamic.is.html(Dynamic.meta, BareRequest.headers.get('content-type'), ResponseText)) {
              try {
                ResponseBody = new Blob([(new (await self.html)({ctx: Dynamic})).rewrite(ResponseText, Dynamic.meta, [])], {type: BareRequest.headers.get('content-type')||'text/html; charset=utf-8'});
              } catch {
                console.log(self.html);
                ResponseBody = ResponseBlob;
              }

              break;
            }
            
            ResponseBody = ResponseBlob;
            break;
          }
        }

        if (ResponseBody==false) ResponseBody = await BareRequest.blob();

        if (__dynamic.headers.status.empty.indexOf(BareRequest.status)!==-1) ResponseBody = null;

        if (ReqHeaders.get('accept') === 'text/event-stream') {
            ResHeaders.set('content-type', 'text/event-stream')
        };

        if (ResponseBody) ResHeaders.set('content-length', ResponseBody.size);

        return new Response(ResponseBody, {status: BareRequest.status, statusText: BareRequest.statusText, headers: ResHeaders});
      } catch(e: Error | any) {
        console.error(e);
        return new Response(e, {status: 500, statusText: 'error', headers: new Headers({})});
      }
    };
  }
})(self) as Function;