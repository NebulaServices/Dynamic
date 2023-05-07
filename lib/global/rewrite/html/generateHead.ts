export default function GenerateHead(scriptURL: any, configURL: any, cookies: any, script: any = '') {
    var array: Array<Object> = [
        {nodeName:'script',tagName:'script',attrs:[{name:'src',value:configURL+'?'+Math.floor(Math.random()*(99999-10000)+10000)}]},
        {nodeName:'script',tagName:'script',attrs:[{name:'src',value:scriptURL+'?'+Math.floor(Math.random()*(99999-10000)+10000)}]},
    ]

    if (cookies) array.push({nodeName:'script',tagName:'script',attrs:[],childNodes:[{nodeName:'#text',value:`self.__dynamic$cookie = atob("`+btoa(cookies)+'");document.currentScript?.remove();'}]});
    if (script) array.push({nodeName:'script',tagName:'script',attrs:[],childNodes:[{nodeName:'#text',value:script+';document.currentScript?.remove();'}]});

    return array;
}