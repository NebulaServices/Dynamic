import Srcset from './srcset';
import Node from './nodewrapper';
import MetaURL from '../../meta/type';
import generateHead from './generateHead';

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
          "elements": ['script', 'iframe', 'embed', 'input', 'track', 'media', 'source', 'img'],
          "tags": ['src'],
          "action": "url"
      },
      {
          "elements": ['source', 'img'],
          "tags": ['srcset'],
          "action": "srcset"
      },
      {
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
      },
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
      for (var i = 0; i<dom.length; i++) {
        cb(dom[i], dom[i].parent);
    
        if (dom[i].children) if (dom[i].children.length) {
          it(dom[i].children);
        };
      }
    }
  
    it(_dom);
  }

  rewrite(src:any, meta:MetaURL, head: any) {
    const that = this;

    if (Array.isArray(src)) src = src[0];

    src = src.toString();

    var parser = new this.ctx.modules.htmlparser2.Parser(new this.ctx.modules.domhandler.DomHandler(function (error:any, dom:any) {
        if (dom) {
            let base = meta.href;

            that.iterate(dom, function(node: any) {
                if (node.name == 'base') {
                    base = new URL(node.attribs.href, new URL(meta.href)).href;

                    console.log(base);

                    node.attribs.href = that.ctx.url.encode(node.attribs.href, meta);
                }
            });

            base = new URL(base);

            that.iterate(dom, function(node: any) {
                var _node = new Node(node, that.ctx);

                if (node.name == 'script'&&(!_node.getAttribute('src'))&&(_node.getAttribute('type')!=='application/json')) {
                    node.childNodes.forEach((e:any)=>{
                        if (e.type!=='text') return e;
                        if (_node.getAttribute('type') && _node.getAttribute('type')!=='application/javascript' && _node.getAttribute('type')!=='text/javascript') return e;

                        e.data = that.ctx.rewrite.js.rewrite(e.data, {type: 'script'}, false, that.ctx);
                    });
                }

                if (node.name == 'style') {
                    node.childNodes.forEach((e:any)=>{
                        if (e.type!=='text') return e;

                        e.data = that.ctx.rewrite.css.rewrite(e.data, base)
                    });
                }

                for (var config of that.config) {
                    //console.log(config.elements, config.tags, config.action, node.name)
                    if (config.elements === 'all' || config.elements.indexOf(node.name)>-1) {
                        for (var tag of config.tags) {
                            if (!_node.hasAttribute(tag)) continue;
                            if (config.action === 'url') {
                                _node.setAttribute(`data-dynamic_${tag}`, _node.getAttribute(tag));
                                _node.setAttribute(tag, that.ctx.url.encode(_node.getAttribute(tag), base));
                            } else if (config.action === 'srcset') {
                                _node.setAttribute(`data-dynamic_${tag}`, _node.getAttribute(tag));
                                _node.setAttribute(tag, Srcset.encode(_node.getAttribute(tag), that.ctx));
                            } else if (config.action === 'rewrite') {
                                _node.setAttribute(config.new, _node.getAttribute(tag));
                                _node.removeAttribute(tag);
                            } else if (config.action === 'html') {
                                _node.setAttribute(`data-dynamic_${tag}`, _node.getAttribute(tag));
                                _node.removeAttribute(tag);
              
                                const blob = new Blob([that.ctx.rewrite.html.rewrite(_node.getAttribute(tag), base)], {type: 'text/html'});
                                _node.setAttribute('src', URL.createObjectURL(blob));
                            } else if (config.action === 'http-equiv') {
                                const content = _node.getAttribute('content');
                                const name = _node.getAttribute('http-equiv');
              
                                switch(name.toLowerCase()) {
                                  case "refresh":
                                    var time = content.split(';url=')[0], value = content.split(';url=')[1];
              
                                    _node.setAttribute('content', `${time};url=${that.ctx.url.encode(value, base)}`);
                                    break;
                                  case "content-security-policy":
                                    _node.removeAttribute('content');
                                    _node.removeAttribute('http-equiv');
                                    break;
                                  default:
                                    break;
                                }
                            } else if (config.action === 'css') {
                                _node.setAttribute(`data-dynamic_${tag}`, _node.getAttribute(tag));
                                _node.setAttribute(tag, that.ctx.rewrite.css.rewrite(_node.getAttribute(tag), base));
                            } else if (config.action === 'delete') {
                                _node.removeAttribute(tag);
                            }
                        }
                    }
                };
            });

            if (head && dom.length && head.length) {
                if (dom.length > 0 && !dom.find((e: any) => e.name == 'html')) for (var i = 0; i < head.length; i++)
                    dom.unshift(head[i]);
                else if (dom.find((e: any) => e.name == 'html')) for (var i = 0; i < head.length; i++)
                    dom[dom.findIndex((e: any) => e.name == 'html')].children.unshift(head[i]);
            }

            src = that.ctx.modules.domserializer.render(dom);
        }
    }));

    parser.write(src);
    parser.end();

    return src;
  }
}