export default class Node {
    Original:any = null;
    ctx: any;

    constructor(element: Element, ctx: any) {
        this.Original = element;

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