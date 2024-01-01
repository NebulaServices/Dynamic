//@ts-ignore
import AES from '../../node_modules/crypto-js/aes.js';
//@ts-ignore
import Utf8 from '../../node_modules/crypto-js/enc-utf8.js';

var aesKey = location.origin + navigator.userAgent;

const xor = {
    encode: (str: string | undefined, key: number = 2) => {
        if (!str) return str;

        return encodeURIComponent(str.split('').map((e, i) => i % key ? String.fromCharCode(e.charCodeAt(0) ^ key) : e).join(''));
    },
    decode: (str: string | undefined, key: number = 2) => {
        if (!str) return str;

        return decodeURIComponent(str).split('').map((e, i) => i % key ? String.fromCharCode(e.charCodeAt(0) ^ key) : e).join('');
    }
}

const plain = {
    encode: (str: string | undefined) => {
        if (!str) return str;

        return encodeURIComponent(str);
    },
    decode: (str: string | undefined) => {
        if (!str) return str;

        return decodeURIComponent(str);
    }
}

const aes = {
    encode: (str: string | undefined) => {
        if (!str) return str;

        return AES.encrypt(str, aesKey).toString().substring(10);
    },
    decode: (str: string | undefined) => {
        if (!str) return str;

        return AES.decrypt('U2FsdGVkX1' + str, aesKey).toString(Utf8);
    },
};

const none = {
    encode: (str: string | undefined) => str,
    decode: (str: string | undefined) => str,
}

const base64 = {
    encode: (str: string | undefined) => {
        if (!str) return str;

        return decodeURIComponent(btoa(str));
    },
    decode: (str: string | undefined) => {
        if (!str) return str;

        return atob(str);
    }
}

export { xor, plain, none, base64, aes };
