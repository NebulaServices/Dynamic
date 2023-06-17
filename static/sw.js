importScripts('/dynamic/dynamic.config.js');
importScripts('/dynamic/dynamic.worker.js');

const dynamic = new Dynamic();

self.dynamic = dynamic;

self.addEventListener('fetch',
    event => {
        event.respondWith(
            dynamic.fetch(event)
        )
    }
);