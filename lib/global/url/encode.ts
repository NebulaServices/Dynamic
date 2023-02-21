export default function encode(url: any, meta: any) {
  if (!url) return url;
  url = new String(url);
  if (url.indexOf(this.ctx.config.prefix)!==-1) return url;
  if (url.includes('/dynamic/dynamic.')) return url;
  if (url.match(/^(#|about:|data:|mailto:)/g)) return url;

  url = new String(url).toString()

  return location.origin+this.ctx.config.prefix+new URL(url, meta.href).href;
}