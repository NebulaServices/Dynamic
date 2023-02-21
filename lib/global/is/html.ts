import MetaURL from "../meta/type";

export default function html(url: MetaURL, contentType: String = '', html: String = '') {
    return (this.ctx.modules.mime.contentType((contentType || url.pathname)) || 'text/html').split(';')[0] === 'text/html'||html.trim().match(/\<\!(doctype|DOCTYPE) html\>/g);
};