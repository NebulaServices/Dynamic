export default async function Edit(req: any) {
    let request = await fetch(req);
    let text = await request.blob();

    if (req.url.startsWith(location.origin + '/dynamic/dynamic.config.js') || req.url.startsWith(location.origin + '/dynamic/dynamic.client.js')) {
        text = new Blob([`${await text.text()}\nself.document?.currentScript?.remove();`], {type: 'application/javascript'});
    }

    return new Response(text, {
        headers: request.headers,
        status: request.status,
        statusText: request.statusText
    });
}