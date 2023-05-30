export default {
    encode(val:any, dynamic: any) {
        if (!val) return val;
        if (!(val.toString())) return val;

        return val.split(', ').map((s: any) => {
            return s.split(' ').map((e: any,i: any)=>{
                if (i == 0) {
                    return dynamic.url.encode(e, dynamic.baseURL || dynamic.meta);
                }
    
                return e;
            }).join(' ');
        }).join(', ');
    },
    decode(val:any) {
        if (!val) return val;

        return val;
    },
}