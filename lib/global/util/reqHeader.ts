/*export default function Header(this: any, headers: any, meta: any, request: any, cookies: any) {
    let { referrer }: any = request;

    [
        'Origin',
        'Host',
        'Referer'
    ].forEach((header: string) => {
        if (headers[header]) delete headers[header];
        if (headers[header.toLowerCase()]) delete headers[header.toLowerCase()];

        headers[header] = (new URL(meta.href) as object | any)[header.toLowerCase()];
    });

    switch(request.referrerPolicy) {
        case 'no-referrer':
            headers['Referer'] = '';
            break;
        case 'strict-origin-when-cross-origin':
            headers['Referer'] = `${meta.protocol}//${meta.host}/`;
            break;
        case 'origin':
            if (meta.origin) headers['Referer'] = meta.origin+'/';
            break;
    }

    try {
        if (referrer && referrer != location.origin+'/') {
            headers['Referer'] = this.ctx.url.decode(referrer);
            if (request.referrerPolicy=='strict-origin-when-cross-origin') headers['Referer'] = new URL(this.ctx.url.decode(referrer)).origin;
            headers['Origin'] = new URL(this.ctx.url.decode(referrer)).origin;
        }

        if (request.client) {
            headers['Origin'] = request.client.__dynamic$location.origin;
            headers['Referer'] = request.client.__dynamic$location.href;
    
            if (request.referrerPolicy=='strict-origin-when-cross-origin') headers['Referer'] = request.client.__dynamic$location.origin + '/';
        }
    } catch {};

    if (cookies) {
        headers['Cookie'] = cookies;
    }

    headers['sec-fetch-dest'] = request.destination || 'empty';
    headers['sec-fetch-mode'] = request.mode || 'cors';
    headers['sec-fetch-site'] = request.client ? request.client.__dynamic$location.origin == meta.origin ? request.client.__dynamic$location.port == meta.port ? 'same-origin' : 'same-site' : 'cross-origin' : 'none';
    headers['sec-fetch-user'] = '?1';

    return new Headers(headers);
}

*/export default function Header(this: any, headers: any, meta: any, request: any, cookies: any) {
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

    headers['sec-fetch-dest'] = request.destination || 'empty';
    headers['sec-fetch-mode'] = request.mode || 'cors';
    headers['sec-fetch-site'] = request.client ? request.client.__dynamic$location.origin == meta.origin ? request.client.__dynamic$location.port == meta.port ? 'same-origin' : 'same-site' : 'cross-origin' : 'none';
    headers['sec-fetch-user'] = '?1';

    return new Headers(headers);
}