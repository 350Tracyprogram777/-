import superCrypto from "./superCrypto.js"
import appConfig from "./ss.config.js"
import supertools from "./supertools.js"
import superCache from "./superCache.js"
import md5 from "js-md5"
let currDomain = appConfig.isdev ? appConfig.domain_dev : appConfig.domain_pro
const openCache = true
let isSetProxy = false
const systemDic = uni.getSystemInfoSync()
//url 参数 post/get 
const superTS = (msg) => {
	uni.showToast({
		title: msg,
		icon: 'none',
		duration: 2000,
		mask: true
	})
}
const hub = {
	open: (msg) => {
		uni.showLoading({
			title: msg,
			mask: true
		});
	},
	close: () => uni.hideLoading()
}
class superdata {
	constructor() {
		this.openCache = openCache
		this.cloudPathPrefix = `${appConfig.appName}/`
		this.filterArr = []
	}
	watchPush({
		success
	}) {
		// 监听推送
		// #ifdef APP-PLUS
		//监听系统通知栏消息点击事件
		let self = this;
		plus.push.addEventListener('click', function(msg) {
			// uni.navigateTo({
			// 	url:"/pages/videochat/startVideoChat/openWebVideoChat"
			// })
			//console.log('点击后的反应', msg);
			//console.log('电话');
			//处理点击消息的业务逻辑代码
		}, false);
		//监听接收透传消息事件
		plus.push.addEventListener('receive', function(msg) {
			//处理透传消息的业务逻辑代码
			let self = this;
			success(msg)
		}, false);
		// #endif
	}
	// 单例方法
	static getInstace() {
		if (!this.instance) {
			this.instance = new superdata()
		}
		return this.instance
	}
	// 所有请求 中间件
	middleCheck(otherDic, url = "", parameter = {}) {
		// #ifdef APP-PLUS
		isSetProxy = plus.networkinfo.isSetProxy();
		if (isSetProxy) {
			//console.log('请求参数')
		}
		// #endif
		// 线上线下切换
		currDomain = appConfig.isdev ? appConfig.base_url_dev : appConfig.base_url_pro
		// console.log('appConfig',currDomain)
		let defaultDic = {
			hubtitle: "",
			allBack: false,
			errToast: true,
			domain: '',
			header: {},
			method: 'POST',
			cloudFun: '',
			cache: true,
			cacheTime: ''
		}
		Object.assign(defaultDic, otherDic)
		if (defaultDic.hubtitle != ' ') {
			hub.open(defaultDic.hubtitle || '')
		}
		defaultDic.domain = defaultDic.domain ? defaultDic.domain : currDomain
		defaultDic.method = defaultDic.method ? defaultDic.method : 'POST'
		// console.log(defaultDic)
		const timestamp = new Date().getTime()
		const nonce = supertools.rand32order()
		const sign = superCrypto.customJM(parameter, timestamp, nonce)
		// console.log('---',sign)
		let headerDic = {
			'content-type': 'application/x-www-form-urlencoded',
			'account': supertools.get_userinfo() ? supertools.get_userinfo()._id : '',
			'token': supertools.get_token() ? supertools.get_token() : '',
			'signature': md5(url + 'twgdw666'),
			// 'sign': md5(url + 'twgdw666'),
			'timestamp': timestamp,
			'nonce': nonce,
			'sign': sign,
			'version': systemDic.uniPlatform == 'app' ? systemDic.appWgtVersion : systemDic.appVersion,
			"deviceId": systemDic.deviceId,
			"test": appConfig.debug
		}
		Object.assign(headerDic, defaultDic.header)
		defaultDic.header = headerDic
		return defaultDic
	}
	getCacheTime(url, parameter = {}) {
		let cacheKeyStr = JSON.stringify(parameter) + url
		let cacheKey = md5(cacheKeyStr)
		return superCache.getCacheTime(cacheKey)
	}
	// http 请求
	superRequest(url, parameter = {}, otherDic = {}) {
		let defaultDic = this.middleCheck(otherDic, url, parameter)
		let self = this
		// console.log('加密',parameter)
		let cacheKeyStr = JSON.stringify(parameter) + url
		let cacheKey = md5(cacheKeyStr)
		return new Promise(function(resolve, reject) {
			if (openCache && defaultDic.cache) {
				let cacheData = superCache.get(cacheKey)
				if (cacheData) {
					appConfig.ssprint(cacheData)
					uni.stopPullDownRefresh()
					resolve(cacheData)
					return
				}
			}
			if (appConfig.debug) {
				// #ifndef APP-PLUS
				console.group('请求接口---', url)
				console.table(parameter)
				console.groupEnd()
				// #endif
			}
			// console.log('请求接口---', url)
			uni.request({
				url: defaultDic.domain + url,
				data: parameter,
				header: defaultDic.header,
				method: defaultDic.method,
				dataType: 'json',
				responseType: 'text',
				success: function(res) {
					if (appConfig.debug) {
						// #ifndef APP-PLUS
						console.group('接口返回---', res.data.code, url)
						console.table(res.data.data)
						console.groupEnd()
						// #endif
					}
					if (res.data.code == 1) {
						if (openCache && defaultDic.cache && superCache.isCacheOfApi(url)) {
							let api_cache_config = superCache.getCustomCacheOfApi(url)
							const cacheTime = defaultDic.cacheTime || api_cache_config.time
							superCache.set(cacheKey, res.data.data, cacheTime)
						}
						if (defaultDic.allBack) {
							resolve(res.data)
						} else {
							resolve(res.data.data)
						}
					} else {
						if (defaultDic.allBack) {
							resolve(res.data)
							return
						}
						if (res.data.code == 300) {
							
							// console.log('顶顶顶顶',res.data.code)
							// return
							
							window.location.href = appConfig.webpath
							return
						}
						if (res.data.code == 99 && defaultDic.header.token) {
							uni.showModal({
								title: "请返回重新登录",
								showCancel: false,
								success: function() {
									supertools.clear_autoLogin()
									uni.clearStorageSync()
									uni.reLaunch({
										url: "/pages/login/login"
									})
								}
							})
							return
						}
						if (res.data.msg && defaultDic.errToast) {
							superTS(res.data.msg)
						}
						reject(res.data)
					}
				},
				complete() {
					// if (otherDic.hubtitle != ' ') {
					// 	hub.close()
					// }
					hub.close()
					uni.stopPullDownRefresh()
				}
			})
		})
	}
	// 上传图片
	superImgRequest(url, parameter = {}, filePath, otherDic = {}) {
		let defaultDic = this.middleCheck(otherDic, url, parameter)
		delete(defaultDic.header['content-type'])
		return new Promise(function(resolve, reject) {
			uni.uploadFile({
				url: defaultDic.domain + url, //仅为示例，非真实的接口地址
				filePath: filePath,
				header: defaultDic.header,
				name: 'file',
				formData: parameter,
				success: (uploadFileRes) => {
					let dic = JSON.parse(uploadFileRes.data)
					hub.close()
					uni.stopPullDownRefresh()
					resolve(dic.data)
				}
			});
		})
	}
	// 云函数请求
	superCloudRequest(action, parameter = {}, otherDic = {}) {
		let defaultDic = this.middleCheck(otherDic, url)
		let jmData = superCrypto.serverEncrypt(parameter)
		let cloudFunStr = defaultDic.cloudFun || 'client'
		let apiUrl = cloudFunStr + '/' + action
		let cacheKeyStr = apiUrl + JSON.stringify(parameter)
		let cacheKey = md5(cacheKeyStr)
		if (openCache && defaultDic.cache) {
			let cacheData = superCache.get(cacheKey)
			if (cacheData) {
				hub.close()
				ssprint('缓存数据', cacheData)
				uni.stopPullDownRefresh()
				return Promise.resolve(cacheData)
			}
		}
		return new Promise(function(resolve, reject) {
			uniCloud.callFunction({
				name: cloudFunStr,
				data: {
					action: action,
					data: jmData
				}
			}).then(res => {
				hub.close()
				uni.stopPullDownRefresh()
				if (res.result.code == 200) {
					if (openCache && defaultDic.cache && superCache.isCacheOfApi(url)) {
						let api_cache_config = superCache.getCustomCacheOfApi(url)
						const cacheTime = defaultDic.cacheTime || api_cache_config.time
						superCache.set(cacheKey, res.data.data, cacheTime)
					}
					resolve(res.result.data)
				} else {
					superTS(res.result.data)
					reject(res.result.state)
				}
			}).catch(err => {
				// //console.log('返回结果1', res.result)
				superTS(err)
				reject()
			})
		})
	}
	// 云函数请求
	// 云函数请求
	superImgCloudRequest(filePath, cloudPath, isAliyun = true, isCustom = false, otherDic = {}) {
		// const myCloud = uniCloud.init({
		// 	provider: 'aliyun',
		// 	spaceId: '3ffdfe4b-c797-470a-86fa-a89ed37c6313',
		// 	clientSecret: 'sYnGBgbGtujTGP4v+laqlA=='
		// });
		let self = this
		return new Promise(function(resolve, reject) {
			uniCloud.uploadFile({
				filePath: filePath,
				cloudPath: cloudPath
			}).then(res => {
				if (!isAliyun) {
					uniCloud.getTempFileURL({
						fileList: [res.fileID]
					}).then(fileRes => {
						resolve(fileRes.fileList[0]['tempFileURL'])
					})
				} else {
					resolve(res.fileID)
				}
			}).catch(err => {
				console.log('上传错误', err)
				superTS(err)
				hub.close()
				reject()
			})
		})
	}
	
}
export default superdata.getInstace()
