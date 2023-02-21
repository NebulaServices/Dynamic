import css from "./is/css";
import html from "./is/html";
import js from "./is/js";

class DynamicTypeFunctions {
  html = html;
  js = js;
  css = css;

  ctx;
  
  constructor(ctx: any) {
    this.ctx = ctx;
  }
}

export default DynamicTypeFunctions;