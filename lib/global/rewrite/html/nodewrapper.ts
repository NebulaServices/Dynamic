import { TAG_ID } from "parse5/dist/common/html";
import { Element } from "parse5/dist/tree-adapters/default";

export default class Node {
    Original:any = null;
    ctx: any;

    constructor(element: Element, ctx: any) {
        this.Original = element;

        this.ctx = ctx;
    }

    getAttribute(attr: any) {
        return (this.Original.attrs.find((e:any)=>e.name==attr)||{value:null}).value;
    }

    setAttribute(attr: any, value: any) {
        return this.Original.attrs.find((e:any)=>e.name==attr)?(this.Original.attrs.find((e:any)=>e.name==attr)||{value:null}).value = value:this.Original.attrs.push({name:attr,value:value});
    }

    removeAttribute(attr:any) {
        return this.Original.attrs.splice((this.Original.attrs.findIndex((e:any)=>e.name==attr)||-1), 1);
    }
}