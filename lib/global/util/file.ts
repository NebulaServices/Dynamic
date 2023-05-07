export default function File(req: any) {
    return req.url.toString().substr(location.origin.length, req.url.toString().length).startsWith('/dynamic/dynamic.');
};