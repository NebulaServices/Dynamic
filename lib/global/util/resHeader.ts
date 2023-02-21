export default function Header(headers: any, meta: any) {

    for (const header in headers) {
        if (this.ctx.headers.csp.indexOf(header.toLowerCase())!==-1) delete headers[header];

        if (header.toLowerCase() == 'location') {
            headers[header] = this.ctx.url.encode(headers[header], meta);
        }
        if (header.toLowerCase() == 'set-cookie') {

        }
    }

    return new Headers(headers);
}