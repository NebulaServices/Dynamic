// shows off the dynamic handler stuffs;

if (typeof self.registration !== 'undefined') {
    // Only in SW

    self.dynamic.on('blocked', (meta, request) => {

    });

    self.dynamic.on('request', (meta, request) => {
        
    });

    self.dynamic.on('response', (meta, request, response) => {

    });

    self.dynamic.on('error', (meta, request, error) => {

    });
}

if (typeof window !== 'undefined') {
    // Only in Browser

    window.__dynamic.on('fetch', (url, request) => {
        //console.log(`Fetching: ${url}`);
    });

    window.__dynamic.on('XMLHttpRequest', (url, request) => {
        //console.log(`XMLHttpRequest: ${url}`);
    });
}