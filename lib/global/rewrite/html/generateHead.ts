declare const self: any;

import { Element, Text } from "domhandler";

export default function GenerateHead(scriptURL: any, configURL: any, cookies: any, script: any = '') {
    if (self.__dynamic$config) {
        var cache = self.__dynamic$config.mode == 'development';
    } else var cache = false;

    var array: Array<Object> = [
        new Element('script', {src: scriptURL+(cache?'?'+Math.floor(Math.random()*(99999-10000)+10000):'')}),
        new Element('script', {src: configURL+(cache?'?'+Math.floor(Math.random()*(99999-10000)+10000):'')}),
    ]

    if (cookies) array.unshift(new Element('script', {src: 'data:application/javascript;base64,'+btoa(`self.__dynamic$cookies = atob("${btoa(cookies)}");document.currentScript?.remove();`)}, []));
    if (script) array.unshift(new Element('script', {src: 'data:application/javascript;base64,'+btoa(script+';document.currentScript?.remove();')}, []));

    return array;
}