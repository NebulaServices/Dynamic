import location from './methods/core/location';
import get from './methods/core/get';
import window from './methods/core/window';
import attr from './methods/document/attr';
import worker from './methods/window/worker';
import history from './methods/window/history';
import ws from './methods/window/ws';
import fetch from './methods/window/fetch';
import message from './methods/window/message';
import write from './methods/document/write';
import imports from './methods/window/imports';
import reflect from './methods/core/reflect';
import niche from './methods/window/niche';
import storage from './methods/window/storage';
import navigator from './methods/window/navigator';
import cookie from './methods/document/cookie';
import style from './methods/document/style';
import blob from './methods/window/blob';
import mutation from './methods/document/mutation';

import DynamicClientMethods from './methods';

export default class DynamicClient {

    location = location;
    get = get;
    window = window;
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
    navigator = navigator;
    cookie = cookie;
    style = style;
    blob = blob;
    mutation = mutation;

    define: any;
    wrap: any;

    methods = DynamicClientMethods;

    ctx;

    constructor(ctx: any) {
        this.ctx = ctx;
    }
}