importScripts('/dynamic/dynamic.worker.js');

const dynamic = new Dynamic();

self.dynamic = dynamic;

importScripts('/dynamic-handler.js');

self.addEventListener('fetch',
    event => {
        event.respondWith(
            dynamic.fetch(event)
        )
    }
);