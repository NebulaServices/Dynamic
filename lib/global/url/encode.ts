export default function encode(url: any, meta: any) {
  if (!url) return url;
  url = new String(url).toString();

  if (url.match(this.ctx.regex.WeirdRegex)) {
    var data = this.ctx.regex.WeirdRegex.exec(url);

    url = data[2];
  }

  if (url.startsWith(location.origin+this.ctx.config.prefix) || url.startsWith(this.ctx.config.prefix)) return url;
  if (url.includes('/dynamic/dynamic.')) return url;
  if (url.match(this.ctx.regex.BypassRegex)) return url;

  if (url.match(this.ctx.regex.DataRegex)) {
    var data = this.ctx.regex.DataRegex.exec(url);
    if (data) {
      var [_, type, charset, base64, content] = data;

      if (base64=='base64')
        content = this.ctx.modules.base64.decode(content);
      else
        content = decodeURIComponent(content);

      if (type) {
        if (type=='text/html') {
          content = this.ctx.rewrite.html.rewrite(content, meta, this.ctx.rewrite.html.generateHead(location.origin+'/dynamic/dynamic.client.js', location.origin+'/dynamic/dynamic.config.js', '', `window.__dynamic$url = "${meta.href}"; window.__dynamic$parentURL = "${location.href}";`));
        } else if (type=='text/css') {
          content = this.ctx.rewrite.css.rewrite(content, meta);
        } else if (type=='text/javascript'||type=='application/javascript') {
          content = this.ctx.rewrite.js.rewrite(content, meta);
        }
      }

      if (base64=='base64')
        content = this.ctx.modules.base64.encode(content);
      else
        content = encodeURIComponent(content);

      if (charset) {
        if (base64)
          url = `data:${type};${charset};${base64},${content}`;
        else
          url = `data:${type};${charset},${content}`;
      } else {
        if (base64)
          url = `data:${type};${base64},${content}`;
        else
          url = `data:${type},${content}`;
      }
    }

    return url;
  }

  url = new String(url).toString();

  if (meta.href.match(this.ctx.regex.BypassRegex)) (
    url = new URL(url, new URL(this.ctx.parent.__dynamic.meta.href)).href
  );

  return (this.ctx._location?.origin||(location.origin=='null'?location.ancestorOrigins[0]:location.origin))+this.ctx.config.prefix+new URL(url, meta.href).href;
}