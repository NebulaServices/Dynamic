export default function GenerateHead(scriptURL: any, configURL: any, cookies: any) {
    return [
        {nodeName:'script',tagName:'script',attrs:[{name:'src',value:configURL+'?'+Math.floor(Math.random()*(99999-10000)+10000)}]},
        {nodeName:'script',tagName:'script',attrs:[{name:'src',value:scriptURL+'?'+Math.floor(Math.random()*(99999-10000)+10000)}]},
    ]
}