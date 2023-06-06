import html from './rewrite/html/html';
import css from './rewrite/css';
import js from './rewrite/js/js';
import man from './rewrite/manifest';
import srcset from './rewrite/html/srcset';

class DynamicRewrites {

  html;
  srcset;
  js;
  css;
  man;
  ctx;

  constructor(ctx: any) {
    this.ctx = ctx;
    this.html = new html(this);
    this.srcset = srcset;
    this.js = new js(this);
    this.css = new css(this);
    this.man = new man(this);
  }
}

export default DynamicRewrites;