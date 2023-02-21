import { DynamicBundle } from '../global/bundle';
import headers from '../global/headers';


(function(self: any) {
  self.addEventListener('install', (event: Event) => {
    self.skipWaiting();
  })
  
  self.addEventListener('activate', (event: any) => {
    event.waitUntil(self.clients.claim());
  });

  const __dynamic: DynamicBundle = new DynamicBundle(null);

  self.__dynamic = __dynamic;
  
  importScripts('/dynamic/dynamic.config.js');

  __dynamic.config = self.__dynamic$config;

  __dynamic.config.bare.path = typeof __dynamic.config.bare.path === 'string' ? [ new URL(__dynamic.config.bare.path, self.location) ][0] : __dynamic.config.bare.path.map((str:any) => new URL(str, self.location));

  __dynamic.bare = new __dynamic.modules.bare(__dynamic.config.bare.path);
  
  return self.DynamicSW = class {
    constructor() {}
    middleware = __dynamic.middleware;
  
    async fetch({ request }: any) {
      if (!!__dynamic.util.path(request)) return fetch(request);
      if (!__dynamic.util.routePath(request)) return await __dynamic.util.route(request);

      const Dynamic: DynamicBundle = new DynamicBundle(__dynamic.config);

      Dynamic.meta.load(new URL(Dynamic.url.decode(new URL(request.url))));

      if (request.url.split('?')[1]&&Dynamic.config.encoding!=='plain') {
        var ResponseURL = Dynamic.url.encode(Dynamic.meta.href+'?'+request.url.split('?')[1], Dynamic.meta);

        var headers: any = {Location: ResponseURL};
  
        return new Response(new Blob([Dynamic.rewrite.html.generateRedirect(ResponseURL)]), {status: 301, statusText: 'Moved Permanently', headers: headers});
      }

      const RawHeaders: Object = Object.fromEntries(request.headers.entries());

      const ReqHeaders: Headers = __dynamic.util.reqHeader(RawHeaders, Dynamic.meta, request);

      const Request:any = new __dynamic.http.Request(Dynamic.meta.href, {
        headers: ReqHeaders,
        redirect: 'manual',
        method: request.method,
      });

      if (__dynamic.headers.method.body.indexOf(request.method.toUpperCase())==-1) Request.body = await request.blob();

      const BareRequest = await __dynamic.bare.fetch(Dynamic.meta.href, Request.init);

      const ResHeaders: Headers = Dynamic.util.resHeader(BareRequest.rawHeaders, Dynamic.meta);

      let ResponseBody:any = false;

      switch(request.destination) {
        case "document":
        case "iframe":
          const ResponseBlob = await BareRequest.blob();
          const ResponseText = await ResponseBlob.text();

          const HeaderInject = Dynamic.rewrite.html.generateHead(location.origin+'/dynamic/dynamic.client.js', location.origin+'/dynamic/dynamic.config.js', '')

          if (Dynamic.is.html(Dynamic.meta, BareRequest.headers.get('content-type'), ResponseText))
            ResponseBody = new Blob([Dynamic.rewrite.html.rewrite(ResponseText, Dynamic.meta, HeaderInject)]);
          else
            ResponseBody = ResponseBlob;
          break;
        case "worker":
        case "script":
          console.log(request.url, Dynamic.is.js(Dynamic.meta, BareRequest.headers.get('content-type')))
          if (Dynamic.is.js(Dynamic.meta, BareRequest.headers.get('content-type')))
            ResponseBody = new Blob([Dynamic.rewrite.js.rewrite(await BareRequest.text(), Dynamic.meta)]);
          break;
        case "style":
          if (Dynamic.is.css(Dynamic.meta, BareRequest.headers.get('content-type')))
            ResponseBody = new Blob([Dynamic.rewrite.css.rewrite(await BareRequest.text(), Dynamic.meta)]);
          break;
        default:
          break;
      }

      if (ResponseBody==false) ResponseBody = await BareRequest.blob();

      if (__dynamic.headers.status.empty.indexOf(BareRequest.status)!==-1) ResponseBody = null;

      if (ReqHeaders.get('accept') === 'text/event-stream') {
          ResHeaders.set('content-type', 'text/event-stream')
      };

      return new Response(ResponseBody, {status: BareRequest.status, statusText: BareRequest.statusText, headers: ResHeaders});
    }
  }
})(self) as Function;