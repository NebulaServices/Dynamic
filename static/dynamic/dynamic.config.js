self.__dynamic$config = {
  prefix: '/service/',
  encoding: 'base64',
  mode: 'production', // development: zero caching, no minification, production: speed-oriented
  rewrite: {
    css: 'regex',
    js: 'acorn',
    html: 'htmlparser2',
  },
  bare: {
    version: 2,
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
    }
  }
};