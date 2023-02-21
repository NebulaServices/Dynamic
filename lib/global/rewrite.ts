import html from './rewrite/html/html';
import css from './rewrite/css';
import js from './rewrite/js/js';

class DynamicRewrites {

  html;
  js;
  css;

  ctx;

  constructor(ctx: any) {
    this.ctx = ctx;
    this.html = new html(this);
    this.js = new js(this);
    this.css = new css(this);
  }
}

export default DynamicRewrites;