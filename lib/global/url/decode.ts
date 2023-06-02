export default function decode(this: any, url: any) {
  if (!url) return url;

  url = new String(url).toString();

  if (url.match(this.ctx.regex.BypassRegex)) return url;

  var index = url.indexOf(this.ctx.config.prefix);

  if(index == -1)
    return url;

  url = this.ctx.encoding.decode(url.slice(index + this.ctx.config.prefix.length)
    .replace('https://', 'https:/')
    .replace('https:/', 'https://'));

  return url;
}