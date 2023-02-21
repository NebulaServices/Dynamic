importScripts('./dynamic/dynamic.worker.js');

const sw = new DynamicSW();

self.addEventListener('fetch', event =>
    event.respondWith(
        sw.fetch(event)
    )
);