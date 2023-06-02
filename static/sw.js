importScripts('/dynamic/dynamic.worker.js');

const sw = new Dynamic();

self.addEventListener('fetch', event =>
    event.respondWith(
        sw.fetch(event)
    )
);