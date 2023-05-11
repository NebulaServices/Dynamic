export default function loadMeta(this: any, url: URL) {
  var that = this;

  url = this.ctx.modules.url.parse(url.href);
  
  Object.entries(url).map(([name, value]) => {
    that.ctx.meta[name] = value||'';
  });

  return true;
}