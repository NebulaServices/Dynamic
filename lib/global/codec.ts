import * as CryptoJS from 'crypto-js';

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

        return CryptoJS.AES.encrypt(str, 'dynamic').toString();;
    },
    decode: (str: string | undefined) => {
        if (!str) return str;

        return CryptoJS.AES.decrypt(str, 'dynamic').toString(CryptoJS.enc.Utf8);
    }
}

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