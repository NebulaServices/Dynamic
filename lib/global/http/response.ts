export default class DynamicResponse extends Response {
    status:any;
    body: any;
    statusText:any;
    headers:any;

    constructor(body: BodyInit = '', init: any | undefined = {}) {
        super(body, init)
        
        this.body = body;//new Response(body, {}).body;

        if (init.status) this.status = init.status;
        if (init.statusText) this.statusText = init.statusText;
        if (init.headers) this.headers = init.headers;
    }

    get init() {
        return {
            headers: this.headers||{},
            statusText: this.statusText||200,
            body: this.body||undefined,
            status: this.statusText||'OK',
          }
    }
}