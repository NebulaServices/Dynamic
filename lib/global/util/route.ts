async function route(this: any, request: Request) {
  var parsed = new URL(request.url);
  var url = parsed.searchParams.get('url');

  return new Response('', {status: 301, headers: {location: location.origin+this.ctx.config.prefix+url}});
}

function routePath(this: any, { url }: Request) {
  return !(url.toString().substr(location.origin.length, (this.ctx.config.prefix+'route').length).startsWith(this.ctx.config.prefix+'route'));
}

export { route, routePath };