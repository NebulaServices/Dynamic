export default class DynamicRequest {
    headers: Object | any;
    redirect: String | undefined;
    body: Blob | Body | undefined | any;
    method: String | undefined;

    url: URL | String;

    constructor(url: URL | String = '', init: Object | any | undefined = new Request('')) {
      if (init.headers) this.headers = init.headers;
      if (init.redirect) this.redirect = init.redirect;
      if (init.body) this.body = init.body;
      this.method = init.method || 'GET'

      this.url = new String(url);
    }

    get init() {
      return {
        headers: this.headers||{},
        redirect: this.redirect||'manual',
        body: this.body||undefined,
        method: this.method||'GET',
      }
    }
  }