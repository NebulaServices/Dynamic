self.__dynamic$config = {
  prefix: '/service/',
  encoding: 'none',
  mode: 'development', // development: zero caching, no minification, production: speed-oriented
  rewrite: {
    css: 'regex',
    js: 'acorn',
    html: 'htmlparser2',
  },
  bare: {
    version: 2,
    path: 'https://tomp.app/',
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
      inject: '/dynamic-handler.js',
    }
  },
  block: [
    //"www.google.com",
  ]
};