declare const self: any;

export default function loadMeta(this: any, url: URL | any) {
  url = new URL(url.href);

  if (self.__dynamic.baseURL) return false;

  for (var prop in url) {
    this.ctx.meta[prop] = url[prop];
  }

  return true;
}