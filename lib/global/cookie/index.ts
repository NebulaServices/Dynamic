import { DB } from './db';
import { serialize } from './parse';

export default class Cookie {
    _db: any;
    db: any = DB;
    ctx: any;
    constructor(ctx: any) {this.ctx = ctx;}
    async get(host: any) {
        if (!this._db) this._db = this.db.open();
        const cookie = await DB.get(host, this._db);
        return serialize(cookie);
    }
    async set(host: any, raw: any = '') {
        raw = this.ctx.modules.setCookieParser.parse(raw, {decodeValues: false})[0];
        if (!this._db) this._db = this.db.open();
        const cookie = await DB.set(host, raw, this._db);
        return cookie;
    }
    async open() {
        await DB.open();
    }
    async update(host: any) {
        if (!this._db) this._db = this.db.open();
        return await DB.update(host, this._db);
    }
}