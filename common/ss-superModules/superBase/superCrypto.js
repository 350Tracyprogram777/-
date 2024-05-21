import CryptoJS from 'crypto-js'
const servers_key = "superarchives" //服务端加密的key
import appConfig from "./ss.config.js"
import md5 from "js-md5"
// 服务端缓存加密
const serverEncrypt = (message, key = servers_key) => {
	// let string=JSON.stringify(message)
	key = key.length >= 8 ? key.slice(0, 8) : key.concat('0'.repeat(8 - key.length));
	let keyHex = CryptoJS.enc.Utf8.parse(key)
	let ciphertext = CryptoJS.AES.encrypt(message, keyHex, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	}).toString()
	return ciphertext
}
// DES 解密
const serverDecrypt = (text, key = servers_key) => {
	key = key.length >= 8 ? key.slice(0, 8) : key.concat('0'.repeat(8 - key.length));
	let keyHex = CryptoJS.enc.Utf8.parse(key)
	let plaintext = CryptoJS.AES.decrypt(text, keyHex, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	}).toString(CryptoJS.enc.Utf8)
	return plaintext
}
// 手机端加密 缓存加密
const superSetStorageSync = (key, value) => {
	if (appConfig.debug) {
		uni.setStorageSync(key, value)
		return
	}
	let valueStr = ""
	valueStr = JSON.stringify(value)
	let jmData = ""
	jmData = serverEncrypt(valueStr)
	uni.setStorageSync(key, jmData)
}
const superGetStorageSync = (key) => {
	if (appConfig.debug) {
		return uni.getStorageSync(key)
	}
	let data = uni.getStorageSync(key)
	if (data) {
		if (typeof(data) == 'object') {
			return data
		}
		try {
			let message = ""
			message = serverDecrypt(data)
			if (typeof(message) == 'string') {
				return JSON.parse(message)
			}
			return JSON.parse(message)
		} catch (err) {
			return data
		}
	} else {
		return ''
	}
}
const customJM = (dic, timestamp, nonce) => {
	const keys = Object.keys(dic)
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
	let arr = []
	for (let key of keys) {
		arr.push(`${key}=${dic[key]}`)
	}
	
	const fix_str = arr.join('&') + `${timestamp}` + `${nonce}` + 'touhaowanjia2022'
	let jm_str = md5(fix_str)
	return jm_str.substr(0, 20)
}
export default {
	superGetStorageSync,
	superSetStorageSync,
	serverEncrypt,
	serverDecrypt,
	customJM
}
