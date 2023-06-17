export default function rewritePath(this: any, request: Request, client: any, meta: any) {
    if (!request.url.startsWith('http')) return request.url;

    let url: any = request.url.toString();

    if (request.url.startsWith(location.origin)) url = url.substr(self.location.origin.length);

    url = new URL(url, new URL(client.__dynamic$location.href)).href;

    return this.ctx.url.encode(url, meta);
}