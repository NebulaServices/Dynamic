import { Element } from "domhandler";

declare const self: any;

export default function GenerateHead(this: any, scriptURL: any, configURL: any, mutationURL: any, cookies: any, script: any = '') {
    /*if (self.__dynamic$config) {
        var cache = self.__dynamic$config.mode == 'development';
    } else var cache = false;

    var array: Array<Object> = [
        `<script src="${configURL+(cache?'?'+Math.floor(Math.random()*(99999-10000)+10000):'')}"></script>`,
        `<script src="${mutationURL+(cache?'?'+Math.floor(Math.random()*(99999-10000)+10000):'')}"></script>`,
        `<script src="${scriptURL+(cache?'?'+Math.floor(Math.random()*(99999-10000)+10000):'')}"></script>`,
    ]

    if (cookies) array.unshift(`<script src="${'data:application/javascript;base64,'+btoa(`self.__dynamic$cookies = atob("${btoa(cookies)}");document.currentScript?.remove();`)}"></script>`);
    if (script) array.unshift(`<script src="${'data:application/javascript;base64,'+btoa(script+';document.currentScript?.remove();')}"></script>`);

    return array;*/
    
    if (self.__dynamic$config) {
        var cache = self.__dynamic$config.mode == 'development';
    } else var cache = false;

    var head: Array<Object> = [
        {nodeName: 'script', tagName: 'script', namespaceURI: 'http://www.w3.org/1999/xhtml', childNodes: [], attrs: [{name: 'src', value: scriptURL+(cache?'?'+Math.floor(Math.random()*(99999-10000)+10000):'')}]},
        {nodeName: 'script', tagName: 'script', namespaceURI: 'http://www.w3.org/1999/xhtml', childNodes: [], attrs: [{name: 'src', value: configURL+(cache?'?'+Math.floor(Math.random()*(99999-10000)+10000):'')}]},
    ];

    if (this.ctx.config.assets.files.inject) head.unshift({nodeName: 'script', tagName: 'script', namespaceURI: 'http://www.w3.org/1999/xhtml', childNodes: [], attrs: [{name: 'src', value: this.ctx.config.assets.files.inject+(cache?'?'+Math.floor(Math.random()*(99999-10000)+10000):'')}]});
    if (cookies) head.unshift({nodeName: 'script', tagName: 'script', namespaceURI: 'http://www.w3.org/1999/xhtml', childNodes: [], attrs: [{name: 'src', value: 'data:application/javascript;base64,'+btoa(`self.__dynamic$cookies = atob("${btoa(cookies)}");document.currentScript?.remove();`)}]});
    if (script) head.unshift({nodeName: 'script', tagName: 'script', namespaceURI: 'http://www.w3.org/1999/xhtml', childNodes: [], attrs: [{name: 'src', value: 'data:application/javascript;base64,'+btoa(script+';document.currentScript?.remove();')}]});

    return head;

    
    /*var array: Array<Object> = [
        new Element('script', {src: scriptURL+(cache?'?'+Math.floor(Math.random()*(99999-10000)+10000):'')}),
        new Element('script', {src: configURL+(cache?'?'+Math.floor(Math.random()*(99999-10000)+10000):'')}),
    ]

    if (cookies) array.unshift(new Element('script', {src: 'data:application/javascript;base64,'+btoa(`self.__dynamic$cookies = atob("${btoa(cookies)}");document.currentScript?.remove();`)}, []));
    if (script) array.unshift(new Element('script', {src: 'data:application/javascript;base64,'+btoa(script+';document.currentScript?.remove();')}, []));

    return array;*/
}