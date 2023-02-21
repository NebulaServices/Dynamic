export default function Header(headers: any, meta: any, request: Request) {
    const { referrer }: any = request;

    headers['origin'] = `${meta.protocol}//${meta.host}`;
    headers['host'] = meta.host;
    headers['Host'] = meta.host;

    if (referrer) {
        try {
            var unwritten = this.ctx.url.decode(referrer)

            headers['referer'] = unwritten;
        } catch {
            headers['referer'] = meta.href;
        }
    } else headers['referer'] = meta.href;

    return new Headers(headers);
}