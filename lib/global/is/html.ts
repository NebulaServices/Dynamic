import MetaURL from "../meta/type";

export default function html(this: any, url: MetaURL, contentType: String = '', html: String = '') {
    if (!contentType && this.ctx.modules.mime.contentType(url.pathname) == url.pathname) return !!html.trim().match(/<(html|script|body|head|link|div)[^>]*>/g);
    return (this.ctx.modules.mime.contentType((contentType || url.pathname)) || 'text/html').split(';')[0] === 'text/html'||html.trim().match(/\<\!(doctype|DOCTYPE) html\>/g);
};