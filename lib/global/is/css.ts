import MetaURL from "../meta/type";

export default function css(this: any, url:MetaURL, contentType:string = '') {
    return (this.ctx.modules.mime.contentType((contentType || url.pathname)) || 'text/css').split(';')[0] === 'text/css';
}