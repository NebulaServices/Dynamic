export default {
    encode(val:any, dynamic: any) {
        return val.split(', ').map((s: any) => {
            return s.split(' ').map((e: any,i: any)=>{
                if (i == 0) {
                    return dynamic.url.encode(e, dynamic.meta);
                }
    
                return e;
            }).join(' ');
        }).join(', ');
    },
    decode(val:any) {
        return ''
    },
}