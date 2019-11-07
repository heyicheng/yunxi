import JSEncrypt from '@/utils/jsencrypt.js'
import { from } from 'array-flatten';
const sha1 = require('js-sha1')
const CryptoJS = require('crypto-js')

const publickey = process.env.VUE_APP_PUBLICKEY
const privateKey = process.env.VUE_APP_PRIVATEKEY
const addtional_key = process.env.VUE_APP_ADDTIONALKEY

function aes_encrypt(data, key) {
    let encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64)
}

function aes_decrypt(data, key) {
    let decryptsrc = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Base64.parse(data) }, CryptoJS.enc.Utf8.parse(key), { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return decryptsrc.toString(CryptoJS.enc.Utf8);
}

function rsa_encrypt(data) {
    var encryptor = new JSEncrypt();
    encryptor.setPublicKey(publickey)
    var cipherText = encryptor.encrypt(data, { paddingmode: 0 });
    return cipherText
}

function rsa_decrypt(data) {
    var encryptor = new JSEncrypt();
    encryptor.setPrivateKey(privateKey)
    let plainText = encryptor.decrypt(data, { paddingmode: 0 })
    return plainText
}

function rsa_sign(data) {
    var encryptor = new JSEncrypt();
    encryptor.setPrivateKey(privateKey)
    return encryptor.sign(data, rsa_sha1, 'sha1')
}

function rsa_verify(data, signdata) {
    var encryptor = new JSEncrypt();
    encryptor.setPublicKey(publickey)
    return encryptor.verify(data, signdata, rsa_sha1)
}

function rsa_sha1(data) {
    var hash = sha1.create()
    hash.update(data)
    return hash.hex()
}

function aes_random_key() {
    var key = ''
    for (var i = 0; i < 32; i++) {
        key += String.fromCharCode(i + 33);
    }
    return key;
}

function normal_md5_sign(data) {
    var signMD5 = CryptoJS.MD5(data + addtional_key).toString()
    var seed1 = 0x7FED7FED >>> 0;
    var seed2 = 0xEEEEEEEE >>> 0;
    var crypto_num = 0x24d85e23 >>> 0;
    for (var i = 0; i < signMD5.length; i++) {
        var current = signMD5.charCodeAt(i) + 32
        seed1 = crypto_num ^ (seed1 + seed2) * current
        seed2 = current + seed1 + seed2 + (seed2 << 5) + 3
    }
    var sign = '00000000' + (seed1 >>> 0).toString(16)
    return sign.slice(-8, sign.length)
}

export default { aes_encrypt, aes_decrypt, rsa_encrypt, rsa_decrypt, rsa_sign, rsa_verify, aes_random_key, normal_md5_sign }
