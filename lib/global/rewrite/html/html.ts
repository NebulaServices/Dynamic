import Srcset from './srcset';
import Node from './nodewrapper';
import MetaURL from '../../meta/type';
import generateHead from './generateHead';
import { Element } from 'parse5/dist/tree-adapters/default';

export default class html {

  ctx;

  generateHead = generateHead;

  config = [
      {
        "elements": "all",
        "tags": ['style'],
        "action": "css"
      },
      {
          "elements": ['script', 'iframe', 'embed', 'input', 'track', 'media', 'source', 'img', 'a', 'link', 'area', 'form', 'object'],
          "tags": ['src', 'href', 'action', 'data'],
          "action": "url"
      },
      {
          "elements": ['source', 'img'],
          "tags": ['srcset'],
          "action": "srcset"
      },
      /*{
          "elements": ['a', 'link', 'area'],
          "tags": ['href'],
          "action": "url"
      },
      {
          "elements": ['form'],
          "tags": ['action'],
          "action": "url"
      }, 
      {
          "elements": ['object'],
          "tags": ['data'],
          "action": "url",
      },*/
      {
        "elements": ['script', 'link'],
        "tags": ['integrity'],
        "action": "rewrite",
        "new": "nointegrity",
      },
      {
        "elements": ['script', 'link'],
        "tags": ['nonce'],
        "action": "rewrite",
        "new": "nononce",
      },
      {
        "elements": ['meta'],
        "tags": ['http-equiv'],
        "action": "http-equiv",
      },
      {
        "elements": ['iframe'],
        "tags": ['srcdoc'],
        "action": "html",
      },
      {
        "elements": ['link'],
        "tags": ["imagesrcset"],
        "action": "srcset",
      },
      {
        "elements": 'all',
        "tags": ['onclick'],
        "action": "js",
      }
  ];

  constructor(ctx:any) {
    this.ctx = ctx.ctx;
  }

  generateRedirect(url:any) {
    return `
<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>301 Moved</TITLE></HEAD><BODY>
<H1>301 Moved</H1>
The document has moved
<A HREF="${url}">here</A>.
</BODY></HTML>
    `
  }

  iterate(_dom: any, cb: any) {
    function it(dom: any = _dom) {
      for (var i = 0; i<dom.childNodes.length; i++) {
        cb(dom.childNodes[i]);
    
        if (dom.childNodes[i].childNodes) if (dom.childNodes[i].childNodes.length) {
          it(dom.childNodes[i]);
        };
      }
    }
  
    it(_dom);
  }

  rewrite(src:any, meta:MetaURL, head: any = []) {
    const that = this;

    if (Array.isArray(src)) src = src[0];
    
    if (!src) return src;

    src = src.toString();

    if (!src.match(/<(html|script|style)[^>]*>/g) && src.match(/<\!DOCTYPE[^>]*>/gi)) return src;

    return src = src.replace(/(<!DOCTYPE html>|<html(.*?)>)/i, `$1${head.join(``)}\n`);
  }
}