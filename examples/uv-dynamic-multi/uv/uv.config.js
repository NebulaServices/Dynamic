/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/service/uv/',
    bare: 'https:///',
    encodeUrl: Ultraviolet.codec.plain.encode,
    decodeUrl: Ultraviolet.codec.plain.decode,
    handler: '/dist/uv.handler.js',
    client: '/dist/uv.client.js',
    bundle: '/dist/uv.bundle.js',
    config: '/dist/uv.config.js',
    sw: '/dist/uv.sw.js',
};
