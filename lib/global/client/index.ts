import location from './methods/location';
import get from './methods/get';
import window from './methods/window';
import define from './methods/define';
import attr from './methods/attr';
import worker from './methods/worker';
import history from './methods/history';
import ws from './methods/ws';
import fetch from './methods/fetch';
import message from './methods/message';
import write from './methods/write';
import imports from './methods/imports';
import reflect from './methods/reflect';
import niche from './methods/niche';
import storage from './methods/storage';
import cookie from './methods/cookie';
import style from './methods/style';

import DynamicClientMethods from './methods';

export default class DynamicClient {

    location = location;
    get = get;
    window = window;
    define = define;
    attr = attr;
    worker = worker;
    history = history;
    ws = ws;
    fetch = fetch;
    message = message;
    write = write;
    imports = imports;
    reflect = reflect;
    niche = niche;
    storage = storage;
    cookie = cookie;
    style = style;

    methods = DynamicClientMethods;

    ctx;

    constructor(ctx: any) {
        this.ctx = ctx;
    }
}