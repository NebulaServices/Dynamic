import Srcset from './srcset';
import Node from './nodewrapper';
import MetaURL from '../../meta/type';
import generateHead from './generateHead';

export default class html {

  ctx;

  parse5;
  iterator;

  generateHead = generateHead;

  config = [
      {
        "elements": "all",
        "tags": ['style'],
        "action": "css"
      },
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
        "action": "http-equiv",
      },
      {
        "elements": ['IFRAME'],
        "tags": ['srcdoc'],
        "action": "html",
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
          if (ProxyNode.getAttribute('type') && ProxyNode.getAttribute('type')!=='application/javascript' && ProxyNode.getAttribute('type')!=='text/javascript') return e;
          e.value = that.ctx.rewrite.js.rewrite(e.value, {type: 'script'}, false, that.ctx);
        })
      }
      if (node.tagName=='style'||node.tagName=='STYLE') {
        node.childNodes.forEach((e:any)=>{
          if (e.nodeName!=='#text') return e;
          e.value = that.ctx.rewrite.css.rewrite(e.value, meta)
        })
      }

      that.config.forEach((config:any)=>{
        if ((Array.isArray(config.elements) && config.elements.indexOf(node.nodeName.toUpperCase())!==-1) || config.elements == 'all') {
          config.tags.forEach((tag:any) => {
            if (ProxyNode.getAttribute(tag)) {
              switch(config.action) {
                case "url":
                  ProxyNode.setAttribute(`data-dynamic_${tag}`, ProxyNode.getAttribute(tag));
                  ProxyNode.setAttribute(tag, that.ctx.url.encode(ProxyNode.getAttribute(tag), meta));
                  break;
                case "rewrite":
                  ProxyNode.setAttribute(config.new, ProxyNode.getAttribute(tag));
                  ProxyNode.removeAttribute(tag);
                  break;
                case "delete":
                  ProxyNode.removeAttribute(tag);
                  break;
                case "html":
                  ProxyNode.setAttribute(`data-dynamic_${tag}`, ProxyNode.getAttribute(tag));
                  ProxyNode.removeAttribute(tag);

                  const blob = new Blob([that.ctx.rewrite.html.rewrite(ProxyNode.getAttribute(tag), meta)], {type: 'text/html'});

                  ProxyNode.setAttribute('src', URL.createObjectURL(blob));
                  break;
                case "srcset":
                  ProxyNode.setAttribute(`data-dynamic_${tag}`, ProxyNode.getAttribute(tag));
                  ProxyNode.setAttribute(tag, Srcset.encode(ProxyNode.getAttribute(tag), that.ctx));
                  break;
                case "css":
                  ProxyNode.setAttribute(`data-dynamic_${tag}`, ProxyNode.getAttribute(tag));
                  ProxyNode.setAttribute(tag, that.ctx.rewrite.css.rewrite(ProxyNode.getAttribute(tag), meta));
                  break;
                case "http-equiv":
                  const content = ProxyNode.getAttribute('content');
                  const name = ProxyNode.getAttribute('http-equiv');

                  switch(name.toLowerCase()) {
                    case "refresh":
                      var time = content.split(';url=')[0], value = content.split(';url=')[1];

                      ProxyNode.setAttribute('content', `${time};url=${that.ctx.url.encode(value, meta)}`);
                      break;
                    case "content-security-policy":
                      ProxyNode.removeAttribute('content');
                      ProxyNode.removeAttribute('http-equiv');
                      break;
                    default:
                      break;
                  }
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
      var HTML = ast.childNodes.find((e:any)=>e.nodeName=='html');
      var Head = HTML.childNodes.find((e:any)=>e.nodeName=='head');

      Head.childNodes.splice(0,0, head[1]);
      Head.childNodes.splice(0,0, head[0]);
      if (head[2]) Head.childNodes.splice(0,0, head[2]);
      if (head[3]) Head.childNodes.splice(0,0, head[3]);
    }

    src = this.parse5.serialize(ast, {scriptingEnabled: true});

    return src;
  }
}