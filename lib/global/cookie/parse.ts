export const parse = (str: any) =>
    str?str.split(';').map((v: any) => v.split('=')).reduce((acc: any, v: any) => {acc[(v[0].trim())] = (v[1].trim());return acc;}, {}):{};
export const serialize = (obj: any = []) =>
    obj.map((k: any) => `${k.name}=${(k.value)}`).join('; ');