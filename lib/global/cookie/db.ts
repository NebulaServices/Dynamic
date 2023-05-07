import * as idb from 'idb';
import * as cookie from 'cookie';

function createObject(input: any, newobj: any) {
    if (!input) input = [];

    if (input.find((e:any)=>e.name==newobj.name)) input[input.findIndex((e:any)=>e.name==newobj.name)] = { name: newobj.name, value: newobj.value }
    else input.push({ name: newobj.name, value: newobj.value });

    return input;
}

export const DB = {
    open: async () => {
        return idb.openDB('__dynamic$cookies', 1, {
            async upgrade(db) {
                await db.createObjectStore('__dynamic$cookies');
            }
        });
    },
    set: async (host: any, raw: any, db: any) => {
        if (raw.domain) host = raw.domain;

        if (host.startsWith('.')) host = host.slice(1);
        
        await (await db).put('__dynamic$cookies', createObject((await (await db).get('__dynamic$cookies', host)), raw), host);
        
        return true;
    },
    get: async (host: any, db: any) => {
        var baseHost = host.replace(/^(.*\.)?([^.]*\..*)$/g, "$2");

        var first = await (await db).get('__dynamic$cookies', host) || [];

        if (host !== baseHost && host !== '.' + baseHost) {
            var cookies = await (await db).get('__dynamic$cookies', baseHost);

            if (cookies) {
                for (var {name, value} of cookies) {
                    if (!first.find((e:any)=>e.name==name && e.value==value)) first.push({ name, value });
                }
            }
        }

        return first;
    }
}