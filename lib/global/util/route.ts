async function route(this: any, request: Request) {
  var parsed = this.ctx.modules.url.parse(request.url);
  var query = this.ctx.modules.querystring.parse(parsed.query);

  var url = query.url;

  return new Response('', {status: 301, headers: {location: location.origin+this.ctx.config.prefix+url}});
}

function routePath(this: any, { url }: Request) {
  return !(url.toString().substr(location.origin.length, (this.ctx.config.prefix+'route').length).startsWith(this.ctx.config.prefix+'route'));
}

export { route, routePath };