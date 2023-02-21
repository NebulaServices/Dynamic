export default function decode(url: any) {
  if (!url) return url;

  url = new String(url);

  var index = url.indexOf(this.ctx.config.prefix);

  if(index == -1){
    throw new Error('bad URL');
  }

  url = url.slice(index + this.ctx.config.prefix.length)
    .replace('https://', 'https:/')
    .replace('https:/', 'https://');

  return url;
}