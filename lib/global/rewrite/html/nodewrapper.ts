export default class Node {
    Original:any = null;
    ctx: any;

    constructor(element: Element, ctx: any) {
        this.Original = element;

        var that = this;

        this.Original.attribs = new Proxy(this.Original.attribs||{}, {
            set: (target:any, prop:any, value:any): any => {
                var a = target[prop] = value;

                that.Original.attrs = Object.keys(target).map((key:any) => {
                    return {
                        name: key,
                        value: target[key]
                    }
                });

                return a;
            },
            deleteProperty: (target:any, prop:any): any => {
                var a = delete target[prop];

                that.Original.attrs = Object.keys(target).map((key:any) => {
                    return {
                        name: key,
                        value: target[key]
                    }
                });

                return a;
            }
        });

        this.ctx = ctx;
    }

    getAttribute(attr: any) {
        if (!this.Original.attribs) return false;

        return this.Original.attribs[attr]||null;
    }

    setAttribute(attr: any, value: any) {
        if (!this.Original.attribs) return false;

        return this.Original.attribs[attr] = value;
    }

    removeAttribute(attr:any) {
        if (!this.Original.attribs) return false;

        return delete this.Original.attribs[attr];
    }

    hasAttribute(attr:any) {
        if (!this.Original.attribs) return false;

        return this.Original.attribs.hasOwnProperty(attr);
    }
}