export default function style(self: any) {
    self.CSSStyleDeclaration.prototype._setProperty = self.CSSStyleDeclaration.prototype.setProperty;

    self.CSSStyleDeclaration.prototype.setProperty = new Proxy(self.CSSStyleDeclaration.prototype.setProperty, {
        apply(t, g, a) {
            if (a[0]=='background-image'||a[0]=='background') a[1] = self.__dynamic.rewrite.css.rewrite(a[1], self.__dynamic.meta);

            return Reflect.apply(t, g, a);
        }
    });

    self.__dynamic.define(self.CSSStyleDeclaration.prototype, 'background', {
        get() {
            if (this._background) return this._background;

            return this.getPropertyValue('background');
        },
        set(val: any) {
            this._background = val;

            return this._setProperty('background', self.__dynamic.rewrite.css.rewrite(val, self.__dynamic.meta));
        }
    });

    self.__dynamic.define(self.CSSStyleDeclaration.prototype, 'backgroundImage', {
        get() {
            if (this._backgroundImage) return this._backgroundImage;

            return this.getPropertyValue('background-image');
        },
        set(val: any) {
            this._backgroundImage = val;

            return this._setProperty('background-image', self.__dynamic.rewrite.css.rewrite(val, self.__dynamic.meta));
        }
    });
}