export default function Header(headers: any, meta: any, request: any, cookies: any) {
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
    headers['host'] = meta.host;
    headers['Host'] = meta.host;
    headers['Referer'] = meta.href;

    if (request.referrerPolicy == 'origin' && meta.origin) {
        referrer = meta.origin+'/';
    }

    if (cookies) {
        headers['Cookie'] = cookies;
    }

    if (referrer && referrer != location.origin+'/') {
        try {
            headers['Referer'] = this.ctx.url.decode(referrer);
            headers['Origin'] = new URL(this.ctx.url.decode(referrer)).origin;
        } catch {}
    }

    return new Headers(headers);
}