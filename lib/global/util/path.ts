export default function path(this: any, { url }: Request) {
  return !(url.toString().substr(location.origin.length, this.ctx.config.prefix.length).startsWith(this.ctx.config.prefix));
}