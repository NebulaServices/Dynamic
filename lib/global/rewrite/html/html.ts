import Srcset from './srcset';
import Node from './nodewrapper';
import MetaURL from '../../meta/type';
import generateHead from './generateHead';
import { Element } from 'parse5/dist/tree-adapters/default';

export default class html {

  ctx;

  parse5;
  iterator;

  generateHead = generateHead;

  config = [
      {
          "elements": ['SCRIPT', 'IFRAME', 'EMBED', 'INPUT', 'TRACK', 'MEDIA', 'SOURCE', 'IMG'],
          "tags": ['src'],
          "action": "url"
      },
      {
          "elements": ['SOURCE', 'IMG'],
          "tags": ['srcset'],
          "action": "srcset"
      },
      {
          "elements": ['A', 'LINK', 'AREA'],
          "tags": ['href'],
          "action": "url"
      },
      {
          "elements": ['FORM'],
          "tags": ['action'],
          "action": "url"
      }, 
      {
          "elements": ['OBJECT'],
          "tags": ['data'],
          "action": "url",
      },
      {
        "elements": ['SCRIPT', 'LINK'],
        "tags": ['integrity'],
        "action": "rewrite",
        "new": "nointegrity",
      },
      {
        "elements": ['SCRIPT', 'LINK'],
        "tags": ['nonce'],
        "action": "rewrite",
        "new": "nononce",
      },
      {
        "elements": ['META'],
        "tags": ['http-equiv'],
        "action": "delete",
      }
  ];

  constructor(ctx:any) {
    this.ctx = ctx.ctx;

    this.parse5 = this.ctx.modules.parse5;
    this.iterator = this.ctx.modules.walkParse5
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

  rewrite(src:any, meta:MetaURL, head: any) {
    const that = this;

    if (Array.isArray(src)) src = src[0];

    src = src.toString();

    var ast = this.parse5.parse(src);

    this.iterator(ast, function(node: Element) {
      var ProxyNode = new Node(node, that);

      if ((node.tagName=='script'||node.tagName=='SCRIPT')&&(!ProxyNode.getAttribute('src'))&&(ProxyNode.getAttribute('type')!=='application/json')) {
        node.childNodes.forEach((e:any)=>{
          if (e.nodeName!=='#text') return e;
          e.value = that.ctx.rewrite.js.rewrite(e.value, meta);
        })
      }
      if (node.tagName=='style'||node.tagName=='STYLE') {
        node.childNodes.forEach((e:any)=>{
          if (e.nodeName!=='#text') return e;
          e.value = that.ctx.rewrite.css.rewrite(e.value, meta)
        })
      }
      
      that.config.forEach((config:any)=>{
        if (config.elements.indexOf(node.nodeName.toUpperCase())!==-1) {
          config.tags.forEach((tag:any) => {
            if (ProxyNode.getAttribute(tag)) {
              switch(config.action) {
                case "url":
                  ProxyNode.setAttribute(`data-dynamic_${tag}`, ProxyNode.getAttribute(tag));
                  ProxyNode.setAttribute(tag, that.ctx.url.encode(ProxyNode.getAttribute(tag), that.ctx.meta));
                  break;
                case "rewrite":
                  ProxyNode.setAttribute(config.new, ProxyNode.getAttribute(tag));
                  ProxyNode.removeAttribute(tag);
                case "delete":
                  ProxyNode.removeAttribute(tag);
                  break;
                default:
                  break;
              }
            }
          })
        }
      })
    })

    if (head) {
      ast.childNodes[1].childNodes[0].childNodes.splice(0,0, head[1]);
      ast.childNodes[1].childNodes[0].childNodes.splice(0,0, head[0]);
    }

    src = this.parse5.serialize(ast);

    return src;
  }
}