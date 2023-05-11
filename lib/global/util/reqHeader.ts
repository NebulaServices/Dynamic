export default function Header(this: any, headers: any, meta: any, request: any, cookies: any) {
    let { referrer }: any = request;

    [
        'origin',
        'Origin',
        'host',
        'Host',
        'referer',
        'Referer'
    ].forEach((header: string) => {
        if (headers[header]) delete headers[header];
    });

    headers['Origin'] = `${meta.protocol}//${meta.host}`;
    headers['Host'] = meta.host;
    headers['Referer'] = meta.href;

    if (request.referrerPolicy == 'strict-origin-when-cross-origin') headers['Referer'] = `${meta.protocol}//${meta.host}/`;

    if (request.referrerPolicy == 'origin' && meta.origin) {
        referrer = meta.origin+'/';
    }

    if (cookies) {
        headers['Cookie'] = cookies;
    }

    if (referrer && referrer != location.origin+'/') {
        try {
            headers['Referer'] = this.ctx.url.decode(referrer);
            if (request.referrerPolicy=='strict-origin-when-cross-origin') headers['Referer'] = new URL(this.ctx.url.decode(referrer)).origin;
            headers['Origin'] = new URL(this.ctx.url.decode(referrer)).origin;
        } catch {}
    }

    if (request.client) {
        headers['Origin'] = request.client.__dynamic$location.origin;
        headers['Referer'] = request.client.__dynamic$location.href;

        if (request.referrerPolicy=='strict-origin-when-cross-origin') headers['Referer'] = request.client.__dynamic$location.origin;
    }

    return new Headers(headers);
}