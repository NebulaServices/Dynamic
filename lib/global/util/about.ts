export default class about {
    rawHeaders = {};
    headers = new Headers({});

    body;

    constructor(blob: Blob) {
        this.body = blob;
    }

    async blob() {
        return this.body;
    }

    async text() {
        return await this.body.text();
    }
}