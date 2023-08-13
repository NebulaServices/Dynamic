self.__dynamic$config = {
    prefix: '/service/',
    encoding: 'xor',
    mode: 'production', // development: zero caching, no minification, production: speed-oriented
    logLevel: 0, // 0: none, 1: errors, 2: errors + warnings, 3: errors + warnings + info
    bare: {
      version: 2, // v3 is bad
      path: '/bare/',
    },
    tab: {
      title: 'Service',
      icon: null,
      ua: null,
    },
    assets: {
      prefix: '/dynamic/',
      files: {
        handler: 'dynamic.handler.js',
        client: 'dynamic.client.js',
        worker: 'dynamic.worker.js',
        config: 'dynamic.config.js',
        inject: null,
      }
    },
    block: [
    
    ]
  };