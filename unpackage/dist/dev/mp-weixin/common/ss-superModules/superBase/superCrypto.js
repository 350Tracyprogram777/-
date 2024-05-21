"use strict";
const common_vendor = require("../../vendor.js");
const servers_key = "superarchives";
const serverEncrypt = (message, key = servers_key) => {
  key = key.length >= 8 ? key.slice(0, 8) : key.concat("0".repeat(8 - key.length));
  let keyHex = common_vendor.CryptoJS.enc.Utf8.parse(key);
  let ciphertext = common_vendor.CryptoJS.AES.encrypt(message, keyHex, {
    mode: common_vendor.CryptoJS.mode.ECB,
    padding: common_vendor.CryptoJS.pad.Pkcs7
  }).toString();
  return ciphertext;
};
const serverDecrypt = (text, key = servers_key) => {
  key = key.length >= 8 ? key.slice(0, 8) : key.concat("0".repeat(8 - key.length));
  let keyHex = common_vendor.CryptoJS.enc.Utf8.parse(key);
  let plaintext = common_vendor.CryptoJS.AES.decrypt(text, keyHex, {
    mode: common_vendor.CryptoJS.mode.ECB,
    padding: common_vendor.CryptoJS.pad.Pkcs7
  }).toString(common_vendor.CryptoJS.enc.Utf8);
  return plaintext;
};
const superSetStorageSync = (key, value) => {
  {
    common_vendor.index.setStorageSync(key, value);
    return;
  }
};
const superGetStorageSync = (key) => {
  {
    return common_vendor.index.getStorageSync(key);
  }
};
const customJM = (dic, timestamp, nonce) => {
  const keys = Object.keys(dic);
  keys.sort(function(s1, s2) {
    const x1 = s1.toUpperCase();
    const x2 = s2.toUpperCase();
    if (x1 < x2) {
      return -1;
    }
    if (x1 > x2) {
      return 1;
    }
    return 0;
  });
  let arr = [];
  for (let key of keys) {
    arr.push(`${key}=${dic[key]}`);
  }
  const fix_str = arr.join("&") + `${timestamp}${nonce}touhaowanjia2022`;
  let jm_str = common_vendor.md5(fix_str);
  return jm_str.substr(0, 20);
};
const superCrypto = {
  superGetStorageSync,
  superSetStorageSync,
  serverEncrypt,
  serverDecrypt,
  customJM
};
exports.superCrypto = superCrypto;
